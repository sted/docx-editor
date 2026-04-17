# Upstream Work Plan

Personal notes on ongoing docx-editor upstream contributions driven by ragui integration.
Tracked locally via `.git/info/exclude`.

---

## Current PRs

| #                                                        | Branch                      | Status | Description                                                               |
| -------------------------------------------------------- | --------------------------- | ------ | ------------------------------------------------------------------------- |
| [#270](https://github.com/eigenpal/docx-editor/pull/270) | `fix/theme-colors`          | Open   | OOXML tint/shade math + table cell theme color resolution                 |
| [#271](https://github.com/eigenpal/docx-editor/pull/271) | `fix/numbered-list-markers` | Open   | Resolve `%N` lvlText tokens in numbered list markers (body + table cells) |

---

## Pending Issues

### Issue B — Proprietary fonts fail to load with no fallback

**Severity:** Medium (affects text metrics for any doc using non-Google fonts)

**Observed in:** Both React and Svelte versions — **upstream issue**.

**Root cause:**

- `fontLoader.ts:64-143` only tries Google Fonts CDN
- When a font like "Avenir Next LT Pro" is requested, GET fails with 400, font fails to load
- No system font detection, no fallback mapping for proprietary fonts
- `FONT_MAPPING` table (lines 367-402) only maps Office fonts to Google equivalents; doesn't cover proprietary variants

**Fix options:**

1. Add more entries to `FONT_MAPPING` (e.g., "Avenir Next LT Pro" → "Montserrat" or similar)
2. Add system font detection using `document.fonts.check()` — if system has the font, skip Google Fonts fetch
3. Add a second fallback chain: proprietary → close Google alternative → generic system font
4. Silence 400 errors in console (they spam the logs even when fallback works)

**Recommended:** Combine 2 + 3:

- First check `document.fonts.check('12px "FontName"')` — use system font if available
- If not, look up Google Fonts mapping
- If neither, log once and use generic fallback (sans-serif/serif)

**Considerations:**

- System font detection isn't 100% reliable (browser quirks, fingerprinting protections)
- Need a `fontFallbackMap` for common proprietary → open alternatives
- Tests: mock `fetch` to simulate 400, verify graceful fallback; mock `document.fonts.check` for system font detection

---

## Svelte Adapter Issues (ragui)

These stay in ragui, not upstream:

- [ ] Write integration tests for `DocxEditor.svelte` — load fixture DOCX, verify page count, verify rendered text
- [ ] Handle selection/editing — currently view-only
- [ ] Footer on first page visibility — may be fixed once upstream list/font issues resolved

---

## Workflow Reminders

- Commit each fix to a separate branch from `main`
- Push branch to `origin` (your fork)
- PR from `sted:<branch>` → `eigenpal/docx-editor:main`
- Merge branch into local `dev` (your working branch)
- Push `dev` to `origin` so ragui has access
- Use `~/bin/upstream-pr <branch> eigenpal/docx-editor [n]` to automate
