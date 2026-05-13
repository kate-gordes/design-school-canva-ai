#!/usr/bin/env tsx

import { readdir, stat, mkdir, copyFile, rm } from 'fs/promises';
import { join, resolve } from 'path';
import { homedir } from 'os';
import { execSync } from 'child_process';

/**
 * Check if the git repository is on the correct branch
 */
async function checkGitBranch(repoPath: string): Promise<void> {
  const expectedBranch = 'cmrn/easel-ai-agent-instructions';

  try {
    // Get the current branch name
    const currentBranch = execSync('git rev-parse --abbrev-ref HEAD', {
      cwd: repoPath,
      encoding: 'utf8',
    }).trim();

    if (currentBranch !== expectedBranch) {
      console.error(`❌ Your canva/canva repo is not in the correct branch.`);
      console.error(`   Current branch: ${currentBranch}`);
      console.error(`   Expected branch: ${expectedBranch}`);
      console.error('');
      console.error(
        'Please run the following command in a new terminal to switch to the correct branch:',
      );
      console.error('');
      console.error(
        `cd ~/work/canva && git remote set-branches --add origin ${expectedBranch} && git fetch && git checkout ${expectedBranch}`,
      );
      console.error('');
      process.exit(1);
    }

    console.log(`✅ Git branch check passed: ${currentBranch}`);
  } catch (error) {
    console.error(`❌ Error checking git branch in ${repoPath}:`);
    console.error(`Make sure ${repoPath} is a valid git repository.`);
    console.error((error as Error).message);
    process.exit(1);
  }
}

/**
 * Clean up the .agent/canva directory by removing it completely
 */
async function cleanupAgentDirectory(): Promise<void> {
  const agentCanvaDir = '.agent/canva';

  try {
    await rm(agentCanvaDir, { recursive: true, force: true });
    console.log('🧹 Cleaned up existing .agent/canva directory');
  } catch (error) {
    // If the directory doesn't exist, that's fine
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      console.warn(
        `Warning: Could not clean up .agent/canva directory: ${(error as Error).message}`,
      );
    }
  }
}

/**
 * Recursively search for agent.md files (case-insensitive) in a directory
 */
async function findAgentMdFiles(dirPath: string, foundFiles: string[] = []): Promise<string[]> {
  try {
    const items = await readdir(dirPath);

    for (const item of items) {
      const fullPath = join(dirPath, item);

      try {
        const stats = await stat(fullPath);

        if (stats.isDirectory()) {
          // Skip common directories that are unlikely to contain agent.md files
          if (!['node_modules', '.git', '.next', 'dist', 'build'].includes(item)) {
            await findAgentMdFiles(fullPath, foundFiles);
          }
        } else if (stats.isFile() && item.toLowerCase() === 'agent.md') {
          foundFiles.push(fullPath);
        }
      } catch (error) {
        // Skip files/directories we can't access
        console.warn(`Warning: Cannot access ${fullPath}: ${(error as Error).message}`);
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dirPath}: ${(error as Error).message}`);
  }

  return foundFiles;
}

/**
 * Extract the relative path after 'web/src/' from the full path
 */
function extractRelativePath(fullPath: string): string | null {
  const webSrcIndex = fullPath.indexOf('web/src/');
  if (webSrcIndex === -1) {
    return null;
  }

  // Get everything after 'web/src/'
  const afterWebSrc = fullPath.substring(webSrcIndex + 'web/src/'.length);

  // Remove the filename to get just the directory structure
  const pathParts = afterWebSrc.split('/');
  pathParts.pop(); // Remove the filename

  return pathParts.join('/');
}

/**
 * Ensure directory exists, creating it recursively if needed
 */
async function ensureDirectory(dirPath: string): Promise<void> {
  try {
    await mkdir(dirPath, { recursive: true });
  } catch (error) {
    console.error(`Error creating directory ${dirPath}: ${(error as Error).message}`);
    throw error;
  }
}

/**
 * Copy agent.md files to the .agent/canva structure
 */
async function copyAgentFiles(agentFiles: string[]): Promise<void> {
  const baseOutputDir = '.agent/canva';

  // Ensure base directory exists
  await ensureDirectory(baseOutputDir);

  let copiedCount = 0;
  let skippedCount = 0;

  for (const filePath of agentFiles) {
    const relativePath = extractRelativePath(filePath);

    if (!relativePath) {
      console.log(`❌ Skipping ${filePath}: not in expected web/src/ structure`);
      skippedCount++;
      continue;
    }

    const outputDir = join(baseOutputDir, relativePath);
    const outputFile = join(outputDir, 'AGENT.md');

    try {
      // Ensure the output directory exists
      await ensureDirectory(outputDir);

      // Copy the file
      await copyFile(filePath, outputFile);
      console.log(`✅ Copied: ${filePath} → ${outputFile}`);
      copiedCount++;
    } catch (error) {
      console.log(`❌ Error copying ${filePath}: ${(error as Error).message}`);
      skippedCount++;
    }
  }

  // Summary with emojis
  if (copiedCount > 0 && skippedCount === 0) {
    console.log(`\n🎉 Summary: ${copiedCount} files copied successfully!`);
  } else if (copiedCount > 0 && skippedCount > 0) {
    console.log(`\n⚠️ Summary: ${copiedCount} files copied, ${skippedCount} files skipped`);
  } else if (copiedCount === 0 && skippedCount > 0) {
    console.log(`\n❌ Summary: No files copied, ${skippedCount} files skipped`);
  } else {
    console.log(`\n🤷 Summary: No files processed`);
  }
}

/**
 * Main function
 */
async function main(): Promise<void> {
  // Get the search path from command line argument or use default
  const defaultPath = resolve(homedir(), 'work/canva/web');
  const searchPath = process.argv[2] ? resolve(process.argv[2]) : defaultPath;

  console.log(`🔍 Searching for agent.md files in: ${searchPath}`);
  console.log('---');

  try {
    // Check if the directory exists
    await stat(searchPath);

    // Check git branch before proceeding
    await checkGitBranch(searchPath);

    // Clean up existing .agent directory
    await cleanupAgentDirectory();

    const agentMdFiles = await findAgentMdFiles(searchPath);

    if (agentMdFiles.length === 0) {
      console.log('No agent.md files found.');
      return;
    }

    console.log(`\n📋 Found ${agentMdFiles.length} agent.md file(s):`);
    agentMdFiles.forEach((file, index) => {
      console.log(`${index + 1}. ${file}`);
    });

    console.log('\n--- Copying files to .agent/canva structure ---');
    await copyAgentFiles(agentMdFiles);
  } catch {
    console.error(`❌ Error: Directory ${searchPath} does not exist or cannot be accessed.`);
    console.error(`Please check the path or provide a different directory as an argument.`);
    console.error(`Usage: npm run fetch-agent-mds [optional-path]`);
    process.exit(1);
  }
}

main().catch(error => {
  console.error('Unexpected error:', error);
  process.exit(1);
});
