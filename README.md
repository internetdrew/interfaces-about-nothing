# Interfaces About Nothing

A collection of interactive interfaces and artifacts inspired by Seinfeld episodes, characters, and their everyday absurdities.

## Open Graph image

`src/pages/og/site.png.ts` uses `@vercel/og` to render a 1200 × 630 card at `/og/site.png`, the URL already used by the Open Graph and Twitter metadata.

The image is generated automatically by `npm run build` and written to `dist/og/site.png`. In development, visit `/og/site.png` to preview it. No browser installation or Vercel hosting is required.

Edit the endpoint to adjust the layout. It imports the title and description from `src/constants.ts` and loads Host Grotesk 600 and Inter 500 from `src/assets/fonts/`. Its background and description colors match Tailwind's stone-300 and stone-600.
