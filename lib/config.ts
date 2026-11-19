/** Shared constants. Change only on `main`. */

/** User-Agent for Open Food Facts and Nominatim (SPEC.md section 4). */
export const USER_AGENT = "OpenTrace/0.1 (https://github.com/AGazke/opentrace)";

/** Default sale location if the user does not share their position (SPEC.md section 6). */
export const DEFAULT_SALE_LOCATION = {
  label: "Niederdorla (Mittelpunkt Deutschlands)",
  coords: [10.45, 51.16] as [number, number], // [lon, lat]
};
