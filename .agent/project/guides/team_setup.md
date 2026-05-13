# Team Development Setup

This document outlines the automatic formatting and linting setup for team members.

## 🚀 **Automatic Formatting - Multiple Layers**

We've implemented several layers of automatic formatting to ensure consistent code:

### 1. **Git Pre-commit Hooks (Primary)**

- **Automatically formats** code when you commit
- **Automatically fixes** ESLint issues where possible
- **Blocks commits** if there are unfixable linting errors
- Works for **all team members** automatically after running `npm install`

### 2. **Development Script Formatting**

When you run `npm run dev`, it automatically formats all code first:

```bash
npm run dev  # Formats code, then starts dev server
```

### 3. **Build Script Formatting**

When you run `npm run build`, it formats and lints:

```bash
npm run build  # Formats code, lints, then builds
```

### 4. **VSCode Format-on-Save**

If using VSCode, code automatically formats when you save files.

## 📋 **Setup Instructions for New Team Members**

### Required Steps:

1. **Authenticate and install dependencies** (sets up registry access and pre-commit hooks):

   ```bash
   npm run setup    # authenticates + writes .npmrc with the token
   npm install      # installs dependencies using the .npmrc
   ```

2. **Install recommended VSCode extensions** (if using VSCode):
   - Prettier (esbenp.prettier-vscode)
   - ESLint (dbaeumer.vscode-eslint)
   - EditorConfig (editorconfig.editorconfig)

### Optional but Recommended:

3. **Verify setup** by making a small change and committing:
   ```bash
   # Make any small edit to a file
   git add .
   git commit -m "test formatting"
   # You should see prettier and eslint run automatically
   ```

## 🔧 **How It Works**

### Pre-commit Hook (Main Protection)

- **Triggered**: Every time someone runs `git commit`
- **What it does**:
  - Formats all staged files with Prettier
  - Fixes ESLint issues automatically where possible
  - Allows warnings but blocks commits on errors
- **Files affected**: `.js`, `.jsx`, `.ts`, `.tsx`, `.json`, `.css`, `.md`

### Development Workflow

- **`npm run dev`**: Format → Start development server
- **`npm run build`**: Format → Lint → Build for production
- **VSCode**: Format on save, fix ESLint on save

## 📖 **Manual Commands**

If you ever need to manually format or lint:

```bash
# Format all files
npm run format

# Check if files are formatted
npm run format:check

# Lint with warnings allowed
npm run lint:check

# Strict lint (warnings cause failure)
npm run lint
```

## 🚨 **Troubleshooting**

### "Husky command not found"

```bash
npm install  # Reinstall to set up hooks
```

### "Pre-commit hook not running"

```bash
chmod +x .husky/pre-commit  # Make hook executable
```

### "VSCode not formatting"

1. Install Prettier extension
2. Set as default formatter in VSCode settings
3. Enable format-on-save

### "Code still not formatted from teammates"

- They need to run `npm install` to set up pre-commit hooks
- They need to commit their changes (formatting happens on commit)
- They may be using `git commit --no-verify` which skips hooks

## 💡 **Best Practices**

1. **Always commit through git** (not through IDEs that might skip hooks)
2. **Don't use `--no-verify`** flag unless absolutely necessary
3. **Run `npm run dev`** to ensure formatting before starting work
4. **Install recommended VSCode extensions** for the best experience

## 🎯 **Expected Outcome**

After setup, **all code should be automatically formatted** with no manual intervention required. If you're still receiving unformatted code from teammates:

1. Ensure they've run `npm install` after pulling the latest changes
2. Ask them to commit their changes (formatting happens on commit)
3. Verify they're not using `git commit --no-verify`

---

**Questions?** Check with the team lead or refer to `testing.md` for more development workflow information.
