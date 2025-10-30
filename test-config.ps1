# Script PowerShell de test des configurations Apache et PHP

param(
    [switch]$BuildTest
)

$ErrorActionPreference = "Stop"

Write-Host "🔍 Test des configurations Apache et PHP..." -ForegroundColor Green

# Fonction de nettoyage
function Cleanup {
    Write-Host "🧹 Nettoyage..." -ForegroundColor Yellow
    try {
        docker rm -f apache-test 2>$null
    } catch {
        # Ignorer les erreurs de nettoyage
    }
}

# Configurer le nettoyage en cas d'interruption
trap { Cleanup; break }

try {
    # Test 1: Validation de la syntaxe Apache avec Docker
    Write-Host "📋 Test 1: Validation de la configuration Apache VirtualHost..." -ForegroundColor Cyan
    
    docker run --rm `
        -v "${PWD}/apache-vhost.conf:/etc/apache2/sites-available/portfolio_anthony.conf:ro" `
        -v "${PWD}/php.ini:/tmp/php.ini:ro" `
        httpd:2.4-alpine `
        sh -c "
            echo 'LoadModule rewrite_module modules/mod_rewrite.so' >> /usr/local/apache2/conf/httpd.conf
            echo 'LoadModule headers_module modules/mod_headers.so' >> /usr/local/apache2/conf/httpd.conf
            echo 'Include /etc/apache2/sites-available/portfolio_anthony.conf' >> /usr/local/apache2/conf/httpd.conf
            httpd -t
        "
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Configuration Apache VirtualHost valide!" -ForegroundColor Green
    } else {
        Write-Host "❌ Erreur dans la configuration Apache VirtualHost!" -ForegroundColor Red
        exit 1
    }

    # Test 2: Validation de la syntaxe PHP
    Write-Host "📋 Test 2: Validation de la configuration PHP..." -ForegroundColor Cyan
    
    docker run --rm `
        -v "${PWD}/php.ini:/tmp/php.ini:ro" `
        php:8.2-cli `
        php -t -c /tmp/php.ini
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Configuration PHP valide!" -ForegroundColor Green
    } else {
        Write-Host "❌ Erreur dans la configuration PHP!" -ForegroundColor Red
        exit 1
    }

    # Test 3: Test de build Docker (optionnel)
    if ($BuildTest) {
        Write-Host "📋 Test 3: Test de construction Docker..." -ForegroundColor Cyan
        
        docker build --target builder -t portfolio_anthony-builder:test .
        docker build --target production -t portfolio_anthony:test .
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Construction Docker réussie!" -ForegroundColor Green
            
            # Nettoyer les images de test
            try {
                docker rmi portfolio_anthony-builder:test portfolio_anthony:test 2>$null
            } catch {
                # Ignorer les erreurs de nettoyage
            }
        } else {
            Write-Host "❌ Erreur lors de la construction Docker!" -ForegroundColor Red
            exit 1
        }
    }

    Write-Host "🎉 Tous les tests de configuration sont passés avec succès!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📝 Utilisation:" -ForegroundColor Yellow
    Write-Host "  .\test-config.ps1                # Tests de base (Apache + PHP)" -ForegroundColor White
    Write-Host "  .\test-config.ps1 -BuildTest     # Tests complets avec build Docker" -ForegroundColor White

} catch {
    Write-Host "❌ Erreur lors des tests: $_" -ForegroundColor Red
    exit 1
} finally {
    Cleanup
}
