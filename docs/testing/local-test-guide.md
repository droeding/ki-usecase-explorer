# 🧪 Lokale Testversion - Funktionstest Guide

## Server Start

### Web-App (Terminal 1)
```bash
npm run dev
```
**Erwartete Ausgabe:** `ready - started server on 0.0.0.0:3000`

### API (Terminal 2)  
```bash
npm run dev:api
```
**Erwartete Ausgabe:** Azure Functions Core Tools gestartet

## ✅ Funktions-Tests

### 1. **Frontend Grundtest**
- **URL:** http://localhost:3000
- **Test:** Seite lädt ohne Fehler
- **Erwartung:** Use Case Explorer Interface wird angezeigt

### 2. **Use Case API Test**
- **URL:** http://localhost:3000/api/usecases  
- **Test:** API liefert Use Cases zurück
- **Erwartung:** JSON-Response mit Use Case Array

### 3. **Shared Types Integration Test**
- **Aktion:** Browser Developer Tools öffnen → Network Tab
- **Test:** Keine TypeScript-Compilation-Fehler
- **Erwartung:** Keine 404/500 Fehler

### 4. **Use Case Popup Test**
- **Aktion:** Auf einen Use Case klicken
- **Test:** Popup öffnet sich mit korrekten Daten
- **Erwartung:** Alle Felder werden korrekt angezeigt

### 5. **Bewertung Test**
- **Aktion:** Im Popup eine Bewertung abgeben (HOCH/MITTEL/NIEDRIG)
- **Test:** Bewertung wird gespeichert
- **Erwartung:** API-Call erfolgreich

### 6. **Responsive Design Test**
- **Aktion:** Browser-Größe ändern
- **Test:** Layout passt sich an
- **Erwartung:** Mobile/Desktop Views funktionieren

## 🔍 Debugging Checklist

### Bei Problemen prüfen:

1. **Port-Konflikte:**
   ```bash
   lsof -i :3000  # Web-App Port
   lsof -i :7071  # Azure Functions Port
   ```

2. **TypeScript Compilation:**
   ```bash
   npm run type-check
   ```

3. **Dependencies:**
   ```bash
   npm ls @ki-usecase-explorer/types
   ```

4. **Browser Console:**
   - F12 → Console → Keine Fehler
   - Network Tab → Alle Requests successful

## 📊 Test-Protokoll

| Test | Status | Bemerkungen |
|------|--------|-------------|
| Frontend lädt | ⏳ | |
| API erreichbar | ⏳ | |
| Use Cases laden | ⏳ | |
| Popup funktioniert | ⏳ | |
| Bewertung speichern | ⏳ | |
| Responsive Design | ⏳ | |

## 🚀 Nach erfolgreichem Test

1. **Shared Types validiert** ✅
2. **API Integration funktioniert** ✅  
3. **Frontend-Backend Kommunikation** ✅
4. **Bereit für Story 5.3** → Testing & Validation
