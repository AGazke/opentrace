# Arbeitspakete für parallele Agenten

Grundlage: [SPEC.md](../SPEC.md) Abschnitt 12. Jeder Agent arbeitet nur in seinem Worktree und Branch.

| Paket | Briefing | Branch | Worktree (neben dem Repo) |
|---|---|---|---|
| A Datenschicht | [A-data.md](A-data.md) | `feat/data` | `../opentrace-data` |
| B Oberfläche | [B-ui.md](B-ui.md) | `feat/ui` | `../opentrace-ui` |
| C Demo-Batteriepass | [C-batterypass.md](C-batterypass.md) | `feat/batterypass` | `../opentrace-batterypass` |

## Regeln für alle Pakete

- `CLAUDE.md` und `docs/SPEC.md` zuerst lesen. Die Datenregel gilt ohne Ausnahme.
- `lib/types.ts` und `lib/config.ts` nicht ändern. Änderungswünsche als Notiz an Adrian, Änderung nur auf `main`.
- Nur Dateien im eigenen Umfang anlegen oder ändern (siehe Briefing, Abschnitt "Dateien").
- Code, Kommentare und Commits auf Englisch. Texte in der App auf Deutsch, sachlich, ohne Gedankenstriche.
- Kleine Commits. Vor jedem Commit: `npm run typecheck && npm run lint && npm test && npm run build`.
- Branch pushen (`git push -u origin <branch>`), Vercel baut eine Vorschau-URL. Nicht selbst nach `main` mergen.
- Neue Abhängigkeiten nur, wenn das Briefing sie nennt. Keine API-Schlüssel, keine kostenpflichtigen Dienste.
- Next.js 16 weicht von älteren Versionen ab: vor neuem Next-Code die passende Seite in `node_modules/next/dist/docs/` lesen (siehe `AGENTS.md`).

## Merge-Reihenfolge

A, dann C, dann B. Konflikte in `package-lock.json` werden mit `npm install` neu erzeugt. Nach jedem Merge: Checks auf `main`, Push, Vorschau prüfen.
