pip freeze pour l'environnement python de flask de la V1

# Réunion

on peut faire les pays
activités par parfeux

## État actuel

## Questions

Qu'un seul morceau de tout : event interne intéressant les autres moins
ajouter niveau d'alerte

## Notes

(- sécuriser champ libre)

- ajouter id dans csv pour
  - le type serait le nom complet
    - ajouter un champ acronym pour mettre une légend et réduire le chauvement
    - limiter le nombre de caractère et afficher '...' si nécessaire
- ajouter des titres aux filtres
- ajouter colonne csv dont un champ données spécifiques (cf photo teams)
  - Ajouter des menus déroulants pour chaque types qui affiche les catégories contenues dedans (les deux trucs cochables pour afficher ou non)
- plotly js (ajouter une autre page / autre serv)
  - csv sur github pour pas passer via un serveur
    (- se renseigner pour quoi dynamiser données importantes du pcap)
- confirmation pour bouton suppr
  (- tag perso pour sa session en cours)
  (- bouton pour proposer au supérieur ma propotion d'ajout permanent à la db)

### plus tard

un outil pour créer la doc comme javadoc ?

- swagger / ce que je veux

# Important

ajouter des query dans les routes en fonction du fichier d'entrée : pcap, csv brut, csv cohérent

python lire pcapng (cf chatgpt)
scapy / pyshark

lire la doc D3.js pour faire des graphiques incroyables
idem test python pour manipuler les données

créer un fichier requirements.txt pour dépendance python

# Admin

Trouver la bonne license
faire des bons commits atomiques

# Livrables

## L1 : créer un template

1. Utiliser figma pour créer une maquette
1. Définir l'ui pour demander à l'ia de générer un css (déjà fait ça marche super bien pour avoir une bonne base mais il faut avoir un agent ia pour maintenir)

- Choisir les courbes que l'on souhaite afficher (edr, ids, total [les trouver dans le pcap])
  - Case à cocher pour savoir les couches qu'on utilise
- Ajouter début et fin pour événement si les deux différents mettre une barre au dessus ou en dessous du graphique (au choix de l'utilisateur)
  - faire deux tableaux différents les html
- Choisir le type d'événement que l'on souhaite avoir : scolaire (rentrée), récurrent, interne (mise à jour)
- date picker pour modifier l'intervalle de temps visible + previous select, 1 an, 6 derniers mois

- Aggrandir la lisibilité des axes au détriment des données
- Faire du feedback, responsive smooth

- permettre de modifier la pelette de couleurs, jouer sur les couleurs pour le contraste

- Semaine pro faire la présentation
- bouton exporter

## L2 : analyse des données

    from scapy.all import PcapReader

    with PcapReader("capture.pcap") as pcap:
        for pkt in pcap:
            process(pkt)

## L3 : ajout TIP

## L4 : /diff

créer un form
puis générer (cf diffchecker.com)
ce que pense la personne connait à l'habitude != la réalité dans cette entreprise

## L5 : documentation

1. tenir le readme à jour

# Ressources

# Ouverture

créer un script pour du ml et avoir un modèle de prédiction pour un csv chargé
utiliser read_csv(chunksize=x)
cf chatgpt pour combiner rust et python

# Librairie à test

Key JavaScript libraries that support layered charting include:

    Layer Cake: This is a headless graphics framework for Svelte that specifically focuses on building visualizations one layer at a time. It synchronizes scales across different HTML, SVG, Canvas, or WebGL components, making it ideal for custom, layered graphics.

    SciChart.js: This library features an "Annotation Layers" API, which allows developers to organize annotations (e.g., text, boxes) into different layers such as Background, BelowChart, and AboveChart to control rendering order and interactivity.

    LightningChart JS: This library supports "layered areas" where individual data series can be stacked using transparency or perspective within the same chart view.

    linked-charts: This library allows multiple plots (layers) of the same or different types (scatter, line, bar) to be put on top of each other, all using the same
    chart basis and synchronized zooming/panning.

    deck.gl: This library constructs complex geospatial visualizations by composing existing, reusable layers, making it suitable for mapping applications with multiple data overlays.

    Chart.js: While not explicitly a "layer-based" library in the same architectural sense as Layer Cake, it supports mixed chart types (e.g., a line series over a bar series) and layered background colors, achieving a similar visual layering effect.

D3.js: As a low-level library, D3.js provides the building blocks for creating bespoke data visualizations, where the developer has complete control over layering different SVG elements.

C3.js : Une librairie très populaire qui encapsule D3 pour générer des graphiques (courbes, barres, camemberts) avec une configuration simple, agissant comme une couche de simplification.

Plotly.js : Basée sur D3.js et Stack.gl, elle est excellente pour les graphiques scientifiques et interactifs, offrant un haut niveau d'abstraction.

Nivo : Conçue pour React et construite sur D3, elle fournit des composants graphiques prêts à l'emploi avec une grande richesse visuelle.

Vega / Vega-Lite : Ces librairies permettent de définir des visualisations sous forme de spécifications JSON. Vega-Lite est particulièrement puissante pour générer des visualisations D3 complexes de manière déclarative (similaire à une macro). (react-jsonschema-form)

https://www.highcharts.com/?gad_source=1&gad_campaignid=22994297277&lsgclid=CjwKCAjwyMnNBhBNEiwA-Kcgu7e-6EIZvF9l5K51pxOEBYBonIGhfIObbUXF58-7cSfnguGEOYF-iBoCRhIQAvD_BwE

## poubelle

### notes V3

# Présentation

1. Écran différence

   - Nombre de connexion habituelle
   - Nombre d'echec de mot de passe attendu en moyenne

1. Évolution du nombre d'alerte en fonction du temps pour différentes sources

   - modifier le temps (axe des x)
   - bouton pour afficher ou non courbe
   - événements interne

1. mode clair / mode sombre

1. Une page pour les éléments récurrent

   - stats sur plusieurs années / mois / jours
   - daté (noel) ou non (sorti d'un nouveau jeu vidéo)
   - lesquels sont normaux (pas de tentatives d'intrusion)
     lesquels sont suspects (tentatives d'intrusion)

1. Quand l'utilisateur sélectionne une zone / un événement spécifique à analyser
   Activation automatique des couleurs en fonction de la gravité des données - vert si normal (même si les données sont troublantes ici c'est ok) - élements qui font dire que c'est normal - rouge si anormal (même si ailleurs parfaitement acceptable ici pas ok) - éléments qui font dire que c'est inquiétant

1. Sur la même page on peut superposer des événements récurrents identiques pour
   voir son évolution dans le temps

1. Une courbe différence à la normale, pour un événement donné

1. Carte du monde avec origine des adresses IP normales
   origine des adresses ip souvent anormales
   origine des adresses ip très rares (donc potentiellement anormales)

1. Faire un diagramme des répartitions des origines des parefeux

1. Page d'entraînement où on lui propose plusieurs boutons d'action et il doit choisir le plus pertinenet pour tel ou tel alerte

# Améliorations

mettre des petites phrases, 2 phrases max
faire de la cohérence entre les images
mise en page / passer en anglais

1. Répartition des protocoles quand on clique sur une source

Poser un nombre de questions une à la fois avec sa propre expérience par
l'entreprise (il connait de toute façon pas) fin : prend chaque réponse et
compare = cf le tableau sur teams : bleu idem ; rouge c'est pire ici ; vert
c'est mieux changer le tableau que j'ai sous forme de questions (supprimer
entreprise)
