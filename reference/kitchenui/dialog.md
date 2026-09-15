# Dialog

Round 8, 2026-09-05. Wraps Base UI `Dialog` from `@base-ui/react/dialog`. Adds the popup
family's backdrop (docs/families.md, popups); Alert Dialog shares this stylesheet.

## Parts

| Part | Attribute | What it is |
|---|---|---|
| root, portal | none | Base UI's, no element; passed through. `createHandle` too. |
| trigger | `data-part="dialog-trigger"` | Base UI's `<button>`; usually one of our buttons through `render`. |
| backdrop | `data-part="dialog-backdrop"` | Base UI's `<div>`; the scrim. |
| viewport | `data-part="dialog-viewport"` | Base UI's `<div>`, optional; centers the popup and scrolls a tall one. |
| popup | `data-part="dialog-popup"` | Base UI's `<div role="dialog">`; the surface. |
| title, description | `dialog-title`, `dialog-description` | Base UI's `<h2>` and `<p>`, wired to the popup. |
| close | `data-part="dialog-close"` | Base UI's `<button>`; ours holds a lucide `X`, top right. |
| actions | `data-part="dialog-actions"` | Ours: a `<div>` for the buttons at the end. |

## Variants

None.

## States and the token each reads

| State | Selected by | look |
|---|---|---|
| backdrop | | `--scrim`, black at 60%, fading with `--duration-200` |
| popup | | `--surface-high`, edge 1px `--neutral-chalk-11`, `--radius-12`, `--elevation-2`, padding `--space-150`, 28rem wide at most, centered |
| entering, leaving | `[data-starting-style]`, `[data-ending-style]` | `opacity: 0`, `scale(0.96)`, `--duration-200` |
| another dialog on top | `[data-nested-dialog-open]` | `scale(0.98)` |
| title, description, close | | as Popover's, with `--space-75` insets for the close |
| actions | | right-aligned, `--space-50` apart, `--space-150` above |

The popup is fixed and centered on its own; inside a Viewport it is static and the
Viewport centers and scrolls it.

## Hand-built beyond Base UI

The scrim, the surface, the title and description looks, the close button, the actions
row. Base UI supplied the dialog role and modal focus trap, `dismissible`, `initialFocus`
and `finalFocus`, nesting with `--nested-dialogs` and `data-nested-dialog-open`, the
Viewport for scrolling layouts, and the popup lifecycle.

## Learning log

Round 8 rows in `docs/learning-log.md`.
