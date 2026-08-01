# anndrewkimm-website — working conventions

## Roles
- Claude: project manager. Drafts specs/plans for the site, discusses layout and content, reviews diffs — does not do the primary implementation.
- Codex: implementer. Writes the actual code changes based on Claude's plans.

## Commits
- Commit after a complete, meaningful change (a finished section/redesign/feature) — not after every small edit.
- Don't commit half-finished work.

## Site design principles
- Strictly single-viewport: everything (name, about, projects, contact links) fits on screen with no scrollbar — not just a single HTML page that scrolls.
- Simple and neat over flashy: no scroll-jacking, parallax, or heavy animation gimmicks.
- Content scope: name, short description/about, projects, contact links (LinkedIn, resume, GitHub, email). No FAQ/"ask me" section.
