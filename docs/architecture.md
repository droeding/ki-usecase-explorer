# Architektur-Dokument: Use-Case-Bewertungsplattform V1

## 1. High-Level-Architektur
* **Zusammenfassung:** Die Anwendung wird als moderne Full-Stack-Webanwendung auf Basis von Next.js und TypeScript entwickelt und auf Microsoft Azure gehostet. Die Authentifizierung erfolgt über ein "Magic Link"-System.
* **Plattform:** Microsoft Azure (Azure App Service, Azure Database for PostgreSQL, Azure DevOps).
* **Architektur-Muster:** Full-Stack-Framework (Next.js), Magic-Link-Authentifizierung.

## 2. Technologie-Stack
| Kategorie | Technologie | Zweck |
| :--- | :--- | :--- |
| Sprache | TypeScript | Haupt-Programmiersprache |
| Framework | Next.js | Full-Stack-Web-Framework |
| Datenbank | PostgreSQL | Relationale Datenbank |
| Hosting | Azure App Service | Betrieb der Web-Anwendung |
| CI/CD | Azure DevOps | Automatisierung von Build & Deployment |

## 3. Datenbank-Schema
```sql
CREATE TABLE use_cases ( id UUID PRIMARY KEY, title VARCHAR(255) NOT NULL, ... );
CREATE TABLE reviewers ( id UUID PRIMARY KEY, ... );
CREATE TABLE evaluations ( id UUID PRIMARY KEY, use_case_id UUID NOT NULL, reviewer_id UUID NOT NULL, evaluation_value VARCHAR(10) NOT NULL, UNIQUE (use_case_id, reviewer_id) );

bewertungsplattform/
├── apps/
│   └── web/
├── packages/
│   ├── ui/
│   ├── db/
│   │   └── prisma/
│   └── ...
└── ...

