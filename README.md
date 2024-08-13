
# OlympicGamesStarter

This project was generated with Angular CLI version 18.0.3.

## Getting Started

Install the necessary dependencies:

```bash
npm install
```

## Development Server

To start a development server, run:

```bash
ng serve
```

Access the app at `http://localhost:4200/`. The application will automatically reload on changes.

## Build

To build the project for production, run:

```bash
ng build
```

The build artifacts will be stored in the `dist/` directory.

## Project Structure

This project follows a structured architecture:

- **`components`**: Reusable components shared across the application.
- **`pages`**: Components used specifically for routing and representing different views.
- **`core`**: Encapsulates the business logic, including:
  - **`services`**: Handles data fetching and state management.
  - **`models`**: TypeScript interfaces and models representing data structures.

## Application Features

- **Data Visualization**: Displays the total number of Olympic editions and participating countries on the homepage, with detailed country statistics.
- **Navigation**:
  - **Home Page**: Overview of Olympic data with interactive charts.
  - **Country Detail Page**: Detailed statistics for each country, with handling for invalid country IDs.
  - **404 Page**: Custom page for invalid routes or missing data.
- **Error Handling**: Robust management of missing data and incorrect URLs.

---

# OlympicGamesStarter

Ce projet a été généré avec Angular CLI version 18.0.3.

## Démarrage

Installez les dépendances nécessaires :

```bash
npm install
```

## Serveur de développement

Pour démarrer un serveur de développement, exécutez :

```bash
ng serve
```

Accédez à l'application sur `http://localhost:4200/`. L'application se rechargera automatiquement en cas de modification.

## Construction

Pour compiler le projet pour la production, exécutez :

```bash
ng build
```

Les fichiers compilés seront stockés dans le répertoire `dist/`.

## Structure du projet

Le projet suit une architecture structurée :

- **`components`** : Composants réutilisables partagés dans l'application.
- **`pages`** : Composants utilisés pour le routage et représentant différentes vues.
- **`core`** : Encapsule la logique métier, y compris :
  - **`services`** : Gère la récupération des données et la gestion de l'état.
  - **`models`** : Interfaces TypeScript et modèles représentant les structures de données.

## Fonctionnalités de l'application

- **Visualisation des données** : Affiche le nombre total d'éditions des JO et de pays participants sur la page d'accueil, avec des statistiques détaillées par pays.
- **Navigation** :
  - **Page d'accueil** : Vue d'ensemble des données olympiques avec des graphiques interactifs.
  - **Page de détail du pays** : Statistiques détaillées pour chaque pays, avec gestion des ID de pays invalides.
  - **Page 404** : Page personnalisée pour les routes invalides ou les données manquantes.
- **Gestion des erreurs** : Gestion robuste des données manquantes et des URL incorrectes.

