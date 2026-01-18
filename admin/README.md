# Pepioli Admin Panel

Moderní administrační rozhraní pro správu obsahu.

## 🔐 Přihlášení

1. **Heslo**: `pepioli2026` (změňte v `admin.js`)
2. **GitHub Token**: Použijte svůj personal access token s oprávněním `repo`

## 🚀 Přístup

Admin panel bude dostupný na:
```
https://cooldadpresident.github.io/pepioli/admin/
```

## 📝 Funkce

- ✅ Vytváření nových příspěvků, receptů a projektů
- ✅ Úprava existujícího obsahu
- ✅ Smazání příspěvků
- ✅ Automatický commit do GitHub
- ✅ Moderní, responsivní design
- ✅ Markdown editor

## 🔒 Bezpečnost

**DŮLEŽITÉ**: Změňte výchozí heslo v souboru `admin.js`:

```javascript
const ADMIN_PASSWORD = 'pepioli2026'; // <-- Změňte toto!
```

## 💾 Jak to funguje

1. Přihlásíte se heslem a GitHub tokenem
2. Token se uloží pouze v prohlížeči (localStorage)
3. Všechny změny se commitují přímo do GitHub
4. GitHub Pages automaticky publikuje změny

## 🎨 Pro uživatele

Interface je v češtině a je navržen pro jednoduchou správu:
- **Blog**: Články s datem
- **Recepty**: Recepty bez data
- **Projekty**: Projekty bez data

Každý příspěvek podporuje Markdown formátování.
