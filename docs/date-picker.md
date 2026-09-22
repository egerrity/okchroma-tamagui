# The date range picker

The extended component: the one the kit does not ship and a product needs, built through
`docs/adding-a-component.md` at full size. Input first, range first, accessibility before
looks (decision 32). This file holds the rules a picker follows that no screen shows, the
map rows each state reads, and the accessibility contract the checklist tests.

## What it is

Two labelled fields, start and end, with the format written beside them, each with a
calendar button attached to its trailing edge; a row of preset ranges as button chips. The
fields alone complete a range. The button's name says what it does, Choose start date, and
once a date is set confirms it, Change start date and the date; on web the name also shows
as a tooltip. The aid differs by platform and the rest is one file:

- Web: a calendar popover anchored below the field's button, built to the grid pattern, one
  or two months wide, sized to its months. A dialog by role and not modal: no scrim, the
  page stays in view, an outside press closes it (decision 34).
- Native: the operating system's inline date picker for the field being edited, in the same
  dialog, tinted with the family's pen-70. The picker shows one selected day, so the
  dialog's heading names the end the next pick sets, Choose a start date or Choose an end
  date, on both platforms (decision 36).

A single-date mode is the same component with one field.

## The rules

| Situation | Rule |
|---|---|
| End picked before start | The two swap. |
| A pick while both ends are set | The range restarts; the pick is the new start. |
| The first pick after opening from a field | Sets that field's end: from Start, the pick is the new start and the end is chosen next; from End, the pick is the new end, swapping if it comes before the start. The calendar opens on that field's date. |
| Disabled days inside a range | Allowed. A disabled day cannot be picked, but a range may span one. |
| Start equal to end | Allowed: a one-day range. |
| Days before the minimum or after the maximum | Disabled in the grid; typed, an error names the bound. |
| A preset | Sets both ends from today. Its chip shows on while the value equals it. |
| A field cleared | Clears that end; the other stays. |
| Typed format | The locale's numeric order, written beside the field. The ISO form is always accepted. A two-digit year is this century. Separators may be slash, dot, dash or space. |
| Typed value that does not parse | The field takes the critical theme; the message names the format. |
| Typed end before start | The end field takes the critical theme; the message names the start. |
| Week start and names | From the device locale. |
| Months shown on web | Two side by side from 640 wide, else one. |
| Where the calendar opens on web | Below its button, aligned to whichever of its edges keeps the panel in the window; above it when there is no room below; over it when there is room on neither side; a panel taller than the room scrolls inside. |
| Days outside the month | Not drawn; the cell is empty. |
| Today | Marked with the neutral outline; when today is an end of the range, the stamp wins and the name still says today. |
| Dates | Calendar days, year, month and day, never instants; the model converts only to format. |

## The map rows each state reads

No row is added for the picker. Every state is a tier or a stop that exists.

| State | Theme or key |
|---|---|
| A day | `neutral_hint` |
| Today | `neutral_outline` |
| Start and end of the range | `<family>_solid`, the stamp |
| Inside the range | `<family>_hint` with the selected ground, `subtle-bg-enabled` |
| Would be inside, while the end is being chosen | `<family>_hint` on its hover rung |
| Disabled | the engine's `disabled-opacity` on the cell |
| Weekday header | `neutral-pencil-47` |
| Month heading, the field labels | body text |
| Month navigation | `neutral_hint` buttons |
| The fields' calendar buttons | `neutral_outline` Buttons attached to the field, the glyph in the theme's text color |
| Presets | `<family>` button chips |
| The fields | the Input themes; `critical` when invalid |
| The calendar's container | on web the popover panel, the PopperContent theme, the dialog's panel without its scrim; on native the DialogOverlay and DialogContent themes |
| The native picker's tint | `<family>-pen-70`, the same stop in both modes. The picker takes one color and makes two drawings with it: a selected day as tint-colored text on a wash of the tint, and a selected day that is also today as a label on a solid circle of the tint. iOS picks that label by the tint's luma on the sRGB values as written: black above 0.8, white at or below it. That is the system's own rule, read from its code and promised nowhere (decision 33). Android's picker draws the theme's inverse text, white in light and black in dark, the same pairing. Pen-70 is a text stop, so it reads on the plane in both modes; in light it is dark and holds white at twelve to one or better; in dark it sits above the line in every brand and family and holds black at fifteen to one or better. The check's rule E holds the ratios for both labels and a margin of 0.05 from the line. |

The band: cells inside the range abut with square corners; the start is rounded on its
leading side, the end on its trailing side, a one-day range on both.

## The accessibility contract

The lines `docs/checklist-web-a11y.md` tests for the picker, in the order they matter.

1. The fields alone complete a range with a keyboard and with a screen reader, no calendar.
2. Each field is labelled, and the format is an instruction tied to it, not a placeholder.
3. An invalid field says so, and its message is tied to it and names the fix.
4. The presets are buttons with a pressed state.
5. The calendar opens only from a field's own button, never on focus of a field.
6. The calendar is a dialog: labelled, focus inside on open, Escape closes, focus returns.
   On web it is not modal: anchored to its button, no scrim, an outside press closes it
   and leaves focus on the control it went to, and Tab cycles inside it.
7. The grid is one tab stop. Arrow keys move by day and by week, Page keys by month, Home
   and End to the ends of the week, Enter picks, and crossing a month boundary turns the page.
8. Every cell is named with its full date and its state: today, start of range, end of
   range, in range, disabled.
9. A month change and a completed range are announced once, politely.
10. A cell is at least 24 by 24 CSS pixels.

WCAG, in plain English: everything works from the keyboard
([Keyboard](https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html)); errors are
identified in text ([Error Identification](https://www.w3.org/WAI/WCAG22/Understanding/error-identification.html))
with a suggested fix ([Error Suggestion](https://www.w3.org/WAI/WCAG22/Understanding/error-suggestion.html));
fields carry labels or instructions ([Labels or Instructions](https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions.html));
targets meet the minimum size ([Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)).

## Not in it

Segmented day, month and year entry; more than one date that is not a range; time; calendars
other than the Gregorian; right-to-left layout; Android.
