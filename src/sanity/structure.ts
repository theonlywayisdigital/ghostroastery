import type { StructureResolver } from "sanity/structure";

const singletons = new Set(["siteSettings", "builderSettings"]);

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
      // Everything else, grouped by existing comments in schema index
      ...S.documentTypeListItems().filter(
        (item) => !singletons.has(item.getId() ?? "")
      ),
    ]);
