# Mission

## Warum

Die EU führt mit der Ökodesign-Verordnung (ESPR) schrittweise den digitalen Produktpass ein, Batterien zuerst (Batteriepass). Heute legen die meisten Produkte ihre Lieferkette kaum offen. Das Projekt macht sichtbar, was ein Produkt über seine Herkunft verrät und was nicht, und zeigt am Beispiel des Batteriepasses, wie es mit Produktpass aussieht.

Nebenziel: ein vorzeigbares, öffentlich gehostetes Projekt für Adrians Bewerbungen (SCM, Nachhaltigkeit, KI).

## MVP-Umfang

1. **Scannen:** Barcode (EAN) per Handykamera im Browser, alternativ Eingabe per Hand. QR-Codes mit GS1 Digital Link werden erkannt und für Produktpässe vorbereitet.
2. **Echte Produktdaten:** Lookup über Open Food Facts (Herkunft der Zutaten, Produktionsort, Hersteller, Verpackung).
3. **Lieferkette als Karte:** Stationen (Herkunft, Verarbeitung, Verkauf am Standort des Nutzers) mit Verbindungslinien.
4. **CO₂-Schätzung des Transports:** aus Distanz und angenommenem Transportmittel, Faktoren nach GLEC-Framework, klar als Schätzung markiert.
5. **Transparenz-Score:** Wie viele der relevanten Angaben sind vorhanden? Fehlende Felder werden einzeln als Lücke gezeigt.
6. **Demo-Batteriepass:** ein Beispielpass nach dem Battery-Pass-Datenmodell (Rohstoffherkunft, CO₂-Fußabdruck, Recyclinganteil), sichtbar als Beispieldaten markiert, um den Unterschied zu zeigen.

## Nicht im MVP

- Nutzerkonten, Datenbank für Nutzerdaten
- Eigene Erfassung von Produktdaten durch Nutzer
- Native App im App Store
- Vollständige Lebenszyklusanalyse (nur Transport, nicht Herstellung)

## Offene Fragen für das SPEC-Interview

- Zielgruppe der Seite: Recruiter, Interessierte, beides? Sprache DE, EN oder beides?
- Welche Annahmen zum Transportmittel, wenn die Daten keine nennen?
- Wie genau wird der Transparenz-Score berechnet (Felder, Gewichtung)?
- Zuerst prüfen: aktueller Stand der ESPR- und Batteriepass-Termine, Lizenz und Nutzungsbedingungen der Open-Food-Facts-API (User-Agent, Rate Limits), aktueller Stand des Battery-Pass-Datenmodells.
- Name und Domain des Projekts.

## Definition of Done (MVP)

- Öffentliche URL auf Vercel, auf dem Handy nutzbar
- Drei echte Beispielprodukte, die gut funktionieren, und ein Produkt mit vielen Lücken als Gegenbeispiel
- README mit Architektur, Datenquellen, Methode der CO₂-Schätzung und Grenzen
- Adrian kann Datenfluss und Architektur in zwei Minuten erklären
