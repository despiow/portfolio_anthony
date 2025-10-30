#!/bin/bash

# Script de build et déploiement pour le portfolio_anthony

echo "🚀 Construction du portfolio_anthony avec Docker..."

# Vérifier si Docker est en cours d'exécution
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker n'est pas en cours d'exécution. Veuillez démarrer Docker."
    exit 1
fi

# Construction de l'image
echo "📦 Construction de l'image Docker..."
docker build -t portfolio_anthony:latest .

if [ $? -eq 0 ]; then
    echo "✅ Image construite avec succès!"
    
    # Option pour lancer le conteneur
    read -p "Voulez-vous lancer le conteneur maintenant? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "🌐 Lancement du conteneur..."
        docker-compose up -d
        echo "✅ portfolio_anthony disponible sur http://localhost:8080"
    fi
else
    echo "❌ Erreur lors de la construction de l'image"
    exit 1
fi
