This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
# Workshop

---

# AstroTrace — Documentation

## Le projet

AstroTrace est un tableau de bord de suivi sanitaire pour l'équipage d'un vaisseau spatial. Il répond à deux questions posées à un médecin de bord en situation de crise épidémique : **qui est malade**, et **où se trouve chacun**.

L'application lit une base MySQL alimentée par les portes du vaisseau , un bracelet au bras de chaque citoyens qui prend leurs constante et affiche deux vues : une liste de triage des patients par gravité, et une carte des secteurs avec leurs occupants en temps réel.

Elle est construite avec Next.js 16 (App Router), React 19, TypeScript et Tailwind CSS v4.

## Démarrage

### Installation

```bash
npm install
```

### Base de données

La base tourne sur MySQL. En local en dev et depuis une VM en prod :

```bash
brew install mysql
brew services start mysql
mysql -u root -e "CREATE DATABASE astrotrace CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
mysql -u root astrotrace < "astrotrace (1).sql"
```

### Variables d'environnement

Le fichier `.env.local` (non versionné) contient deux jeux de variables : une base locale de développement et la base hébergée sur la VM. La variable `DB_TARGET` choisit laquelle utiliser.

```bash
DB_TARGET=local          # ou "vm"

LOCAL_DB_HOST=127.0.0.1
LOCAL_DB_PORT=3306
LOCAL_DB_USER=root
LOCAL_DB_PASSWORD=
LOCAL_DB_NAME=astrotrace

VM_DB_HOST=**********
VM_DB_PORT=3306
VM_DB_USER=********
VM_DB_PASSWORD=**********
VM_DB_NAME=astrotrace
```

Basculer d'une base à l'autre ne demande que de changer `DB_TARGET` et de redémarrer le serveur — les variables d'environnement sont lues au démarrage.

### Lancement

```bash
npm run dev     # serveur de développement
npm run lint    # vérification ESLint
npm run build   # build de production
```

## Arborescence

```
app/
  page.tsx              Page d'accueil : assemble les deux vues
  layout.tsx            Layout racine (polices, structure HTML)
  globals.css           Styles globaux et import Tailwind
  type.ts               Types TypeScript reflétant le schéma SQL
  components/
    HeaderSection.tsx   En-tête réutilisable (titre + sous-titre)
    List.tsx            Vue triage : patients et cas contacts
    SectorManage.tsx    Vue secteurs : boucle sur les portes
    Sector.tsx          Carte d'un secteur et de ses occupants
lib/
  db.ts                 Connexion MySQL et helper de requête
  action.ts             Server Actions : lecture et écriture
astrotrace.sql      Dump de la structure et des données
```

## Schéma de la base

Six tables, dont quatre utilisées par l'application à ce stade.

| Table | Rôle |
| --- | --- |
| `users` | L'équipage. Identité, rôle à bord, état de santé, pathologie, score de criticité, chambre. |
| `gates` | Les portes du vaisseau. Chaque porte mène vers un `sector` et vient d'un `sector_from`. |
| `gate_logs` | Historique des passages : qui, quelle porte, quel sens, quand, accès accordé ou refusé. |
| `quarantine_zones` | Zones d'isolement disponibles, avec leur capacité. |
| `quarantine_assignments` | Affectation d'un membre à une zone d'isolement. |
| `vitals_history` | Relevés de constantes (rythme cardiaque, SpO₂, température) pris aux portes. |

La colonne `users.health_status` est une énumération à quatre valeurs : `NORMAL`, `CONTACT`, `SICK`, `QUARANTINE`. 
## SICK est une personne malade qui n'est pas encore mise en quarantaine.

**Point clé du modèle : la position d'un membre d'équipage n'est stockée nulle part.** Elle se déduit de son dernier passage de porte dans `gate_logs`, en remontant au secteur de la porte franchie.

## Couche données

### `lib/db.ts`

Ce module ouvre la connexion à MySQL et expose un helper de requête.

**`db`** — un *pool* de connexions plutôt qu'une connexion unique. Le pool réutilise les connexions ouvertes et gère les reconnexions quand le lien réseau vers la VM est interrompu.

Le pool est mis en cache sur `globalThis` en développement. Sans ce cache, chaque rechargement à chaud de Next créerait un pool supplémentaire, et MySQL finirait par refuser les connexions.

Le préfixe des variables d'environnement (`LOCAL_` ou `VM_`) est résolu au démarrage à partir de `DB_TARGET`.

**`query<T>(sql, params)`** — exécute une requête et renvoie directement les lignes typées en `T[]`, au lieu du tuple `[rows, fields]` que rend `mysql2`.

Les valeurs passent obligatoirement par le tableau `params`, jamais par concaténation dans la chaîne SQL. C'est ce qui protège de l'injection SQL : MySQL reçoit la requête et les valeurs séparément, et ne peut donc pas interpréter une valeur comme du code.

### `lib/action.ts`

Fichier marqué `"use server"` : ses exports sont des **Server Actions**, des fonctions qui s'exécutent sur le serveur mais peuvent être déclenchées depuis l'interface.

**`marquerTraite(status, id)`** — met à jour l'état de santé d'un membre d'équipage.

Appelée par le bouton « Patient traité » de la liste de triage. Après l'écriture, `revalidatePath("/")` demande à Next de rejouer les requêtes de la page et de renvoyer un rendu à jour — la liste se met à jour sans code de synchronisation côté navigateur.

**`getPositions()`** — renvoie tout l'équipage avec sa position courante.

C'est la requête centrale du projet. Pour chaque membre, une sous-requête corrélée isole son **dernier** passage de porte autorisé, puis une jointure sur `gates` remonte le secteur correspondant.

```sql
SELECT u.*, g.sector, g.sector_from, l.direction, l.passed_at
FROM users u
LEFT JOIN gate_logs l ON l.id = (
  SELECT id FROM gate_logs
  WHERE user_id = u.id AND access_granted = 1
  ORDER BY passed_at DESC, id DESC
  LIMIT 1
)
LEFT JOIN gates g ON g.id = l.gate_id
```

Deux choix méritent d'être soulignés :

Les jointures sont des `LEFT JOIN`, ce qui conserve les membres n'ayant jamais franchi de porte. Leur `sector` vaut alors `NULL` — position inconnue plutôt que disparition de l'interface.

Le filtre `access_granted = 1` ignore les passages refusés : une tentative bloquée à une porte ne déplace personne.

## Types

`app/type.ts` décrit les formes de données renvoyées par la base. Ces types ne sont pas vérifiés à l'exécution : ils décrivent ce que MySQL est censé renvoyer, et doivent donc rester alignés sur le schéma SQL.

| Type | Correspond à |
| --- | --- |
| `Users` | Une ligne de la table `users` |
| `Gates` | Une ligne de la table `gates` |
| `Gate_logs` | Une ligne de la table `gate_logs` |
| `Position` | Le résultat de `getPositions()` : un `Users` enrichi du secteur et du dernier passage |

## Composants

Tous les composants sont des **Server Components** : ils s'exécutent sur le serveur et peuvent interroger la base directement, sans passer par une API HTTP intermédiaire. Les identifiants de connexion et le SQL ne sont jamais envoyés au navigateur.

### `app/page.tsx`

Point d'entrée. Assemble les deux vues, séparées par des en-têtes.

### `HeaderSection`

En-tête de section réutilisable.

| Prop | Type | Rôle |
| --- | --- | --- |
| `title` | `string` | Titre de la section |
| `subtitle` | `string` | Ligne de description |

### `List`

Vue de triage médical. Charge l'équipage, le répartit en deux groupes et affiche une carte par personne.

Le premier groupe rassemble les patients à traiter — statut `QUARANTINE` ou `SICK` — et s'affiche avec une bordure gauche rouge. Le second rassemble les cas contacts, en jaune.

Chaque carte élément de la liste un bouton « Patient traité » qui déclenche `marquerTraite` et repasse la personne en `NORMAL`.

### `SectorManage`

Vue de localisation. Charge la liste des portes et délègue l'affichage de chaque secteur à `Sector`.

### `Sector`

Carte d'un secteur : son nom, sa porte d'accès, son effectif présent et le détail de ses occupants.

|  Prop  |    Type |           Rôle                      |
|  ---   |   ---   |            ---                      |
| `gate` | `Gates` | La porte qui donne accès au secteur |

Chaque occupant est présenté avec son rôle à bord, sa chambre, un badge coloré selon son état de santé, et, s'il est atteint, sa pathologie et son score de criticité.

## Règles métier

### Détection des cas contacts

Un membre d'équipage est considéré comme cas contact dans deux situations.


**Voisinage de chambre** — il loge dans une chambre adjacente à celle d'un patient, c'est-à-dire dont le numéro diffère de 1. La promiscuité des quartiers d'habitation justifie cette présomption d'exposition.

Les patients eux-mêmes sont exclus de ce second test : un malade voisin d'un autre malade est déjà pris en charge dans la liste des patients, et apparaîtrait sinon dans les deux listes.

Cette règle est amenée à s'enrichir : le partage d'un même secteur au même moment, déductible de `gate_logs`, est le prolongement naturel du modèle.

**Passage dans une même salle** — On vérifie si le citoyen a était en contact avec un malade depuis que ce dernier a était diagnostiqué.

### Localisation

La position courante d'un membre est le secteur de la dernière porte qu'il a franchie avec un accès accordé.

Le modèle considère que tout déplacement est journalisé comme une **entrée** dans le secteur de destination. Sortir d'un secteur revient nécessairement à entrer dans un autre, puisque les secteurs du vaisseau sont tous reliés par des portes.
