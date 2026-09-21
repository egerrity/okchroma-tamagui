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
