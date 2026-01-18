# 🔑 Jak vytvořit GitHub Token

Pro admin panel potřebuješ GitHub Personal Access Token. Tady je návod krok za krokem:

## 📋 Návod

### 1. Přihlaš se na GitHub
Jdi na [github.com](https://github.com) a přihlaš se.

### 2. Otevři nastavení
1. Klikni na svůj avatar vpravo nahoře
2. Klikni na **Settings** (Nastavení)

### 3. Developer Settings
1. V levém menu sjeď dolů na **Developer settings**
2. Klikni na **Personal access tokens**
3. Klikni na **Fine-grained tokens** (nebo **Tokens (classic)** pro jednodušší variantu)

### 4. Vytvoř nový token

#### Pro Fine-grained token (doporučeno):
1. Klikni **Generate new token**
2. Zadej název: např. "Pepioli Admin"
3. Nastav expiraci: např. 90 dní nebo No expiration
4. V **Repository access** vyber **Only select repositories**
5. Vyber repository: `pepioli`
6. V **Permissions** najdi **Contents** a nastav na **Read and write**
7. Klikni **Generate token**

#### Pro Classic token (jednodušší):
1. Klikni **Generate new token (classic)**
2. Zadej název: např. "Pepioli Admin"
3. Vyber scope: zaškrtni **repo** (celý)
4. Klikni **Generate token**

### 5. Zkopíruj token
⚠️ **DŮLEŽITÉ**: Token se zobrazí jen jednou!

```
ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Zkopíruj ho a uložse někam (např. do poznámek).

### 6. Použij v admin panelu
1. Jdi na: https://cooldadpresident.github.io/pepioli/admin/
2. Zadej heslo: `pepioli2026`
3. Vlož token do pole "GitHub Token"
4. Klikni "Přihlásit"

Token se uloží v prohlížeči, nemusíš ho zadávat pokaždé!

## 🔒 Bezpečnost

- ✅ Token uložen pouze ve tvém prohlížeči (localStorage)
- ✅ Nikdy ho nesdílej s nikým
- ✅ Pokud ho ztratíš, vytvoř nový a smaž starý
- ✅ Fine-grained token má přístup jen k Pepioli repository

## ❓ Problém?

Pokud token nefunguje:
1. Zkontroluj, že má správná oprávnění (Contents: Read and write)
2. Zkontroluj, že není expirovaný
3. Vytvoř nový token a zkus znovu

---

**Token máš? Super! Teď můžeš spravovat obsah na webu! 🎉**
