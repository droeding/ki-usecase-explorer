# 3. Datenbank-Schema
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

