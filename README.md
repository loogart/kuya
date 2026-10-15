# Kuya Café

The Kuya Café website: responsive layouts, bilingual English/French copy, paper textures, and scroll-triggered animations.

## Local preview

From this folder, run:

```sh
python3 -m http.server 4173 --directory dist
```

Open http://localhost:4173. Stop the server with Ctrl+C.

## Editing

- `dist/index.html` — page structure and illustrations
- `dist/style.css` — typography, responsive layout, and animations
- `dist/app.js` — language switcher, menu content, and viewport animation triggers
- `dist/assets/` — brand images, textures, and SVG artwork

This is a static website; no build step or dependency installation is required. Serve or deploy the `dist` directory. Google Fonts supplies the web fonts.

`.openai/hosting.json` retains the existing Sites hosting configuration.
