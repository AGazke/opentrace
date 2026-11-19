# Paket C: Demo-Batteriepass (`feat/batterypass`)

## Ziel

Ein Beispiel-Batteriepass nach dem Battery-Pass-Datenmodell v1.2.0, erreichbar über GS1 Digital Link und QR-Code. Er zeigt, wie viel ein Produktpass offenlegt, im Vergleich zu einem Lebensmittel bei Open Food Facts.

## Liefert

- `data/batterypass-demo.json` nach SPEC Abschnitt 9.
- `parseDigitalLink(url: string): { gtin: string; serial?: string } | null` in `lib/gs1/digitalLink.ts`. Erkennt Pfade mit `/01/{gtin}` und optional `/21/{serial}`, auch mit fremder Domain. GTIN mit Prüfziffer validieren.
- `batteryPassToSupplyChain(pass): SupplyChain` in `lib/batterypass/`. Alle Stationen und Werte mit `source: "example"`, `dataset: "batterypass-demo"`. Eigene Score-Checkliste mit Feldern aus dem Datenmodell, gleiche Struktur wie `TransparencyScore`.
- Route `/01/[gtin]/21/[serial]`: lädt den Pass für GTIN `09506000134352` und Seriennummer `DEMO0001`, sonst 404. Vorerst einfache Darstellung (Banner "Beispieldaten", Kopf, Rohstoffherkunft, CO₂-Fußabdruck, Recyclinganteil, Score). Nach dem Merge von B werden die Bausteine aus `components/` eingesetzt, Stelle mit `// TODO(merge B)` markieren.
- `public/batterypass-demo-qr.png` mit der URL `https://opentrace-scan.vercel.app/01/09506000134352/21/DEMO0001`, erzeugt durch ein Skript in `scripts/`.
- Vitest-Tests für Parser und Mapping.

## Dateien

`data/batterypass-demo.json`, `lib/gs1/*`, `lib/batterypass/*`, `app/01/**`, `scripts/*`, `public/batterypass-demo-qr.png`, Testdateien `lib/**/*.test.ts`.

## Vorgaben

- **Datenmodell:** Feldnamen wie im Repository [batterypass/BatteryPassDataModel](https://github.com/batterypass/BatteryPassDataModel) v1.2.0 (CC-BY-4.0). Vor dem Schreiben die Schemas der Aspekte General Product Information, Carbon Footprint, Material Composition, Circularity und Supply Chain Due Diligence lesen. Je Feld den Aspekt und die Version im JSON vermerken.
- **Beispieldaten:** plausibel, aber erkennbar fiktiv. Fiktiver Hersteller, kein echtes Unternehmen, keine echte Fabrikadresse. Rohstoffherkunft als Länder. Ganze Seite trägt sichtbar "Beispieldaten".
- **Rechtlicher Kontext:** Satz zur Pflicht ab 18.02.2027 für EV-, LMT- und Industriebatterien über 2 kWh, mit Vermerk, dass die Prüfung gegen EUR-Lex vor M5 aussteht (`// TODO(M5): verify against EUR-Lex`).
- **Abhängigkeiten:** `qrcode` als devDependency für das Skript. Nichts weiter ohne Rückfrage.
- **Lizenz:** Battery Pass Consortium, CC-BY-4.0, auf der Seite nennen.

## Fertig, wenn

- `/01/09506000134352/21/DEMO0001` zeigt den Pass mit Banner "Beispieldaten" in der Vorschau.
- QR-Code mit dem Handy gescannt (Kamera-App) öffnet diese Seite.
- Alle Checks grün, Branch gepusht.
