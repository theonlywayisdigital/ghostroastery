# Adding a New Bag Colour

## Steps

### 1. Upload bag photo to Sanity

Go to the Sanity Studio at `/studio`, open **Bag Colours**, and create a new document:

- Set the **Name** (e.g. "Rose Gold Matt")
- Set the **Hex Code** for the swatch display
- Upload the **Bag Photo** (359×514px, same angle/position as other bags)
- Set **Sort Order** and **Active** status

### 2. Displacement map auto-generates

When you save the document with a bag photo, the Sanity webhook automatically triggers displacement map generation at `POST /api/webhooks/sanity/bag-photo-updated`.

- Wait a few seconds, then refresh the document
- The **Displacement Map** field should now show a greyscale image
- This map captures the bag's surface curvature for realistic label warping

### 3. Verify the displacement map

The displacement map should show:

- **Lighter centre** (~255 grey) where the bag faces the camera
- **Darker edges** (~180 grey) where the bag curves away
- **Subtle surface detail** from creases and contours

If it looks wrong, click the **"Regenerate displacement map"** button in the document actions menu (three-dot menu at the top of the document). This manually re-runs the generation pipeline.

### 4. Calibrate corner points

Go to `/studio-tools/map-label-zone` and select the new bag colour:

1. Drag the four corner handles to define where the label sits on the bag
2. Use arrow keys for fine adjustments (hold Shift for larger steps)
3. Use the numeric inputs for precise values
4. Click **Save** to write the config to `bagMockupConfig.ts`

Corner points and displacement maps are **independent** — updating corners does not regenerate the displacement map and vice versa.

### 5. Test in the builder

Go to the builder and:

1. Select the new bag colour in Step 2
2. Upload or design a label in Step 3
3. Verify the label preview shows:
   - Correct placement (controlled by corner points)
   - Surface curvature (controlled by displacement map — lighter centre, curved edges)
   - Edge shadow effect
   - Specular highlight (if `isShiny: true` in bagMockupConfig)

### 6. Test in the label maker preview

Open the label maker, design a label, and click **Preview on bag**:

1. Select the new bag colour in the footer
2. Verify the label warps correctly onto the bag

## Batch regeneration

To regenerate displacement maps for all bags at once:

```bash
npx tsx src/scripts/generate-displacement-maps.ts
```

To regenerate for a single bag:

```bash
npx tsx src/scripts/generate-displacement-maps.ts --bag "Rose Gold Matt"
```

This saves PNGs to `/public/displacement-maps/` and uploads them to Sanity.

## File reference

| File | Purpose |
|------|---------|
| `src/components/builder/bagMockupConfig.ts` | Corner points and compositing settings per bag |
| `src/lib/generateDisplacementMap.ts` | Shared displacement map generation pipeline |
| `src/scripts/generate-displacement-maps.ts` | Batch generation script |
| `src/app/api/studio-tools/generate-displacement-map/route.ts` | API route for on-demand generation |
| `src/app/api/webhooks/sanity/bag-photo-updated/route.ts` | Webhook handler for auto-generation |
| `src/sanity/actions/regenerateDisplacementMap.ts` | Sanity document action button |
| `src/components/builder/BagVisualisation.tsx` | Client-side label compositing with displacement |
| `src/lib/generateMockup.ts` | Server-side mockup generation with displacement |
