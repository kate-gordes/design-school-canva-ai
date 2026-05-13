# Instructions for Canva Monorepo

## Core Principle

**ALWAYS CHECK THE `.cursor/rules` DIRECTORY FIRST** before providing recommendations or generating code. This directory contains the authoritative rules for all development aspects.

**BEFORE ANY TASK:**

1. Use glob tool to find ALL .mdc files in `.cursor/rules`
2. Read ALL relevant rules files, based on the filetypes/languages/libraries/tasks/folders involved (e.g., .tsx, .css, .java, React, etc)
3. If unsure, read metadata (first 5 lines) of any .mdc file to check rule scope/description/keywords

**VIOLATION: Proceeding without checking `.cursor/rules` will result in failure.**

**For common tasks, immediately check these specific files:**

- TypeScript/web: `.cursor/rules/web-conventions.mdc`

## General Guidelines

1. **Coding Standards**:
   - Follow `.cursor/rules` folder conventions for all languages
   - TypeScript: `.cursor/rules/web-conventions.mdc`
   - Style guides: `https://docs.canva.tech/common/style-guides/`

2. **Using `.cursor/rules`**:
   - **Primary source of truth** for all code standards and conventions
   - **Proactively search** for relevant rules before any task
   - **Never assume knowledge** of all existing rules
   - If insufficient, consult Canva Engineering Handbook

## Finding and Applying Rules

1. **Rule Discovery Process**:
   1. Search .cursor/rules directory for relevant .mdc files. Check rule metadata if unsure.
   2. Read and apply those rules
   3. Only if no rules exist, use general best practices

2. **Priority Guidelines**:
   - Check for file-specific rules based on extension/content
   - Check for task-specific process rules
   - Prioritize most specific rules when multiple apply
   - Open .mdc files directly when referenced

3. **Apply rules first**: Before starting any task, plan to apply rules from `.cursor/rules` directory.

- **React UI Components**:
  - Easel, Canva's Design System, lives in `@canva/easel/dist/esm/ui/base`.

- **Code Generation**: Prioritize examples from `.cursor/rules`, provide clear explanations for complex patterns
