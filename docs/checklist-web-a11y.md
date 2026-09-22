# Web accessibility checklist

The trigger for decision 2. Run on the web app with a real keyboard, both modes, after any
change to the roster. A failure that lives in the theme is fixed in the map. A failure that
lives inside a Tamagui component, which the theme cannot reach, opens the contingency.

## Button

- [ ] Exposed with the `button` role and its label.
- [ ] Reachable by Tab; activates on Enter and on Space.
- [ ] The focus ring shows on keyboard focus and not on mouse click.
- [ ] Disabled is announced and is not focusable by Tab.

## Input

- [ ] Labelled: the label's `for` reaches the input, and the name is announced.
- [ ] Placeholder is not the only label.
- [ ] Invalid is conveyed (`aria-invalid`) and the message is associated with the field.
- [ ] The focus edge is visible in both modes.

## Dialog

- [ ] Opens from mouse and from keyboard.
- [ ] Exposed with the `dialog` role and labelled by its title.
- [ ] Focus moves inside on open.
- [ ] Escape closes it.
- [ ] Focus returns to the trigger on close.
- [ ] Content behind is inert while it is open.

## Date range picker

`docs/date-picker.md` holds the contract; these are its lines. The field path comes first.

- [ ] The two fields alone complete a range from the keyboard, no calendar opened.
- [ ] Each field is labelled, and the format is an instruction tied to it, not only a placeholder.
- [ ] An impossible or misordered date marks its own field invalid, and the message tied to it names the fix.
- [ ] The presets are buttons with a pressed state, and one fills both fields.
- [ ] The calendar opens from a field's own button only, never on focus of a field; the button is attached to the field, named for it, and its name confirms the date once set.
- [ ] The calendar is a dialog: labelled, focus inside on open, Escape closes, focus returns to the button. On web it is not modal: anchored to the button, no scrim, an outside press closes it and leaves focus where it went, Tab cycles inside.
- [ ] The grid is one tab stop; arrows move by day and week, Page keys by month, Home and End to the week's ends; crossing a month turns the page.
- [ ] Every cell is named with its full date and its state; cells in the range are selected.
- [ ] A month change and a completed range are announced once.
- [ ] A cell is at least 24 by 24 CSS pixels.

## Record

Date, mode, result per line, and for a failure: theme or component.

**2026-09-15, light and dark, Vite dev server, automated browser.** Passed by reading the
DOM: button roles; Tab reaches every control; the focus ring shows on keyboard focus and
not on click; disabled is `aria-disabled` and unreachable by Tab; the inputs are labelled
by `for`; the invalid input carries `aria-invalid`; the focus edge is visible in both
modes; the dialog opens from a click, has the `dialog` role, `aria-modal`, a title that
labels it and a description; focus moves inside; Escape closes it; focus returns to the
button. Not settled: activation by Enter and Space, and the tab-order trap while the
dialog is open, because the automated browser's key events activate no button at all (a
plain native button included); and whether the page behind is marked inert, which no
attribute showed. These four lines are run with a real keyboard, and the answer is written
here before decision 2 is weighed.

**2026-09-15, later, light, Vite dev server, trusted key events through Chrome's debugging
protocol (a script outside the repository).** Passed: Tab reaches the opening button;
Enter opens with focus inside; Space opens with focus inside; six Tabs and three
Shift+Tabs cycle between the dialog's two buttons and never leave it; Escape closes and
focus returns to the opening button. The one failure found on the way, focus landing on
the body after close, was the kit focusing an unset trigger ref, fixed through
`onCloseAutoFocus` (decision 17). Inert marking of the page behind is still not shown by
any attribute; the trap holds by focus, not by `aria-hidden`.

A hand run on another machine the same day reported Space, the tab trap and Escape as
failing; the order of presses there compounded (a Space pressed while the dialog was
already open moves focus), so it is re-run in this order from a fresh reload: Tab to the
button, Space, Escape, Enter, Tab three times, Escape. Browser name recorded with it.

**2026-09-21, dark, Vite dev server, DOM read.** Disabled buttons were interactive: the
kit's `disabled` variant sets pointer events to none, but that rule never reaches the web
element in this setup, and the web hover style is CSS, which the kit's runtime gate does
not stop. The Button and Chip parts now set pointer events to none themselves when
disabled, so a disabled control takes no hover, press or click. Still open, and inside the
kit: a disabled button keeps a tab stop, because the core marks the element `disabled`
only when it recognizes the element as a button, which it does not here. The checklist's
"not focusable by Tab" line fails on that point; it is announced as disabled.

**2026-09-22, hand run with a real keyboard, two browsers: the Claude desktop app's browser
pane and Chrome, Vite dev server.** Tab reaches the Delete account button and the dialog
opens from the keyboard; the key that opened it was not named. Tab does not skip the
disabled Saved button: the "not focusable by Tab" line fails by hand in both browsers, and
the failure is inside the kit, as the 2026-09-21 entry says. Not run: Space, Escape, the
tab trap inside the dialog, and the order the entry above asks for. Mode not named.

**2026-09-22, light and dark, Vite dev server, trusted key and mouse events through Chrome's
debugging protocol (the scenario is outside the repository), the date range picker.** All
ten lines pass in both modes, 37 checks each: the group and the fields are labelled with
the format tied to both; an impossible date marks the start invalid with a message naming
the format; an end before the start marks the end invalid with a message naming the start;
a short typed date is accepted and rewritten in the canonical form; a preset fills both
fields, clears the error and shows pressed, and the range is announced; Enter on the
button opens a labelled modal dialog with focus on a day; the grid is named by the month
heading and described by the instructions; one tab stop among 61 cells, before and after
moving; ArrowRight, ArrowDown, Home, End, PageUp and PageDown move as the pattern says and
the heading turns with the page; Enter picks the start with an announcement and an
instruction, the days between show the preview, Enter picks the end, the cells name start,
inside and end, four gridcells are selected, the fields show the range, the range is
announced; Escape closes and focus returns to the button; Tab runs start, end, Calendar,
then the presets; cells are 40 pixels; the ends are the stamp with its on-text, the inside
the selected ground, today the neutral edge, the panel the high plane. Owed by hand: the
same run with a real keyboard, VoiceOver on the native fields and the system picker, and
the browser name.

**2026-09-22, late, light and dark, Vite dev server, trusted key and mouse events through
Chrome's debugging protocol (the scenario is outside the repository), the calendar as a
popover (decision 34).** All ten lines pass in both modes, 42 checks each: the 37 of the
run above, with the dialog line now reading labelled and not modal, one element with the
role, and five for the popover: it is anchored to the Calendar button, above or below,
inside the window; no scrim, the ground over the page stays clear; the panel is sized to
its months, 618 wide at 900; six Tabs stay inside; a press on the start field closes it
and leaves focus on the field. Escape still closes and returns focus to the button. Owed by
hand: the same run with a real keyboard, VoiceOver, and the browser name.

**2026-09-22, later still, light and dark, Vite dev server, trusted key and mouse events
through Chrome's debugging protocol (the scenario is outside the repository), the calendar
button attached to each field (decision 35).** All ten lines pass in both modes, 46 checks
each: the 42 of the run above and four for the buttons: each field has its own, named
Choose start date and Choose end date; the button is attached to its field, the same
height, one shared edge, square where they meet and the field's corner outside; its name
shows as a tooltip; and once a range is picked the start's name reads Change start date
with the date. Escape returns focus to the field's button; Tab runs start, its button, end,
its button, then the presets. The popover hangs from the field's button, shifted into the
window when the button's edge would put it outside. Owed by hand: the same run with a real
keyboard, VoiceOver, and the browser name.
