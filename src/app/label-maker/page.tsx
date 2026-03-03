import { Suspense } from "react";
import { LabelMakerClient } from "@/components/label-maker/LabelMakerClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Label Maker",
  description:
    "Design your coffee bag label with our free label maker tool. Create print-ready artwork for your custom branded coffee bags.",
};

export default function LabelMakerPage() {
  return (
    <Suspense fallback={null}>
      <LabelMakerClient />
    </Suspense>
  );
}
