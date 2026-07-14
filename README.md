# Citadel App Shell

GitHub-ready source folder for the Citadel operations app.

## What to commit

Commit this folder as the app source of truth:

- `index.html`
- `styles.css`
- `app.js`
- `modules/registrations/`
- `apps-script/Code.gs`
- `docs/`

## How to preview

Open `index.html` locally, or publish this folder with GitHub Pages. The app reads live data from the Apps Script URL configured at the top of `app.js`.

## Team rule

Keep the app split into separate files. The single-file HTML export is only for quick preview/sharing, not long-term editing.

## Registrations module

The App Shell loads `modules/registrations/index.html` from the single **Registrations** navigation item. Its copied `app.js` and `styles.css` remain identical to the verified standalone app, while `embed.css` contains only shell-specific presentation adjustments.
