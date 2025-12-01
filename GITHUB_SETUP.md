# 📦 Instructions pour pousser le projet sur GitHub

## Étape 1 : Créer un repository sur GitHub

1. Allez sur [GitHub](https://github.com/)
2. Cliquez sur le bouton **"New repository"** (ou le **"+"** en haut à droite)
3. Nommez votre repository : `tricentis-demo-tests` (ou un autre nom de votre choix)
4. **NE PAS** cocher "Initialize this repository with a README" (on a déjà créé les fichiers)
5. Cliquez sur **"Create repository"**

## Étape 2 : Configurer Git localement

Ouvrez un terminal dans le dossier du projet et exécutez :

```bash
# Configurer votre identité Git (si ce n'est pas déjà fait)
git config --global user.name "Votre Nom"
git config --global user.email "votre.email@example.com"

# Se placer dans le dossier du projet
cd /home/claude/tricentis-demo-tests
```

## Étape 3 : Ajouter et committer les fichiers

```bash
# Ajouter tous les fichiers
git add .

# Créer le premier commit
git commit -m "Initial commit: Suite de tests Playwright complète pour Demo Web Shop Tricentis"
```

## Étape 4 : Pousser vers GitHub

```bash
# Renommer la branche master en main (recommandé)
git branch -M main

# Ajouter le repository distant (REMPLACEZ 'votre-username' par votre nom d'utilisateur GitHub)
git remote add origin https://github.com/votre-username/tricentis-demo-tests.git

# Pousser les fichiers vers GitHub
git push -u origin main
```

## Alternative : Utiliser SSH au lieu de HTTPS

Si vous avez configuré SSH sur GitHub :

```bash
# Ajouter le repository distant avec SSH
git remote add origin git@github.com:votre-username/tricentis-demo-tests.git

# Pousser les fichiers
git push -u origin main
```

## Étape 5 : Vérifier sur GitHub

1. Actualisez la page de votre repository sur GitHub
2. Vous devriez voir tous les fichiers du projet
3. Le README.md s'affichera automatiquement sur la page d'accueil

## 🎉 C'est fait !

Votre projet est maintenant sur GitHub et prêt à être partagé ou cloné.

## Commandes Git utiles pour la suite

```bash
# Vérifier le statut des fichiers
git status

# Ajouter des modifications
git add .
git commit -m "Description de vos modifications"
git push

# Créer une nouvelle branche
git checkout -b feature/nouvelle-fonctionnalite

# Fusionner une branche
git checkout main
git merge feature/nouvelle-fonctionnalite
```

## Cloner le projet ailleurs

Pour récupérer le projet sur une autre machine :

```bash
git clone https://github.com/votre-username/tricentis-demo-tests.git
cd tricentis-demo-tests
npm install
npx playwright install
npm test
```

## 🔧 Configuration GitHub Actions

Une fois le projet sur GitHub, les tests s'exécuteront automatiquement :
- À chaque push sur la branche main
- À chaque pull request
- Manuellement depuis l'onglet "Actions"

Les rapports de tests seront disponibles dans l'onglet "Actions" de votre repository.

---

**Note** : N'oubliez pas de remplacer `votre-username` par votre véritable nom d'utilisateur GitHub dans toutes les commandes !
