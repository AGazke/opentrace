/**
 * Shared data model for all OpenTrace packages (SPEC.md section 5).
 * Change only on `main`, never in a feature branch.
 */

/** Where a value comes from. Shown as a badge in the UI. */
export type Provenance = "data" | "assumption" | "example" | "ai";

export type StationRole = "origin" | "processing" | "packing" | "sale";

export interface Station {
  id: string;
  role: StationRole;
  label: string; // e.g. "Spanien", "Werk Lüneburg"
  country?: string; // ISO 3166-1 alpha-2
  coords?: [number, number]; // [lon, lat]; missing = cannot be placed
  precision: "country" | "city" | "user" | "default";
  source: Provenance;
  sourceField?: string; // e.g. "origins_tags"
}

export type TransportMode = "truck" | "ship" | "rail" | "air";

export interface Leg {
  from: string; // Station.id
  to: string; // Station.id
  distanceKm: number; // great circle × detour factor
  mode: TransportMode;
  modeSource: Provenance; // "assumption" unless stated in data
  co2eGPerKg: number; // g CO2e per kg of goods
  factorRef: string; // e.g. "GLEC v3.1, road, articulated 34-40 t"
}

export interface Gap {
  field: string; // e.g. "manufacturing_places"
  label: string; // e.g. "Produktionsort"
  weight: number; // points missing
}

export interface TransparencyScore {
  value: number; // 0..100
  fulfilled: string[]; // field keys
  gaps: Gap[];
}

export interface SupplyChain {
  product: {
    ean: string;
    name?: string;
    brand?: string;
    quantityG?: number;
    sourceUrl: string; // product page at the data source
  };
  stations: Station[];
  legs: Leg[];
  co2eTotalG?: number; // only if quantityG is known
  score: TransparencyScore;
  dataset: "openfoodfacts" | "batterypass-demo";
}

/** Prepared for phase 2 (AI classification). Not used in the MVP. */
export interface OriginClassification {
  input: string;
  countries: string[]; // ISO alpha-2
  confidence: "high" | "medium" | "low";
  source: "ai";
}
