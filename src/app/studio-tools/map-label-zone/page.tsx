import { MapLabelZoneClient } from "./MapLabelZoneClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Map Label Zone — Studio Tools",
  description: "Calibrate label zone corner points for each bag colour.",
};

export default function MapLabelZonePage() {
  return <MapLabelZoneClient />;
}
