# SPEC: OpenTrace (Lieferketten-Scanner)

Stand: 18.11.2026. Grundlage: [MISSION.md](MISSION.md) und das SPEC-Interview. Dieses Dokument ist verbindlich für alle Agenten. Änderungen an Schnittstellen (Abschnitt 5) nur auf `main` und mit Commit.

## 1. Ziel und Zielgruppe

OpenTrace zeigt nach einem Barcode-Scan die Lieferkette eines Produkts auf einer Karte, schätzt das CO₂ des Transports und bewertet mit einem Transparenz-Score, was der Hersteller offenlegt. Ein Demo-Batteriepass zeigt im Vergleich, wie es mit digitalem Produktpass aussieht.

- **Zielgruppe:** Recruiter (SCM, Nachhaltigkeit, KI) und interessierte Verbraucher.
- **Sprache:** Oberfläche Deutsch. README und Code Englisch.
- **Name und URL:** OpenTrace, `https://opentrace-scan.vercel.app` (opentrace.vercel.app ist belegt).

## 2. Rahmen und Quellen

Recherchestand 18.11.2026. Vermerk "sekundär" heißt: vor Übernahme in die README gegen die Primärquelle prüfen.

| Thema | Stand | Quelle |
|---|---|---|
| Batteriepass | Pflicht ab 18.02.2027 nach Art. 77 VO (EU) 2023/1542 für Batterien von Elektrofahrzeugen, leichten Verkehrsmitteln (LMT) und Industriebatterien über 2 kWh. Sorgfaltspflichten in der Lieferkette per VO (EU) 2025/1561 auf 18.08.2027 verschoben. EU-Register für Produktpässe seit Juli 2026 im Testbetrieb. | sekundär, z. B. [Wikipedia Battery passport](https://en.wikipedia.org/wiki/Battery_passport), [carbmee](https://www.carbmee.com/knowledge-insights/blog-article/eu-digital-battery-passport); Primärquelle: EUR-Lex |
| ESPR und digitaler Produktpass | Arbeitsplan 2025 bis 2030 (COM(2025) 187, April 2025). Erster produktspezifischer delegierter Rechtsakt (Eisen und Stahl) indikativ Q4 2026, Textilien 2027. Pflicht jeweils frühestens 18 Monate nach Inkrafttreten. Stand Oktober 2026 noch kein Rechtsakt verabschiedet. | sekundär, z. B. [digital-link.com](https://digital-link.com/guides/espr-working-plan-2025-2030/), [renoon](https://www.renoon.com/blog/delegated-acts-for-digital-product-passport-explainer-and-current-status) |
| Battery-Pass-Datenmodell | Version 1.2.0, Lizenz CC-BY-4.0, sieben Aspekte: General Product Information, Carbon Footprint, Circularity, Material Composition, Performance and Durability, Labels and Certification, Supply Chain Due Diligence. Projekt im April 2025 beendet, Repository nur noch Referenz, Nachfolger BatteryPass-Ready. Inhaltlich abgestimmt mit DIN DKE SPEC 99100. | [github.com/batterypass/BatteryPassDataModel](https://github.com/batterypass/BatteryPassDataModel) |
| Open Food Facts API | Produktabfrage `GET /api/v2/product/{ean}.json?fields=...`. Eigener User-Agent Pflicht (`App/Version (Kontakt)`). Limit 15 Produktabfragen pro Minute und IP, Suche 10 pro Minute. | [OFF API-Doku](https://openfoodfacts.github.io/openfoodfacts-server/api/) |
| Lizenz Open Food Facts | Datenbank ODbL, Inhalte DbCL, Bilder CC BY-SA. Pflicht: Lizenz nennen, Open Food Facts als Quelle nennen, bei Einzelprodukten auf die Produktseite verlinken. Daten ohne Gewähr. | [OFF Terms of use](https://world.openfoodfacts.org/terms-of-use) |
| Nominatim (Geocoding) | Höchstens 1 Anfrage pro Sekunde, eigener User-Agent, Ergebnisse cachen, kein Autocomplete, OSM-Attribution sichtbar. | [Nominatim Usage Policy](https://operations.osmfoundation.org/policies/nominatim/) |
| GLEC Framework | Methode für Transportemissionen (Grundlage für ISO 14083). Faktoren well-to-wheel, sekundär: Lkw 40 t etwa 89 bis 101 g CO₂e/tkm, Containerschiff etwa 7 bis 8 g, Bahn elektrisch etwa 11 g, Luftfracht 600 bis 1500 g. | sekundär; Primärquelle: [GLEC Framework v3.1, Smart Freight Centre](https://smart-freight-centre-media.s3.amazonaws.com/documents/GLEC_FRAMEWORK_v3_UPDATED_04_12_24.pdf) |

Befund aus dem Test: Nutella (EAN 3017620422003) hat bei Open Food Facts leere Felder für Herkunft, Produktionsort und Betriebscode. Das Produkt eignet sich als Gegenbeispiel mit vielen Lücken.

## 3. Nutzerfluss

1. **Startseite `/`:** Kamera-Scan starten, EAN per Hand eingeben, vier Beispielprodukte als Kacheln, Button "Beispiel-Batteriepass ansehen", kurzer Satz zum Projekt.
2. **Scan:** Bei EAN-8 oder EAN-13 Weiterleitung auf `/p/[ean]`. Bei einem QR-Code mit GS1 Digital Link wird der Pfad ausgewertet: eigene Demo-GTIN führt auf `/01/[gtin]/21/[serial]`, andere GTINs werden als EAN behandelt.
3. **Ergebnisseite `/p/[ean]`:**
   - Produktkopf: Name, Marke, Menge, Link zur Produktseite bei Open Food Facts
   - Karte mit Stationen und Verbindungslinien
   - Liste der Abschnitte: von, nach, Distanz, Transportmittel (mit Hinweis "Annahme"), CO₂-Schätzung
   - Transparenz-Score mit erfüllten Feldern und einzeln aufgeführten Lücken
   - Quellen- und Lizenzblock
4. **Standort:** Beim ersten Ergebnis fragt die App nach dem Standort. Ohne Freigabe gilt der Standardort (Abschnitt 6) mit sichtbarem Hinweis.
5. **Methodenseite `/methode`:** Kettenbildung, CO₂-Methode mit Faktortabelle, Score-Berechnung, Grenzen, Quellen.

## 4. Architektur und Datenfluss

```
Handy-Browser
  │  Scan (barcode-detector) oder Eingabe
  ▼
/p/[ean]  (Client-Komponente)
  │ fetch
  ▼
/api/product/[ean]  (Route Handler, Server)
  │  setzt User-Agent, Cache 24 h (Next.js Data Cache)
  ▼
Open Food Facts API ──► normalisiertes Produkt (OffProduct)
  │
  ▼
lib/chain (reines TypeScript, läuft im Browser)
  ├─ lib/geo     Länder-Mittelpunkte (statisch) + /api/geocode für Orte
  ├─ lib/co2     Distanz × Umwegfaktor × GLEC-Faktor
  └─ lib/score   gewichtete Checkliste
  ▼
SupplyChain ──► Karte (MapLibre + OpenFreeMap), Abschnitte, Score
```

- **Warum der Proxy?** Der Server setzt den User-Agent, bündelt Anfragen im Cache und schützt so das Rate-Limit von Open Food Facts.
- **Warum läuft die Kette im Browser?** Der Nutzerstandort verlässt nie das Gerät. Die Logik ist rein funktional und dadurch leicht zu testen.
- **`/api/geocode?q=...`:** fragt Nominatim nur für Ortsnamen aus `manufacturing_places`, höchstens 1 Anfrage pro Sekunde, Ergebnis 30 Tage im Data Cache. Länder brauchen keinen API-Aufruf.
- **Kein Datenbank-Server, keine Nutzerdaten, keine API-Schlüssel.**

### Routen

| Route | Art | Zweck |
|---|---|---|
| `/` | Seite | Start, Scan, Beispiele |
| `/p/[ean]` | Seite | Ergebnis für ein Produkt |
| `/01/[gtin]/21/[serial]` | Seite | GS1-Digital-Link-Auflösung, Demo-Batteriepass |
| `/methode` | Seite | Methode und Quellen |
| `/api/product/[ean]` | Route Handler | Proxy zu Open Food Facts |
| `/api/geocode` | Route Handler | Proxy zu Nominatim |

### Technik

| Baustein | Wahl | Begründung |
|---|---|---|
| Framework | Next.js (App Router, TypeScript), Tailwind CSS | Seiten und API-Routen in einem Projekt, einfaches Hosting auf Vercel |
| PWA | `app/manifest.ts` mit Icons | installierbar; Offline-Modus im Backlog |
| Scanner | Paket `barcode-detector` (Polyfill auf ZXing-WASM) | iOS Safari hat die native BarcodeDetector-API nicht; gleiche API überall |
| Karte | MapLibre GL JS, Kacheln von OpenFreeMap | kein Schlüssel, kostenlos, offen |
| Geocoding | statische Ländertabelle + Nominatim mit Cache | Länder decken die meisten OFF-Angaben ab |
| Tests | Vitest für `lib/*` | reine Funktionen, schnell |
| Hosting | Vercel, Hobby-Plan | kostenlos, Vorschau pro Branch |

## 5. Datenmodell (Schnittstelle für alle Agenten)

Wird in M0 als `lib/types.ts` auf `main` angelegt. Alle Pakete bauen dagegen.

```ts
/** Where a value comes from. Shown as a badge in the UI. */
export type Provenance = "data" | "assumption" | "example" | "ai";

export type StationRole = "origin" | "processing" | "packing" | "sale";

export interface Station {
  id: string;
  role: StationRole;
  label: string;                 // e.g. "Spanien", "Werk Lüneburg"
  country?: string;              // ISO 3166-1 alpha-2
  coords?: [number, number];     // [lon, lat]; missing = cannot be placed
  precision: "country" | "city" | "user" | "default";
  source: Provenance;
  sourceField?: string;          // e.g. "origins_tags"
}

export type TransportMode = "truck" | "ship" | "rail" | "air";

export interface Leg {
  from: string;                  // Station.id
  to: string;                    // Station.id
  distanceKm: number;            // great circle × detour factor
  mode: TransportMode;
  modeSource: Provenance;        // "assumption" unless stated in data
  co2eGPerKg: number;            // g CO2e per kg of goods
  factorRef: string;             // e.g. "GLEC v3.1, road, articulated 34-40 t"
}

export interface Gap {
  field: string;                 // e.g. "manufacturing_places"
  label: string;                 // e.g. "Produktionsort"
  weight: number;                // points missing
}

export interface TransparencyScore {
  value: number;                 // 0..100
  fulfilled: string[];           // field keys
  gaps: Gap[];
}

export interface SupplyChain {
  product: {
    ean: string;
    name?: string;
    brand?: string;
    quantityG?: number;
    sourceUrl: string;           // product page at the data source
  };
  stations: Station[];
  legs: Leg[];
  co2eTotalG?: number;           // only if quantityG is known
  score: TransparencyScore;
  dataset: "openfoodfacts" | "batterypass-demo";
}

/** Prepared for phase 2 (AI classification). Not used in the MVP. */
export interface OriginClassification {
  input: string;
  countries: string[];           // ISO alpha-2
  confidence: "high" | "medium" | "low";
  source: "ai";
}
```

`lib/off` liefert zusätzlich `OffProduct` (normalisierte OFF-Felder). Den Typ legt Paket A fest; die Oberfläche nutzt nur `SupplyChain`.

## 6. Kettenbildung

| Station | Quelle | Regel |
|---|---|---|
| Herkunft (`origin`) | `origins_tags` | eine Station je Land; `en:unknown` und leere Werte ergeben eine Lücke |
| Verarbeitung (`processing`) | `manufacturing_places` | Ortsname über `/api/geocode`; bei Fehlschlag Land, sonst Lücke |
| Verpacker (`packing`) | `emb_codes` | Betriebscode (z. B. `DE BY 123 EG`) gibt das Land; nur wenn kein Produktionsort vorhanden ist |
| Verkauf (`sale`) | Browser-Standort | auf 0,1° gerundet, `precision: "user"`; ohne Freigabe Niederdorla (geografischer Mittelpunkt Deutschlands, 51,16° N, 10,45° O), `precision: "default"` |

- Verbindungen: jede Herkunft zur Verarbeitung (oder zum Verpacker), von dort zum Verkauf.
- Fehlt die Verarbeitung, wird keine Linie erfunden. Die Herkunft bleibt als Punkt ohne Linie stehen, und in der Liste erscheint "Weg unbekannt".
- Freitexte, die keine Regel versteht, werden roh angezeigt und als nicht ausgewertet markiert (Phase 2: KI-Einordnung).

## 7. CO₂-Methode (Transport)

```
Distanz       = Großkreisdistanz × Umwegfaktor(Mode)
CO₂e [g/kg]   = Distanz [km] × 0,001 [t/kg] × Faktor(Mode) [g CO₂e/tkm]
Gesamt [g]    = Summe der Abschnitte × Menge [kg]   (nur wenn product_quantity bekannt)
```

- **Transportmittel je Abschnitt (Annahme):** beide Punkte auf demselben Kontinent: Lkw. Verschiedene Kontinente: Containerschiff. Luftfracht nur bei ausdrücklicher Angabe in den Daten (bei Open Food Facts nie). Bahn ist im Modell vorgesehen, wird im MVP aber nicht angenommen.
- **Faktoren:** `lib/co2/factors.ts`, je Eintrag Wert, Einheit, Quelle, Version und Seitenzahl. Werte und Umwegfaktoren werden beim Bau aus dem GLEC-v3.1-PDF übernommen. Die Sekundärwerte aus Abschnitt 2 dienen nur zur Plausibilitätsprüfung.
- **Grenzen:** nur Transport, keine Herstellung, Kühlung, Lagerung oder Verpackung. Vor- und Nachlauf zum Hafen sind nicht modelliert. Länder werden auf ihren Mittelpunkt reduziert.
- **Darstellung:** Jeder Wert trägt das Label "Schätzung" und einen Link auf `/methode`. Gerundet auf zwei signifikante Stellen.

## 8. Transparenz-Score

Gewichtete Checkliste, Summe 100 Punkte. Ein Feld zählt als erfüllt, wenn es einen auswertbaren Wert hat.

| Feld (OFF) | Bezeichnung in der App | Punkte | Begründung |
|---|---|---|---|
| `origins_tags` (ohne `en:unknown`) | Herkunft der Zutaten | 25 | Kern der Lieferkette |
| `manufacturing_places` | Produktionsort | 20 | zweite Station der Kette |
| `emb_codes` | Betriebscode / Verpacker | 15 | amtlich prüfbarer Standort |
| `brands` | Hersteller / Marke | 10 | Verantwortlicher ist erkennbar |
| `packaging_tags` | Verpackung | 10 | Material und Entsorgung |
| `labels_tags` | Labels / Zertifikate | 10 | externe Prüfung (Bio, Fairtrade usw.) |
| `ingredients_text` | Zutatenliste | 5 | Grundangabe, meist Pflicht |
| `product_quantity` | Menge | 5 | nötig für die CO₂-Gesamtschätzung |

- `value = Summe der Punkte erfüllter Felder`.
- Jede Lücke erscheint einzeln mit Bezeichnung und fehlenden Punkten.
- Hinweis in der App: Der Score misst die Offenlegung in der Datenbank, nicht die Qualität der Lieferkette. Eine Lücke kann auch bedeuten, dass die Angabe bei Open Food Facts noch fehlt.
- Für den Demo-Batteriepass gilt eine eigene Checkliste mit Feldern aus dem Battery-Pass-Datenmodell (Paket C, gleiche Darstellung).

## 9. Demo-Batteriepass

- **Daten:** `data/batterypass-demo.json`, eine Teilmenge des Battery-Pass-Datenmodells v1.2.0: General Product Information (Hersteller, Produktionsort, Datum, Kategorie, Gewicht), Carbon Footprint, Material Composition (Rohstoffherkunft für Lithium, Kobalt, Nickel, Graphit), Circularity (Recyclinganteil), Supply Chain Due Diligence. Feldnamen wie im Datenmodell, mit Verweis auf Aspekt und Version.
- **Kennzeichnung:** alle Werte `source: "example"`, Banner "Beispieldaten" auf der ganzen Seite. Werte plausibel, aber erkennbar fiktiv (fiktiver Hersteller). Kein echtes Unternehmen.
- **GTIN und Seriennummer:** GTIN `09506000134352` (GS1-Beispiel-GTIN aus der Digital-Link-Dokumentation), Seriennummer `DEMO0001`. URL: `/01/09506000134352/21/DEMO0001`.
- **QR-Code:** `public/batterypass-demo-qr.png`, erzeugt beim Bau, auch auf der Methodenseite zum Abscannen von einem zweiten Gerät.
- **Ansicht:** gleiche Karte, gleiche Abschnitte, gleicher Score-Baustein. Dazu ein Vergleichssatz: was der Pass offenlegt, was ein Lebensmittel bei Open Food Facts typischerweise offenlegt.
- **Rechtlicher Kontext auf der Seite:** Pflicht ab 18.02.2027 für EV-, LMT- und Industriebatterien über 2 kWh (nach Prüfung gegen EUR-Lex).

## 10. Datenregel in der Oberfläche

| Badge | Bedeutung |
|---|---|
| Daten | Wert stammt aus der Datenquelle |
| Annahme | von OpenTrace angenommen (z. B. Transportmittel, Standardort) |
| Schätzung | berechnet nach `/methode` (CO₂) |
| Beispieldaten | fiktive Demo-Daten (Batteriepass) |
| KI-Einordnung | von einem KI-Modell eingeordnet (erst Phase 2) |

Quellen- und Lizenzblock auf jeder Ergebnisseite: Open Food Facts (ODbL, Link zum Produkt), Kartendaten OpenStreetMap-Mitwirkende, Kacheln OpenFreeMap, Geocoding Nominatim, Faktoren GLEC Framework v3.1, Battery Pass Consortium (CC-BY-4.0).

Texte: sachlich, keine Gedankenstriche, keine Werbefloskeln.

## 11. Sicherheit, Datenschutz und Kosten

- Keine API-Schlüssel im MVP. Alle genutzten Dienste sind ohne Schlüssel und kostenlos.
- Der Standort wird nur im Browser verwendet, gerundet und nicht gespeichert oder gesendet.
- Keine Cookies, keine Analyse-Tools, keine Nutzerkonten.
- Schutz der fremden Dienste: Cache in beiden Proxy-Routen, Eingaben validieren (EAN nur Ziffern, 8 bis 14 Stellen; Geocode-Text höchstens 100 Zeichen).
- Sicherheits-Header über `next.config` (Content-Security-Policy auf eigene Domain, OpenFreeMap und Open Food Facts beschränkt).

## 12. Arbeitspakete für Herdr

Vorher auf `main`: M0 (Projektgerüst, `lib/types.ts`, leere Seite auf Vercel). Danach arbeitet jeder Agent in einem eigenen Worktree und Branch.

| Paket | Branch | Umfang | Liefert |
|---|---|---|---|
| A Datenschicht | `feat/data` | `lib/off`, `lib/geo` (Ländertabelle), `lib/chain`, `lib/co2`, `lib/score`, `/api/product`, `/api/geocode`, Vitest-Tests | `buildSupplyChain(product, saleLocation): SupplyChain` |
| B Oberfläche | `feat/ui` | Startseite, Scanner, `/p/[ean]`, Karte, Abschnittsliste, Score-Baustein, Badges, `/methode`, Manifest | Seiten, die eine `SupplyChain` darstellen; bis A fertig ist mit Fixture-Daten aus `fixtures/*.json` (markiert als Testdaten) |
| C Demo-Pass | `feat/batterypass` | `data/batterypass-demo.json`, Mapping auf `SupplyChain`, Route `/01/[gtin]/21/[serial]`, Parser für Digital Link, QR-Code | `parseDigitalLink(url)`, `batteryPassToSupplyChain()` |

Regel: Kein Paket ändert `lib/types.ts` im eigenen Branch. Änderungswünsche gehen über `main`.

## 13. Meilensteine

| | Inhalt | Prüfung |
|---|---|---|
| M0 | Gerüst, Typen, Deploy auf Vercel | URL lädt auf dem Handy |
| M1 | EAN-Lookup über Proxy, Rohdaten anzeigen | 4 Beispiel-EANs liefern Daten |
| M2 | Kette und Karte | Stationen und Linien stimmen mit OFF-Feldern überein |
| M3 | CO₂ und Score | Tests grün, Werte von Hand nachgerechnet für ein Produkt |
| M4 | Demo-Batteriepass | QR-Scan vom zweiten Gerät öffnet den Pass |
| M5 | Beispielprodukte, README (EN), Handytest | Definition of Done erfüllt |

## 14. Definition of Done (MVP)

- Öffentliche URL `opentrace-scan.vercel.app`, auf iOS Safari und Android Chrome nutzbar (Scan und Eingabe)
- Drei echte Beispielprodukte mit gut gepflegter Herkunft und ein Gegenbeispiel (Nutella, 3017620422003). EANs der drei Produkte werden in M1 ausgewählt und hier eingetragen.
- Jeder angezeigte Wert trägt die richtige Kennzeichnung (Abschnitt 10)
- Vitest-Tests für `lib/*` grün
- Quellen aus Abschnitt 2 gegen Primärquellen geprüft
- README (Englisch) mit Architektur, Datenquellen, CO₂-Methode, Score und Grenzen
- Adrian kann Datenfluss und Architektur anhand von Abschnitt 4 in zwei Minuten erklären

## 15. Backlog (nach dem MVP)

1. **KI-Einordnung unstrukturierter Herkunftstexte.** Bedingung: keine laufenden Kosten, kein Missbrauchsrisiko. Bevorzugt als Offline-Skript: lokal mit Schlüssel aus `.env.local`, Modell Claude Haiku 5.5 (`claude-haiku-5-5`), strukturierte JSON-Ausgabe nach `OriginClassification`, Ergebnis als JSON im Repo, in der App mit Badge "KI-Einordnung". Eine Live-Variante nur mit Cache pro EAN, Limit pro IP und Ausgabenlimit in der Anthropic Console.
2. Englische Oberfläche
3. Offline-Modus (Service Worker)
4. Open Supply Hub für Fabrikstandorte
5. Bahn als angenommenes Transportmittel innerhalb Europas
6. Eigene Domain

## 16. Offene Punkte

- Kontaktangabe für den Open-Food-Facts-User-Agent: Adrian legt eine Projektadresse oder die Repo-URL fest. Keine private Adresse im Repo.
- GLEC-Faktoren und Umwegfaktoren aus dem Original-PDF übernehmen (M3).
- Termine Batteriepass und ESPR gegen EUR-Lex prüfen (vor M5).
- Drei Beispielprodukte auswählen (M1).
