# Design - MurdPuzzle

A locked design system for the app. Every screen should feel like a modern case hub: playful enough for a game, restrained enough for deduction.

## Genre
playful

## Macrostructure family
- Marketing pages: Marquee Case Desk with a progress/status rail.
- App pages: Mobile-first inline Case Workbench with the complete logic grid in the reading flow; desktop expands the same model into a sticky split workspace.
- Content pages: Long Document with compact teaching cards.

## Theme
- Paper: warm ivory, not beige-heavy.
- Ink: dark coffee black.
- Accent: crimson for primary action.
- Secondary accents: cyan for active tools, violet-pink for game energy.
- Rule: soft amber-grey borders, reserving hard black for grid logic and high-emphasis evidence.

## Typography
- Display: Leelawadee UI / Noto Sans Thai, weight 800, normal.
- Body: Noto Sans Thai / Leelawadee UI, weight 400-700.
- Mono: Courier New for case IDs, status chips, and system labels.

## Spacing
4-point named scale in `tokens.css`. Screens should use compact vertical rhythm on mobile and wider breathing room on desktop.

## Motion
- Hover: transform and shadow only.
- Reveal: opacity only for screen transitions; opening the notebook must feel immediate and must preserve the reader scroll position.
- Reduced motion: duration collapses to near-zero.

## Microinteractions stance
- Primary actions should read as game-start controls.
- Success is clear but quiet.
- The complete logic grid stays visible in the case page; never require switching between Grid and Clues.
- Workbench controls keep stable names and positions above the grid.
- The grid always shows every category pair. Cells scale as a complete square on narrow screens, with prominent state marks and no horizontal page scroll.
- Save case progress quietly; Undo and Clear live inside the notebook rather than global navigation.

## CTA voice
- Primary CTA: crimson filled button, 8px radius, short action text.
- Secondary CTA: light surface button with border and subtle hover lift.

## What Pages Must Share
- Warm investigative background.
- Crimson primary action.
- Cyan active/tool state.
- 8px card radius.
- Mono case labels.
- Bottom dock and top nav should feel like the same product.
