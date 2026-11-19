# Paket B: Oberfläche (`feat/ui`)

## Ziel

Alle Seiten und Bausteine, die eine `SupplyChain` (siehe `lib/types.ts`) darstellen, dazu Scanner, Startseite, Methodenseite und PWA-Manifest. Bis Paket A fertig ist, arbeitet B mit Fixture-Daten.

## Liefert

- Startseite `/` nach SPEC Abschnitt 3: Kamera-Scan, EAN-Eingabe, vier Beispielkacheln (Nutella 3017620422003 fest, die anderen drei als Platzhalter "folgt in M1"), Button "Beispiel-Batteriepass ansehen" auf `/01/09506000134352/21/DEMO0001`.
- Scanner mit `barcode-detector`: EAN-8 und EAN-13 leiten auf `/p/[ean]`. QR-Codes: URL an `parseDigitalLink` übergeben, sobald Paket C gemergt ist. Bis dahin QR-Inhalt nur anzeigen und mit `// TODO(merge C)` markieren.
- Ergebnisseite `/p/[ean]`: Produktkopf, Karte, Abschnittsliste, Score-Baustein, Quellen- und Lizenzblock (SPEC Abschnitt 3 und 10). Standortabfrage nach SPEC Abschnitt 3.4, Standort auf 0,1° runden, nie senden oder speichern.
- Wiederverwendbare Bausteine in `components/`: `SupplyChainMap`, `LegList`, `ScoreCard`, `ProvenanceBadge`, `SourcesBlock`. Sie bekommen nur eine `SupplyChain` als Eingabe, damit Paket C sie ebenfalls nutzen kann.
- Methodenseite `/methode` nach SPEC Abschnitt 3.5. Faktortabelle als Platzhalter, bis A die Faktoren liefert.
- `app/manifest.ts` mit Icons, Sicherheits-Header in `next.config.ts` (SPEC Abschnitt 11). CSP so, dass OpenFreeMap, die eigenen API-Routen und die OFF-Produktbilder funktionieren.

## Dateien

`app/page.tsx`, `app/layout.tsx`, `app/globals.css`, `app/p/**`, `app/methode/**`, `app/manifest.ts`, `app/icon*`, `components/**`, `fixtures/*.json`, `public/icons/**`, `next.config.ts`.

## Vorgaben

- **Abhängigkeiten:** `maplibre-gl`, `barcode-detector`. Nichts weiter ohne Rückfrage.
- **Karte:** MapLibre mit OpenFreeMap-Style (`https://tiles.openfreemap.org/styles/liberty`), OSM-Attribution sichtbar. Stationen ohne `coords` erscheinen nur in der Liste, mit Hinweis "Ort unbekannt".
- **Fixtures:** `fixtures/*.json` als `SupplyChain`, im Dateinamen und in einem Feld `_note` als Testdaten markiert. Nur Werte, die zu echten OFF-Daten passen (Nutella als Lückenbeispiel), oder klar fiktive Testwerte. In der Oberfläche nie als echt zeigen: solange Fixtures genutzt werden, Banner "Testdaten".
- **Badges:** genau die fünf aus SPEC Abschnitt 10. Jede CO₂-Zahl mit "Schätzung" und Link auf `/methode`, auf zwei signifikante Stellen gerundet.
- **Lücken:** jede `Gap` einzeln mit Bezeichnung und fehlenden Punkten. Hinweis zum Score aus SPEC Abschnitt 8 wörtlich sinngemäß übernehmen.
- **Mobil zuerst:** iOS Safari und Android Chrome, Kamera nur nach Klick starten, Fallback auf Eingabe, wenn keine Kamera erlaubt ist.
- **Anbindung an A:** Die Seite ruft `/api/product/[ean]` und `buildSupplyChain` auf. Bis A gemergt ist, liegt dahinter ein Fixture-Loader in `app/p/[ean]/`, der klar als Übergang markiert ist (`// TODO(merge A)`).

## Fertig, wenn

- Vorschau-URL zeigt Startseite, Fixture-Ergebnis mit Karte, Score und Lücken, Methodenseite.
- Scan einer EAN mit dem Handy führt auf `/p/[ean]`.
- Alle Checks grün, Branch gepusht.
