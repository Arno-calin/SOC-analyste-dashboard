# SOC analyst dashboard

L'objectif de ce projet est de trouver comment faire pour accélerer le temps d'adaptation d'un nouvel analyste dans un SOC. Et, si cela est possible.

L'extension [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) est vivement recommandée. Elle permet de formater le code pour les langages web.

## Résultat

Ce projet a aboutit à la réalisation d'un [diaporama](https://github.com/Arno-calin/SOC-analyste-dashboard/blob/master/V3/Dashboard%20presentation.pdf) résumant les idées qui ont été trouvées.

Les différentes versions, listées ci-dessous, représentent l'évolution du projet et des pistes d'améliorations potentielles.

## Le projet

### V1

#### Installation

##### format des données

- créer un environnement python (développer)
- installer les dépendances de requirements.txt (développer)
- commande pour lancer le serveur

#### Pipeline

1. Récupération des données depuis wireshark sous format .csv
1. Démarrage du serveur flask
1. Demande d'accès à la page /data
1. Chargement du fichier .csv
1. Traitement des données
1. Mise à jour du document html
1. Création du graphique via D3.js
1. Envoie de la page au client

pip pour récupérer depuis requirements.txt

comment générer des données random

#### Technologies

- d3.js pour les graphiques
- flask pour le serveur python et les template html

### V2

#### Installation

commande pour récupérer node_module (démarrer un serveur vite)

#### Technologies

### V3

Cette version met l'emphase sur le frontend afin de présenter les idées clairement sans se soucier du code, mais juste du visuel.

#### Installation

Aucune installation n'est recquise. Chaque pages sont auto-suffisantes et contiennent HTML, CSS et JS. Il suffit d'avoir un navigateur web.

##### Technologies

L'IA de google [Stich](https://stitch.withgoogle.com/) a été utilisé pour générer les pages de la `V3`.

Voici le lien [où se trouve les pages générés pour la V3](https://stitch.withgoogle.com/projects/4788389111202848761). Les pages de la colonne tout à gauche sont celles qui ont été réutilisés pour le diaporama finale.

La garantie d'accès au lien n'est pas garantit. Il peut être supprimé à tout moment.
Pour éviter cela cette archive contient [toutes les pages qui ont été générés](/V3/stitch_soc_dashboard_design.zip) avec un PNG et le code HTML pour chacune d'entre elles.

Afin d'assurer la cohérence entre les pages, elles ont été modifiés grâce à l'inspecteur d'élément.

##### Utilisation de Stitch

- Une fois le premier prompt lancé il faut changer à la main la palette de couleur utilisée sinon l'ia restera avec la première qu'elle a choisit et ne proposera plus de nouveau design.
- Il faut un prompt clair et précis sur ce que l'ont souhaite.
  - Il est très important de préciser les éléments qui ne doivent pas apparaître.
- Il est possible d'annoter une zone de la page pour créer un prompt uniquement sur cette partie.
- Il est possible de modifier le texte en cliquant dessus.
  - Je recommande de d'abord télécharger le code html puis de modifier le code source
- Le code généré possède encore beaucoup de balise `div` et utilise `Tailwind`.
- Il faut copier le code source de la page et non celui de la preview qui ne donnera rien d'exploitable.

#### Pages inutilisées

Les pages suivantes n'ont pas été utilisé dans la version finale mais peuvent être utilisés pour de futurs améliorations :

- [Matrice de confusion](/V3/confusionMatrix.html);
- [Une autre palette de couleurs](/V3/otherColor.html);
- [Analyse des logs](/V3/logAnalyse.html).

Il y a également dans stitch des pages qui ont été générées sans jamais avoir été utilisées. Je les ai laissé au cas où elles pourraient servir, inspirer de nouvelles idées.

## Lexique

- pcap
- SIEM
- EDR
- IDS

## Ouverture

### Retour sur la présentation orale

ajouter précision si la source a été active ou inactive et le nombre total de sources

être plus précis sur event interne : mise à jour, maintenance : pas un employé qui laisse une faille

Ce qui est déjà présent dans le diaporama est à conserver

### Proposition personnelle

montrer les peaks
changer les codes couleurs pour plus de contraster entre critique et normal

ajouter plus d'informations pertinentes sur les pages event stable et emergency + d'exmeple de blind test (utiliser wireshark sur un jour avec tentative d'intrusion pour avoir un vrai pattern)
