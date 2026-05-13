## Advanced Context Coding

It’s a guide for a friendlier way to work with AI on prototype builds. Instead of the AI guessing from a long chat, it reads a few short “context” docs (maps of the app, simple how‑tos, and design rules) and then makes small, targeted edits.

Why it’s better than normal chat prompting:

- The AI knows where to look (less guessing, fewer wrong files)
- Changes stay small and tidy (easier to review and undo)
- The look and feel stays consistent (it follows the UI guide)
- You spend less time re‑explaining and more time saying “looks good” or “nudge this”

### Core idea (Prototyping with Easel + AI)

- Start with a tiny task message that names the place (use wording from `docs/entrypoints.md`), the desired outcome, and 2–3 acceptance checks. For any UI change, the AI should load the `easel-prototype` skill.
- Ask the AI to use the context docs, keep the edit small and reversible.
- The AI reads the context, targets the right spot, and makes a focused change.
- You validate only against the acceptance checks (no code reading). If it’s off, reply with simple feedback.
- If behavior changed, ask the AI to add a one‑liner to `docs/flows.md`; if the pattern is reusable, a short tip to `docs/tasks.md`.

---

## 1) Tell the AI what you want (copy/paste)

Use short, friendly sentences. Focus on what you should see, not how to build it.

### Quick Spec: Say "Spec"

When you say **"Spec"**, the AI will guide you through four questions, one at a time, to build a clear specification:

1. **Goal**: What do you want changed?
2. **What it should look like**: 1–2 lines about the result
3. **What should stay the same**: Anything that must not move/change
4. **How I'll check**: What you'll click or look at to confirm

This conversational approach helps you think through each aspect without needing to remember the template. The AI will wait for your answer to each question before moving to the next.

### Full template (if you prefer to write it all at once):

```
Goal: <What you want changed>
What it should look like: <1–2 lines about the result>
What should stay the same: <anything that must not move/change>
How I'll check: <what you'll click or look at to confirm>
```

Where to find context (plain English):

- `AGENT.md` – Start here. A simple map of the project with links.
- `docs/entrypoints.md` – List of main screens and areas (e.g., Brand page, Editor). Helps you name the place you want changed.
- `docs/flows.md` – Tiny stories of how things behave. Helps you say how you’ll check the result.
- `docs/tasks.md` – One‑page how‑tos for common tweaks. The AI will follow these.
- `easel-prototype` skill – Easel-first rules (components, tokens, icons, layout). The AI loads this for any UI change.

How the docs plug into your message:

- Goal → Use the exact area names from `docs/entrypoints.md` (e.g., “Brand page header”, “Editor toolbar”).
- What it should look like → Describe the result in plain words (e.g., "use tabs", "keep spacing consistent"); the `easel-prototype` skill maps that to components and tokens.
- What should stay the same → Reuse nearby area names from `docs/entrypoints.md` (so nothing else moves).
- How I’ll check → Take cues from `docs/flows.md` (describe the click/see steps as simple checks).
- Extras (optional) → If it’s a common tweak, mention a tip from `docs/tasks.md` so the AI follows the right pattern.

---

## 2) Sarah’s example: Swap the Brand header for Wonderbox

Sarah is a designer. She doesn’t touch code. She checks a couple of docs for words to use, then tells the AI what she wants.

Sarah’s message to the AI:

```
Goal: Add a quick actions button in the Document Doctype that will eventually show a list of elements to insert in the document
What it should look like: I should see a circular 32 x 32px icon button with a centred plus sign. The icon uses Easel's primary color for foreground (including border) and surface color for background. The icon is vertically and horizontally centered.
What should stay the same: The Document content stays the same and nothing happens for now when I click the icon button
How I’ll check: I'll click the Document Canvas to start editing. The cursor will be flashing because I'm ready to add content. At that moment the plus button appears on the left margin.
```

What happens next:

- The AI makes the change.
- Sarah opens the app and checks AI has done its job

If anything is off, Sarah replies with simple, non‑technical feedback:

- “Move the button 5px to the left”
- "The total size of the button is 32px so the icon should be 24px”

---

## 3) After the change

- If behavior changed, ask the AI to add a short note in `docs/flows.md`.
- If this pattern might be reused, ask the AI to add a short tip in `docs/tasks.md`.
- Now Sarah can move on to the flyout menu that appears when the button is clicked

---

## 4) Keep it light

For each new change: say what you want → AI builds (with Easel) → you look and react. Small steps make quick progress.

### Screenshot-to-Easel workflow

Designers can attach screenshots (e.g., from Figma) and ask the AI to translate them to Easel components. Tips:

- Identify key regions (header, toolbar, cards) and map them to Easel primitives (`Box`, `Rows`, `Columns`, `Tabs`, `Drawer`)
- Use tokens and props over custom CSS (speed + consistency)
- Keep edits small; verify after each step and iterate
