# Skill: Page Porter

Orchestrated page extraction from the Canva monorepo into the prototype.

See the full skill at: `.agents/skills/page-porter/SKILL.md`

---

## Quick start

Invoke with a page route or name:

- `page-porter /anon-home` — anonymous home page
- `page-porter /home` — logged-in home page
- `page-porter /download-mac` — macOS download page

The orchestrator will:

1. Screenshot `localhost:9090` and discover all page slots
2. Audit all slot source files in parallel (one agent per slot)
3. Port all slots in parallel (one agent per slot)
4. Validate the prototype against the monorepo
5. Assemble the page and add the route

## How this differs from `monorepo-to-prototype`

| `monorepo-to-prototype`                     | `page-porter`                                       |
| ------------------------------------------- | --------------------------------------------------- |
| Single agent, all phases                    | Orchestrator + 5 specialized subagents              |
| All rules in one 700-line context           | Rules split by agent — each gets only what it needs |
| Sequential slot processing                  | Parallel slot processing                            |
| Component-specific rules always in context  | Component advisories loaded on-demand only          |
| Better for single components or small pages | Better for full-page extractions with 3+ slots      |

## When to use `monorepo-to-prototype` instead

For single-component extractions or quick fixes to an existing page, the original `monorepo-to-prototype` skill may be faster. `page-porter` is optimized for full-page extractions with multiple slots.
