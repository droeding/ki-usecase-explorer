# 3. Funktionale Anforderungen

## 3.1. Feature: Use-Case-Listenansicht
* **FR1.1:** Jeder Use Case wird in einer kompakten Übersicht (Kachel- oder Listenansicht) dargestellt. Diese Übersicht zeigt:
    * Titel des Use Case
    * Kurzbeschreibung
    * Geschäftsbereich
    * Reifegrad
* **FR1.2:** Durch einen Klick auf einen Use Case öffnet sich eine Detailansicht. Diese enthält alle Informationen aus der Kompakt-Übersicht sowie:
    * Problemstellung
    * Lösungsbeschreibung
    * Geschäftlicher Nutzen
    * Potenzieller Technologie-Stack
    * Aufwandsschätzung
    * Und weitere relevante Felder aus der Datenquelle.
* **FR1.3:** Die Liste ist initial unsortiert bzw. hat eine feste Reihenfolge, um die Bewertung nicht zu beeinflussen.

## 3.2. Feature: Individuelle Bewertung
* **FR2.1:** Neben/in jedem Use Case werden drei Bewertungsoptionen angezeigt: "Hoch", "Mittel", "Niedrig".
* **FR2.2:** Klickt ein Benutzer auf eine der Optionen, wird seine Bewertung gespeichert.
* **FR2.3:** Nach der Stimmabgabe erhält der Benutzer ein klares visuelles Feedback.
* **FR2.4:** Ein Benutzer kann seine Bewertung pro Use Case nur einmal abgeben.

## 3.3. Feature: Top-Ten-Berechnung (Backend)
* **FR3.1:** Für die Berechnung wird jeder Bewertung ein numerischer Wert zugewiesen: Hoch = 3 Punkte, Mittel = 2 Punkte, Niedrig = 1 Punkt.
* **FR3.2:** Die Gesamtpunktzahl eines Use Case ist die Summe der Punkte aller Bewertungen.
* **FR3.3:** Eine Admin-Funktion ermöglicht die Sortierung aller Use Cases nach ihrer Gesamtpunktzahl.
