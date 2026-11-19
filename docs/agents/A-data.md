# Paket A: Datenschicht (`feat/data`)

## Ziel

Aus einer EAN eine `SupplyChain` (siehe `lib/types.ts`) bauen: Produktdaten von Open Food Facts holen, Stationen bilden, Abschnitte mit CO₂-Schätzung berechnen, Transparenz-Score bestimmen. Reine Logik, keine Oberfläche.

## Liefert

- `GET /api/product/[ean]`: Proxy zu Open Food Facts, gibt `OffProduct` zurück (SPEC Abschnitt 4 und 11).
- `GET /api/geocode?q=...`: Proxy zu Nominatim (SPEC Abschnitt 4 und 11).
- `buildSupplyChain(product: OffProduct, sale: SaleLocation): Promise<SupplyChain>` in `lib/chain`. `SaleLocation` legt Paket A fest (Koordinaten plus `precision: "user" | "default"`). Für den Standardort `DEFAULT_SALE_LOCATION` aus `lib/config.ts` verwenden. Geocoding für Ortsnamen läuft über einen übergebenen oder standardmäßigen Fetcher auf `/api/geocode`, damit Tests ohne Netz laufen.
- Vitest-Tests für alle Module.

## Dateien

`lib/off/*`, `lib/geo/*`, `lib/chain/*`, `lib/co2/*`, `lib/score/*`, `app/api/product/[ean]/route.ts`, `app/api/geocode/route.ts`, Testdateien `lib/**/*.test.ts`, Test-Fixtures unter `lib/**/__fixtures__/`.

## Vorgaben

- **OFF-Abfrage:** `https://world.openfoodfacts.org/api/v2/product/{ean}.json?fields=...` nur mit den Feldern, die Kette und Score brauchen (SPEC Abschnitt 6 und 8, dazu `product_name`, `brands`, `quantity`, `product_quantity`). User-Agent `USER_AGENT` aus `lib/config.ts`. Cache 24 h. Nicht gefunden ergibt 404 mit klarer Fehlermeldung.
- **Eingaben prüfen:** EAN nur Ziffern, 8 bis 14 Stellen. Geocode-Text höchstens 100 Zeichen. Sonst 400.
- **Nominatim:** höchstens 1 Anfrage pro Sekunde, User-Agent `USER_AGENT`, Cache 30 Tage.
- **Ländertabelle:** `lib/geo/countries.ts`, ISO alpha-2, Name auf Deutsch, Mittelpunkt `[lon, lat]`, Kontinent. Mapping der OFF-Tags (`en:spain`) auf ISO. Quelle der Mittelpunkte im Dateikopf nennen. Mindestens alle EU-Länder und die häufigen Herkunftsländer für Lebensmittel.
- **Kettenbildung:** genau nach SPEC Abschnitt 6. Keine Linie erfinden, wenn die Verarbeitung fehlt. Unverstandene Freitexte roh behalten und als nicht ausgewertet markieren.
- **CO₂:** genau nach SPEC Abschnitt 7. Faktoren und Umwegfaktoren in `lib/co2/factors.ts` mit Wert, Einheit, Quelle, Version und Seite. Die Werte aus dem GLEC-v3.1-PDF übernimmt Adrian in M3. Bis dahin Platzhalter aus SPEC Abschnitt 2 eintragen und jeden mit `// TODO(M3): verify against GLEC v3.1 PDF, page ?` markieren. Keine Zahl als geprüft ausgeben, die nicht geprüft ist.
- **Score:** genau nach SPEC Abschnitt 8, Gewichte in einer Tabelle, nicht im Code verstreut.
- **Tests:** mindestens Nutella (3017620422003, viele Lücken) als gespeicherte OFF-Antwort, dazu ein Produkt mit Herkunft und Produktionsort. Fixtures echt von OFF holen und mit Abrufdatum speichern, nichts erfinden. Handrechnung für einen CO₂-Abschnitt als Test.

## Fertig, wenn

- `curl localhost:3000/api/product/3017620422003` liefert normalisierte Daten.
- `buildSupplyChain` für die Fixtures liefert Stationen, Abschnitte und Score passend zu SPEC.
- Alle Checks grün, Branch gepusht.
