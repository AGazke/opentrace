# Lieferketten-Scanner (CLAUDE.md)

Ein Produkt mit dem Handy scannen und seine Lieferkette sehen: Stationen von der Herkunft bis ins Regal auf einer Karte, Transportwege mit geschätztem CO₂ und ein Transparenz-Score, der zeigt, was der Hersteller offenlegt und was fehlt. Gebaut von Adrian Gazke (M.Sc. Technisch orientierte BWL, Schwerpunkt SCM und KI-Agenten) als öffentliches Portfolio-Projekt.

@docs/MISSION.md

## Rolle von Claude

- Du sprichst Deutsch mit Adrian. Code, Commits und Code-Kommentare auf Englisch.
- Adrian muss jede Architekturentscheidung im Interview erklären können. Erkläre Entscheidungen kurz, wähle die einfachere Lösung, wenn zwei gleich gut sind.
- Arbeite in kleinen Schritten: bauen, laufen lassen, prüfen, committen. Keine großen Sprünge ohne laufenden Zwischenstand.

## Datenregel (wichtigste Regel)

- **Nur echte Daten oder klar markierte Beispieldaten.** Nie Herkunft, Fabriken, Zertifikate oder CO₂-Werte erfinden und als echt darstellen.
- Schätzungen (zum Beispiel CO₂ aus Distanz und Transportmittel) sind in der Oberfläche als Schätzung gekennzeichnet, mit Methode und Quelle der Faktoren.
- Fehlende Angaben werden als Lücke gezeigt, nicht aufgefüllt. Die Lücken sind Teil der Aussage.
- Demo-Produktpässe (etwa nach dem Battery-Pass-Datenmodell) tragen sichtbar das Label "Beispieldaten".

## Technik

Verbindlich festgelegt in [docs/SPEC.md](docs/SPEC.md) (Projektname OpenTrace, URL opentrace-scan.vercel.app). Kurzfassung:

- Next.js (App Router, TypeScript) + Tailwind als installierbare Web-App (PWA), Hosting auf Vercel
- Scannen im Browser mit `barcode-detector` (EAN und QR mit GS1 Digital Link)
- Karte: MapLibre GL mit OpenFreeMap, Geocoding über Ländertabelle und Nominatim mit Cache
- Datenquellen: Open Food Facts API, GS1 Digital Link, Battery-Pass-Datenmodell v1.2.0
- Schnittstelle für alle Agenten: `lib/types.ts` nach SPEC.md Abschnitt 5
- Claude API (KI-Einordnung) erst nach dem MVP, siehe SPEC.md Backlog. Ergebnis immer als "KI-Einordnung" markieren.
- Keine API-Schlüssel ins Repo. Schlüssel nur in `.env.local`, die in `.gitignore` steht.

## Arbeiten mit Herdr

- Parallele Agenten arbeiten jeweils in eigenen Git-Worktrees und eigenen Branches, nie zwei Agenten im selben Ordner.
- Jeder Agent bekommt einen klar abgegrenzten Teil (Datenschicht, Oberfläche, Demo-Pass) und eine Schnittstelle aus SPEC.md, gegen die er baut.

## Stil

- Texte in der App: klar und sachlich, keine Gedankenstriche (em-dashes), keine Werbefloskeln.
