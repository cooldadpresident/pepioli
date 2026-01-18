# Pepioli Admin Panel

Moderní administrační rozhraní pro správu obsahu.

## 🔐 Přihlášení

Použijte svůj **GitHub Personal Access Token** s oprávněním `repo` (nebo fine-grained token s `Contents: Read and write`).

**Žádné heslo není potřeba** - GitHub token je vaše bezpečnost!

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

- ✅ **Pouze GitHub token** - žádné heslo v public repository
- ✅ Token uložen pouze ve vašem prohlížeči (localStorage)
- ✅ Nikdy token nesdílejte s nikým
- ✅ Pokud ho ztratíte, vytvoř nový a smaž starý
- ✅ Fine-grained token má přístup jen k Pepioli repository

**Bezpečnost**: Jen ten, kdo má platný GitHub token s přístupem k repository, může editovat obsah.

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
