# BAM App — projet Expo

Scaffold de départ migré depuis le prototype web (mêmes données produits,
mêmes couleurs, même copy kreyòl). L'écran `Home` est complet ; les autres
sont en placeholder à finir dans Claude Code.

## 🚀 Démarrage

```bash
# 1. Installer les dépendances
npm install
npx expo install react-native-svg expo-linear-gradient expo-font @expo/vector-icons \
  @expo-google-fonts/fraunces @expo-google-fonts/plus-jakarta-sans

# 2. Lancer en dev (Expo Go sur ton téléphone, scan du QR code)
npx expo start
```

## 📂 Structure

```
App.tsx                    → navigation + chargement polices
src/theme/index.ts          → couleurs, espacements, rayons, ombres
src/theme/fonts.ts           → chargement Fraunces + Plus Jakarta Sans
src/data/products.ts        → catalogue retail + paliers de prix gros
src/components/Seal.tsx     → logo sceau BAM (SVG)
src/components/BottomNav.tsx → nav basse à 5 onglets
src/screens/HomeScreen.tsx  → écran Accueil complet (référence de style)
src/screens/PlaceholderScreen.tsx → écran temporaire pour tout le reste
assets/images/              → vrais packshots produits extraits du prototype
```

## 🛠️ Plan de travail dans Claude Code

Demande à Claude Code de continuer écran par écran, **en lui donnant
`HomeScreen.tsx` comme référence de style à chaque fois** :

1. **Catalog** — grille de produits filtrable par catégorie (Jus/Riz/Nouilles),
   utilise `products` de `src/data/products.ts`
2. **Product** — fiche produit avec sélection de format (`formatsFor()`),
   quantité, ajout au panier
3. **ProIntro / ProLogin / ProForm / ProConfirm** — parcours d'inscription
   revendeur (mode Gros)
4. **ProProduct** — fiche produit gros avec paliers de prix (`proProducts`)
5. **Cart** — panier avec liste des articles, sous-total, bouton commander
6. **Checkout** — choix paiement (MonCash / carte / cash à la livraison),
   adresse, confirmation
7. **Account** — profil, historique de commandes
8. **Tracking** — suivi de commande après achat
9. **BamPoints** — programme de fidélité

Prompt type à donner à Claude Code pour chaque écran :

> Construis l'écran [NOM] en suivant exactement le style de HomeScreen.tsx
> (mêmes tokens de src/theme, mêmes composants Seal/BottomNav, mêmes
> ombres/rayons). Utilise les données de src/data/products.ts. Contenu :
> [détail de ce que l'écran doit contenir].

## 📦 Build avec EAS

```bash
npm install -g eas-cli
eas login
eas build:configure        # génère/relie le projectId dans app.json
eas build --platform ios --profile preview      # build de test iOS
eas build --platform android --profile preview  # build de test Android
eas build --platform all --profile production   # build final stores
```

Avant le build production :
- Remplacer `REPLACE_WITH_YOUR_EAS_PROJECT_ID` dans `app.json`
- Ajouter une vraie icône (`assets/icon.png`, 1024×1024) et un splash
- Vérifier `bundleIdentifier` / `package` dans `app.json` (à adapter au
  compte développeur du client)

## ⚠️ Assets manquants

5 images du bundle d'origine n'étaient pas référencées par un nom clair
(fichiers `*.png`/`*.gif` nommés par UUID) — à vérifier si elles sont
utilisées quelque part avant de les jeter.
