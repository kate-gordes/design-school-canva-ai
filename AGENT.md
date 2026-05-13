## Agent Orientation

Welcome. This repository is an AI-friendly Canva prototype built with Vite + React and the Easel design system. This file is your hub: it links the minimal set of docs you need to quickly understand structure, flows, and how to safely make changes.

Important operating note: Do not run local commands yourself. The maintainer runs npm scripts. Propose commands if needed, but do not execute.

## Essential Reading

**Before writing any code, read these:**

1. 📘 **.agent/project/guides/coding_guide.md** - General coding standards and best practices (MANDATORY)

**Before writing any text, read these files and think deeply about how to implement these rules perfectly and consistently:**

3. 🎨 **.agent/project/guides/content/content_guide.md** - Canva's voice, tone, and writing principles (MANDATORY)
4. 📝 **.agent/project/guides/content/content_tasks.md** - Specific content patterns for buttons, navigation, forms (MANDATORY)
5. ⚠️ **.agent/project/guides/content/error_patterns.md** - Error messages and user feedback (MANDATORY)

**When adding polish and fidelity to prototypes, read these:**

6. 📱 **.agent/project/guides/mobile_design.md** - Mobile-first considerations (if designing for mobile)
7. ♿ **.agent/project/guides/accessibility.md** - Keyboard navigation, focus states, color contrast, ARIA labels, alt text

These make prototypes feel like real Canva - not just look like it.

## Quick Links

### Getting Started

- Runbook (how to run, build, test, lint): .agent/project/guides/runbook.md
- Entrypoints (where things begin): .agent/project/guides/entrypoints.md
- Core flows (how things work): .agent/project/guides/flows.md

### Making Changes

- Task cookbook (common edits): .agent/project/guides/tasks.md
- Scenario map (flows → tests): .agent/project/guides/scenarios.md
- Commands cheatsheet: .agent/project/guides/commands.md
- Agent workspace: .agent/README.md

## Guardrails You Must Follow

### ⚠️ UI Development — MANDATORY, NON-NEGOTIABLE

**Any time you edit, write, tweak, refactor, or style frontend / UI code in this project — components, pages, layouts, forms, dialogs, empty states, copy, HTML, or CSS — you MUST use the Easel skills. No exceptions.**

- **Building or modifying UI** → load and follow `easel-prototype`. All UI must be composed from Easel components, tokens, and icons. Do **not** hand-roll styles, raw HTML primitives, or ad-hoc CSS when an Easel equivalent exists.
- **After any UI change** → run `easel-validator` to confirm the code follows Easel conventions.

Do not skip these skills to "save time", do not improvise UI with plain `<div>`s and inline styles, and do not assume you remember the Easel API — always read the skill file first. If you write or change UI code in this repo without going through the Easel skills, you are doing it wrong.

### Code Quality

- Use `@/` absolute imports rather than long relative paths
- Do not add barrel files; import from the concrete file
- Do not use `@ts-ignore` or `as any`; use proper types
- Do not modify tests unless explicitly asked

### Infrastructure

- Never run terraform or AWS CLI

## Where Global State Lives

- Provider: src/providers/App.tsx
- Context: src/contexts/App.ts
- Hook: src/hooks/useAppContext.ts

## Key Surfaces

- App shell and routing: src/App.tsx
- Editor: src/pages/Editor/\*
- Home: src/pages/Home/\*

**Before editing any surface:**

1. Check .agent/project/guides/flows.md for how it works
2. Check .agent/project/guides/tasks.md for common patterns

## Workflow Summary

### Additional Considerations

**Throughout the prototyping process:**

- Refer back to Essential Reading guides as needed
- Content docs (CONTENT_GUIDE, CONTENT_TASKS, ERROR_PATTERNS) apply to ALL UI text
- Accessibility and mobile guidelines apply when relevant to your task

**Goal:** Start simple, add realism when exploring high-fidelity experiences.

---

## Advanced Context Coding

This repo follows Advanced Context Coding principles. See: https://github.com/humanlayer/advanced-context-engineering-for-coding-agents/blob/main/ace-fca.md

Key patterns implemented:

- Semantic landmarks (entrypoints and orchestrators documented)
- Flow docs that narrate triggers → state → render
- Task cookbook for common changes

## 🎯 SPEC WORKFLOW - TRIGGER: When User Says "spec"

**CRITICAL: When the user types ONLY the word "spec" (any case: spec/Spec/SPEC), this is a trigger to start the spec workflow.**

**YOU MUST immediately recognize this trigger and guide them through these four questions, ONE AT A TIME:**

1. **Goal**: What do you want changed?
2. **What it should look like**: 1–2 lines about the result
3. **What should stay the same**: Anything that must not move/change
4. **How I'll check**: What you'll click or look at to confirm

**MANDATORY Process:**

- Recognize "spec" as the trigger word
- Ask ONLY the first question and WAIT for their answer
- After they answer, ask the next question
- Continue sequentially until all four questions are answered
- THEN proceed with implementing based on their complete specification

**Example:**

```
User: spec
Assistant: Let's spec this out. First question - What do you want changed?
User: [their answer]
Assistant: Got it. Next - What should it look like? (1-2 lines about the result)
User: [their answer]
Assistant: Perfect. What should stay the same? (Anything that must not move/change)
User: [their answer]
Assistant: Great. Finally - How will you check this? (What you'll click or look at to confirm)
User: [their answer]
Assistant: Excellent, I have the full spec. [proceeds with implementation]
```

This conversational approach helps break down requirements into clear, actionable specs. See `.agent/project/guides/how_to_vibe_code.md` for the full context and examples.
