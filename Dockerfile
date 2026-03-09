# ================================
# Stage 1: Builder - Installation des dépendances
# ================================
FROM php:8.2-cli as builder

# Installer Composer et les outils de build
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Installer les dépendances système pour le build
RUN apt-get update && apt-get install -y \
    git \
    zip \
    unzip \
    && rm -rf /var/lib/apt/lists/*

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de configuration Composer
COPY composer.json composer.lock* ./

# Installer les dépendances PHP (optimisé pour la production)
RUN composer install \
    --no-dev \
    --optimize-autoloader \
    --no-interaction \
    --no-scripts \
    --prefer-dist \
    && composer clear-cache

# ================================
# Stage 2: Production - Image finale optimisée
# ================================
FROM php:8.2-apache as production

# Installer uniquement les dépendances système nécessaires pour la production
RUN apt-get update && apt-get install -y \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

# Installer les extensions PHP nécessaires
RUN docker-php-ext-install \
    mbstring \
    exif \
    pcntl \
    bcmath \
    gd

# Activer mod_rewrite et mod_headers pour Apache
RUN a2enmod rewrite headers

# Configuration Apache optimisée
COPY apache-vhost.conf /etc/apache2/sites-available/000-default.conf

# Créer un utilisateur non-root pour plus de sécurité
RUN groupadd -r appgroup && useradd -r -g appgroup appuser

# Définir le répertoire de travail
WORKDIR /var/www/html

# Copier les dépendances depuis le stage builder
COPY --from=builder /app/vendor ./vendor

# Copier les fichiers de l'application
COPY --chown=www-data:www-data . .

# Copier le fichier composer.json pour l'autoloader
COPY --chown=www-data:www-data composer.json ./

# Configurer les permissions appropriées
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html \
    && chmod -R 644 /var/www/html/*.php \
    && chmod -R 644 /var/www/html/src/*.php

# Variables d'environnement par défaut (à surcharger en production)
ENV SMTP_HOST=smtp.gmail.com \
    SMTP_PORT=465 \
    SMTP_USER=your-email@gmail.com \
    SMTP_PASSWORD=your-password \
    SMTP_TO=destination@gmail.com \
    APACHE_RUN_USER=www-data \
    APACHE_RUN_GROUP=www-data

# Configuration PHP pour la production
COPY php.ini /usr/local/etc/php/conf.d/production.ini

# Créer le répertoire de logs s'il n'existe pas
RUN mkdir -p /var/log/apache2 && \
    chown www-data:www-data /var/log/apache2

# Exposer le port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/ || exit 1

# Commande par défaut
CMD ["apache2-foreground"]