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
