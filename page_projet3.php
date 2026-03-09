<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Page d'exemple</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            text-align: center;
        }
        h1 {
            margin-top: 20px;
        }
        .image-container {
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            margin-top: 20px;
        }
        .image-container img {
            width: 90%;
            height: auto;
            margin: 10px;
        }
        .image-container2 img {
            width: 35%;
            height: auto;
            margin: 10px;
        }
        .p {
            text-align: left;
            margin: 20px;
        }
    </style>
</head>
<body>
    <h1>Exemple d'interface que je peux réaliser</h1>
    <div class="image-container">
        <img src="indexe.png" alt="Image 1">
    </div><br>
    <p class="p">
        Cette interface est un exemple de ce que je peux réaliser. Elle est responsive, elle permet à l'utilisateur d'ajouter une ligne avec toutes les informations nécessaires.
        Ce qui est en bleu est cliquable, cela ouvre une modale afin de modifier les informations de cet endroit, il y a des systèmes de filtres et de tris, les cases de statuts.
        Sont colorées en fonction de leur statut, elles sont cliquables pour changer de statut et pour certains de ces statuts, il y a des actions possibles. Les icônes sont cliquables.
        Et font une action suppression, modification de ligne et historique. 
    </p><br><br>

    <div class="image-container2">
        <img src="modale_remarque.png" alt="Image 1">
    </div><br>
    <p class="p">
        C'est un exemple de modale,celle ci est  pour les remarque entre différents utilisateurs. Elle permet de voir les remarques déjà existantes, d'en ajouter une nouvelle.
    </p>


</body>
</html>
