# 香港馬名記憶賽

A responsive four-choice recognition game for learning active Hong Kong racehorses. Study one horse portrait, then select its correct Traditional Chinese name from four options across two-, three-, and four-character horse-name stables.

The bundled roster contains every named horse from the supplied HKJC two-, three-, and four-character listings. Horses whose official portrait is not yet published remain available as answer choices but are excluded from photo prompts. A persistent shuffled deck cycles through the full portrait bank before repeating questions.

## Run locally

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

## Refresh the HKJC roster

```bash
npm run update:horses
```

This fetches all three official name lists, validates their structure and uniqueness, checks official portrait availability, and regenerates `src/horses.generated.ts`.

Horse names, ratings, portraits, and racing-silk images are sourced from the public Hong Kong Jockey Club horse-information pages supplied for this project and were captured on 15 July 2026. This is an unofficial learning game and does not include betting features.
