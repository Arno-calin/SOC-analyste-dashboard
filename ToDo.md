# Réunion

stitch :

- document statique : pas de js, pas d'interaction
- version utilisable zip : pas de js ; la version preview ne s'affiche pas une load depuis le terminal
- tailwind pas modifiable alors qu'un fichier css facil pour une ia géénrative de le reprendre
- code pas maintenable trop de div imbriqué pas d'id ou de classe
- opaque car pas mon code donc chiant à maintenir
- Il faut télécharger le .zip pour avoir le code, copier coller le code source ne marche pas
  zip ne contient pas D3
  page web preview contient le code zip + une image de la page (screen)
  le reste c'est du bordel google (dans la preview)
  pas de js dans stitch: html brut simule csv, graphique et D3
  même en demande explicite pour contourner

## État actuel

- j'ai ajouté une icône
- j'ai créé un csv depuis wireshark
- j'affiche un graphique :
  j'ai aggréga les données par secondes et j'ai compté le nombre de requêtes totales
- html pur sans tailwind mais avec id et classe de balises pour le css
  revoir le code html pour le rendre plus lisible / définir ce qu'on veut sur le template
- css dans un fichier pour facilement le modifier via ia
- js pur dans un fichier pour d3

- Manque une maquette

- Une version improved avec une courbe pour chaque protocole
- problème répétition du code js et html -> factoriser

## Questions

Est-ce qu'on reste sur du js pur ?
un outil pour créer la doc comme javadoc ?
pour l'instant j'ai bien compris ? je suis sur la bonne voie ?
qu'est-ce qu'on veut comme template ?

# Important

python lire pcapng (cf chatgpt)
scapy

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

## L2 : analyse des données

## L3 : ajout TIP

## L4 : /diff

## L5 : documentation

1. tenir le readme à jour

# Ressources

# Ouverture

créer un script pour du ml et avoir un modèle de prédiction pour un csv chargé
utiliser read_csv(chunksize=x)
cf chatgpt pour combiner rust et python
