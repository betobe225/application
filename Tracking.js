// Nouveau fichier pour la gestion du suivi
const TrackingSystem = {
    // États possibles du colis
    states: {
        REGISTERED: 'registered',
        PICKED_UP: 'picked_up',
        IN_TRANSIT: 'in_transit',
        OUT_FOR_DELIVERY: 'out_for_delivery',
        DELIVERED: 'delivered'
    },

    // Données de suivi simulées
    mockTracking: {
        'ED-123456789': {
            currentState: 'in_transit',
            history: [
                {
                    state: 'registered',
                    date: new Date(Date.now() - 172800000), // -48h
                    location: 'Paris Centre',
                    details: 'Colis enregistré'
                },
                {
                    state: 'picked_up',
                    date: new Date(Date.now() - 86400000), // -24h
                    location: 'Paris Centre',
                    details: 'Colis récupéré par le livreur'
                },
                {
                    state: 'in_transit',
                    date: new Date(),
                    location: 'En route vers Lyon',
                    details: 'En cours de livraison'
                }
            ],
            estimatedDelivery: new Date(Date.now() + 86400000), // +24h
            currentLocation: {
                lat: 48.8566,
                lng: 2.3522
            },
            destination: {
                lat: 45.7578,
                lng: 4.8320
            },
            driver: {
                name: 'Jean Dupont',
                phone: '+33612345678',
                vehicleInfo: 'Renault Express Blanc'
            }
        }
    },

    // Ajouter de nouvelles propriétés
    deliveryStatuses: {
        PENDING: 'En attente de prise en charge',
        PICKED_UP: 'Colis récupéré',
        IN_TRANSIT: 'En transit',
        OUT_FOR_DELIVERY: 'En cours de livraison',
        DELIVERED: 'Livré',
        DELAYED: 'Retardé',
        FAILED: 'Échec de livraison'
    },

    weatherConditions: {
        SUNNY: { icon: '☀️', impact: 0 },
        RAINY: { icon: '🌧️', impact: 15 },
        STORMY: { icon: '⛈️', impact: 30 },
        SNOWY: { icon: '🌨️', impact: 45 }
    },

    // Obtenir les informations de suivi
    async getTrackingInfo(trackingNumber) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Récupérer les détails de la commande
                const orderDetails = JSON.parse(sessionStorage.getItem('orderDetails'));
                
                if (!orderDetails) {
                    // Utiliser les données simulées si pas de commande réelle
                    const tracking = this.mockTracking[trackingNumber];
                    if (tracking) {
                        resolve(tracking);
                    } else {
                        reject('Numéro de suivi invalide');
                    }
                    return;
                }

                // Créer un objet de suivi avec les données réelles
                const realTracking = {
                    currentState: 'in_transit',
                    history: [
                        {
                            state: 'registered',
                            date: new Date(orderDetails.timestamp),
                            location: orderDetails.sender.address,
                            details: 'Colis enregistré'
                        },
                        {
                            state: 'picked_up',
                            date: new Date(),
                            location: orderDetails.sender.address,
                            details: 'Colis pris en charge'
                        }
                    ],
                    estimatedDelivery: new Date(Date.now() + 86400000), // +24h
                    currentLocation: {
                        lat: 48.8566,
                        lng: 2.3522
                    },
                    destination: {
                        address: orderDetails.receiver.address,
                        lat: 45.7578,
                        lng: 4.8320
                    },
                    driver: {
                        name: 'Jean Dupont',
                        phone: '+33612345678',
                        vehicleInfo: 'Renault Express Blanc'
                    },
                    packageInfo: {
                        type: orderDetails.package.type,
                        fragile: orderDetails.package.fragile,
                        description: orderDetails.package.description
                    },
                    sender: orderDetails.sender,
                    receiver: orderDetails.receiver
                };

                resolve(realTracking);
            }, 1000);
        });
    },

    // Mettre à jour la position en temps réel
    updatePosition(trackingNumber) {
        const tracking = this.mockTracking[trackingNumber];
        if (!tracking) return;

        // Simuler un mouvement
        const deltaLat = (tracking.destination.lat - tracking.currentLocation.lat) / 100;
        const deltaLng = (tracking.destination.lng - tracking.currentLocation.lng) / 100;

        tracking.currentLocation.lat += deltaLat;
        tracking.currentLocation.lng += deltaLng;

        return tracking.currentLocation;
    },

    // Calculer le temps estimé restant
    calculateETA(tracking) {
        const now = new Date();
        const eta = new Date(tracking.estimatedDelivery);
        const diff = eta - now;

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        return `${hours}h ${minutes}min`;
    },

    // Ajouter des méthodes pour la gestion des incidents
    reportDeliveryIssue(trackingNumber, issue) {
        const tracking = this.mockTracking[trackingNumber];
        if (!tracking) return;

        tracking.history.push({
            state: 'issue',
            date: new Date(),
            location: tracking.currentLocation,
            details: `Incident signalé: ${issue}`,
            type: 'warning'
        });

        // Recalculer l'ETA
        this.updateETA(trackingNumber, 30); // Ajoute 30 minutes par défaut
    },

    // Méthode pour mettre à jour l'ETA
    updateETA(trackingNumber, additionalMinutes) {
        const tracking = this.mockTracking[trackingNumber];
        if (!tracking) return;

        const newETA = new Date(tracking.estimatedDelivery.getTime() + additionalMinutes * 60000);
        tracking.estimatedDelivery = newETA;
        tracking.history.push({
            state: 'eta_update',
            date: new Date(),
            details: `Temps de livraison estimé mis à jour`,
            type: 'info'
        });
    },

    // Méthode pour obtenir les conditions météo sur le trajet
    async getWeatherConditions(lat, lng) {
        // Simuler un appel API météo
        return new Promise((resolve) => {
            const conditions = ['SUNNY', 'RAINY', 'STORMY', 'SNOWY'];
            const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
            
            setTimeout(() => {
                resolve({
                    condition: randomCondition,
                    ...this.weatherConditions[randomCondition]
                });
            }, 500);
        });
    },

    // Méthode pour calculer l'impact du trafic
    async getTrafficImpact(lat, lng) {
        // Simuler un appel API trafic
        return new Promise((resolve) => {
            const impacts = [
                { level: 'LIGHT', delay: 0, description: 'Trafic fluide' },
                { level: 'MODERATE', delay: 10, description: 'Trafic modéré' },
                { level: 'HEAVY', delay: 25, description: 'Trafic dense' },
                { level: 'SEVERE', delay: 45, description: 'Trafic très dense' }
            ];
            
            const randomImpact = impacts[Math.floor(Math.random() * impacts.length)];
            setTimeout(() => resolve(randomImpact), 500);
        });
    },

    // Méthode pour obtenir les points de passage
    getDeliveryCheckpoints(trackingNumber) {
        const tracking = this.mockTracking[trackingNumber];
        if (!tracking) return [];

        return [
            { type: 'pickup', location: tracking.history[0].location },
            { type: 'sorting', location: 'Centre de tri principal' },
            { type: 'transit', location: 'En transit' },
            { type: 'delivery', location: tracking.destination.address }
        ];
    },

    // Méthode pour obtenir des statistiques de livraison
    getDeliveryStats(trackingNumber) {
        const tracking = this.mockTracking[trackingNumber];
        if (!tracking) return null;

        const totalDistance = this.calculateTotalDistance(
            tracking.currentLocation,
            tracking.destination
        );

        const progress = this.calculateDeliveryProgress(trackingNumber);

        return {
            totalDistance: totalDistance.toFixed(1) + ' km',
            progress: progress + '%',
            estimatedTime: this.calculateETA(tracking),
            stops: tracking.history.length,
            averageSpeed: '45 km/h'
        };
    },

    // Méthode pour calculer la distance totale
    calculateTotalDistance(start, end) {
        const R = 6371; // Rayon de la Terre en km
        const dLat = (end.lat - start.lat) * Math.PI / 180;
        const dLon = (end.lng - start.lng) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                 Math.cos(start.lat * Math.PI / 180) * Math.cos(end.lat * Math.PI / 180) *
                 Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    },

    // Méthode pour calculer la progression de la livraison
    calculateDeliveryProgress(trackingNumber) {
        const tracking = this.mockTracking[trackingNumber];
        if (!tracking) return 0;

        const totalDistance = this.calculateTotalDistance(
            tracking.history[0].location,
            tracking.destination
        );
        const remainingDistance = this.calculateTotalDistance(
            tracking.currentLocation,
            tracking.destination
        );

        return Math.round(((totalDistance - remainingDistance) / totalDistance) * 100);
    }
};

// Ajouter dans tracking.html 