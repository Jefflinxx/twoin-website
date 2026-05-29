# TWOIN

TWOIN official website draft.

## Website

The deployable static website is in `docs/`.

- Chinese page: `docs/zh/index.html`
- English page: `docs/en/index.html`
- Shared styles: `docs/assets/styles.css`

## GitHub Pages Setup

Use GitHub Pages with:

- Source: `Deploy from a branch`
- Branch: `main`
- Folder: `/docs`

The intended public routes are:

- `/zh`
- `/en`

## Local Preview

Run a local static server from the project root:

```bash
python3 -m http.server 8080 --directory docs
```

Then open:

- `http://localhost:8080/zh/`
- `http://localhost:8080/en/`
