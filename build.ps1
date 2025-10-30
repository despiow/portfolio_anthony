# Script PowerShell pour build et déploiement du portfolio_anthony

Write-Host "🚀 Construction du portfolio_anthony avec Docker..." -ForegroundColor Green

# Vérifier si Docker est en cours d'exécution
try {
    docker info | Out-Null
} catch {
    Write-Host "❌ Docker n'est pas en cours d'exécution. Veuillez démarrer Docker." -ForegroundColor Red
    exit 1
}

# Construction de l'image
Write-Host "📦 Construction de l'image Docker..." -ForegroundColor Yellow
docker build -t portfolio_anthony:latest .

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Image construite avec succès!" -ForegroundColor Green
    
    # Option pour lancer le conteneur
    $response = Read-Host "Voulez-vous lancer le conteneur maintenant? (y/n)"
    if ($response -eq 'y' -or $response -eq 'Y') {
        Write-Host "🌐 Lancement du conteneur..." -ForegroundColor Cyan
        docker-compose up -d
        Write-Host "✅ portfolio_anthony disponible sur http://localhost:8080" -ForegroundColor Green
    }
} else {
    Write-Host "❌ Erreur lors de la construction de l'image" -ForegroundColor Red
    exit 1
}
