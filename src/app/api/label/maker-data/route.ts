import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";
import {
  labelTemplatesQuery,
  svgElementsQuery,
} from "@/sanity/lib/queries";

export async function GET() {
  try {
    const [templates, svgElements] = await Promise.all([
      client.fetch(labelTemplatesQuery),
      client.fetch(svgElementsQuery),
    ]);

    return NextResponse.json({
      templates: templates ?? [],
      svgElements: svgElements ?? [],
    });
  } catch (error) {
    console.error("Failed to fetch label maker data:", error);
    return NextResponse.json(
      { error: "Failed to fetch label maker data" },
      { status: 500 }
    );
  }
}
