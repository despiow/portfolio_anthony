#!/bin/bash

# Script de test des configurations Apache et PHP

set -e  # Arrêter le script en cas d'erreur

echo "🔍 Test des configurations Apache et PHP..."

# Fonction pour nettoyer en cas d'erreur
cleanup() {
    echo "🧹 Nettoyage..."
    if command -v docker >/dev/null 2>&1; then
        docker rm -f apache-test 2>/dev/null || true
    fi
}

# Configurer le nettoyage en cas d'interruption
trap cleanup EXIT

# Test 1: Validation de la syntaxe Apache avec Docker
echo "📋 Test 1: Validation de la configuration Apache VirtualHost..."

docker run --rm \
    -v "$(pwd)/apache-vhost.conf:/etc/apache2/sites-available/portfolio_anthony.conf:ro" \
    -v "$(pwd)/php.ini:/tmp/php.ini:ro" \
    httpd:2.4-alpine \
    sh -c "
        # Installer les modules nécessaires
        echo 'LoadModule rewrite_module modules/mod_rewrite.so' >> /usr/local/apache2/conf/httpd.conf
        echo 'LoadModule headers_module modules/mod_headers.so' >> /usr/local/apache2/conf/httpd.conf
        
        # Inclure notre configuration
        echo 'Include /etc/apache2/sites-available/portfolio_anthony.conf' >> /usr/local/apache2/conf/httpd.conf
        
        # Tester la configuration
        httpd -t
    "

if [ $? -eq 0 ]; then
    echo "✅ Configuration Apache VirtualHost valide!"
else
    echo "❌ Erreur dans la configuration Apache VirtualHost!"
    exit 1
fi

# Test 2: Validation de la syntaxe PHP
echo "📋 Test 2: Validation de la configuration PHP..."

docker run --rm \
    -v "$(pwd)/php.ini:/tmp/php.ini:ro" \
    php:8.2-cli \
    php -t -c /tmp/php.ini

if [ $? -eq 0 ]; then
    echo "✅ Configuration PHP valide!"
else
    echo "❌ Erreur dans la configuration PHP!"
    exit 1
fi

# Test 3: Test de build Docker (optionnel)
if [ "$1" = "--build-test" ]; then
    echo "📋 Test 3: Test de construction Docker..."
    
    docker build --target builder -t portfolio_anthony-builder:test .
    docker build --target production -t portfolio_anthony:test .
    
    if [ $? -eq 0 ]; then
        echo "✅ Construction Docker réussie!"
        
        # Nettoyer les images de test
        docker rmi portfolio_anthony-builder:test portfolio_anthony:test 2>/dev/null || true
    else
        echo "❌ Erreur lors de la construction Docker!"
        exit 1
    fi
fi

echo "🎉 Tous les tests de configuration sont passés avec succès!"
echo ""
echo "📝 Utilisation:"
echo "  ./test-config.sh                # Tests de base (Apache + PHP)"
echo "  ./test-config.sh --build-test   # Tests complets avec build Docker"
