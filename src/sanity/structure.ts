import type { StructureResolver } from "sanity/structure";

const singletons = new Set([
  "siteSettings",
  "builderSettings",
  "roastersPageSettings",
]);

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      // Singletons
      S.listItem()
        .title("Builder Settings")
        .id("builderSettings")
        .child(
          S.document()
            .schemaType("builderSettings")
            .documentId("builderSettings")
        ),
      S.listItem()
        .title("Site Settings")
        .id("siteSettings")
        .child(
          S.document()
            .schemaType("siteSettings")
            .documentId("siteSettings")
        ),
      S.divider(),
      // Roasters Site group
      S.listItem()
        .title("Roasters Site")
        .child(
          S.list()
            .title("Roasters Site")
            .items([
              S.listItem()
                .title("Page Settings")
                .id("roastersPageSettings")
                .child(
                  S.document()
                    .schemaType("roastersPageSettings")
                    .documentId("roastersPageSettings")
                ),
              S.documentTypeListItem("roasterFeature").title(
                "Features"
              ),
            ])
        ),
      S.divider(),
      // Everything else, excluding singletons and roaster-specific types
      ...S.documentTypeListItems().filter(
        (item) =>
          !singletons.has(item.getId() ?? "") &&
          item.getId() !== "roasterFeature"
      ),
    ]);
