// Nouveau fichier pour la gestion de l'interface
class TrackingUI {
    constructor(trackingSystem) {
        this.trackingSystem = trackingSystem;
        this.map = null;
        this.marker = null;
        this.routeLine = null;
    }

    async initialize(trackingNumber) {
        try {
            const tracking = await this.trackingSystem.getTrackingInfo(trackingNumber);
            this.displayTrackingInfo(tracking);
            this.initializeMap(tracking);
            
            // S'abonner aux mises à jour en temps réel
            this.trackingSystem.subscribeToUpdates(trackingNumber, {
                onLocationUpdate: (location) => this.updateMarkerPosition(location),
                onStatusUpdate: (status) => this.updateDeliveryStatus(status),
                onError: (error) => this.showError(error)
            });
        } catch (error) {
            this.showError(error); 
        }
    }

    displayTrackingInfo(tracking) {
        // Mettre à jour les informations de suivi
        document.querySelector('.delivery-info .info-item:nth-child(1) span:last-child')
            .textContent = `En route vers: ${tracking.destination.address}`;
        document.querySelector('.delivery-info .info-item:nth-child(2) span:last-child')
            .textContent = `Livreur: ${tracking.driver.name}`;
        document.querySelector('.delivery-info .info-item:nth-child(3) span:last-child')
            .textContent = `Véhicule: ${tracking.driver.vehicleInfo}`;

        // Mettre à jour l'historique
        const stepsContainer = document.querySelector('.status-steps');
        stepsContainer.innerHTML = tracking.history.map(step => `
            <div class="status-step">
                <div class="step-date">${step.date.toLocaleString()}</div>
                <div class="step-info">${step.details}</div>
                <div class="step-location">${step.location}</div>
            </div>
        `).join('');

        // Mettre à jour l'ETA
        document.querySelector('.eta p').textContent = 
            `Arrivée estimée dans: ${TrackingSystem.calculateETA(tracking)}`;
    }
    initializeMap(tracking) {
        if (!this.map) {
            this.map = L.map('map').setView([
                tracking.currentLocation.lat,
                tracking.currentLocation.lng
            ], 13);

            L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                attribution: '©OpenStreetMap, ©CartoDB',
                maxZoom: 19
            }).addTo(this.map);
        }

        // Ajouter le marqueur du livreur
        this.marker = L.marker([
            tracking.currentLocation.lat,
            tracking.currentLocation.lng
        ], {
            icon: L.divIcon({
                html: '🚚',
                className: 'delivery-marker',
                iconSize: [30, 30]
            })
        }).addTo(this.map);

        // Ajouter le marqueur de destination
        L.marker([
            tracking.destination.lat,
            tracking.destination.lng
        ], {
            icon: L.divIcon({
                html: '📍',
                className: 'destination-marker',
                iconSize: [30, 30]
            })
        }).addTo(this.map);

        // Tracer la route
        this.routeLine = L.polyline([
            [tracking.currentLocation.lat, tracking.currentLocation.lng],
            [tracking.destination.lat, tracking.destination.lng]
        ], {
            color: '#23a6d5',
            weight: 4,
            opacity: 0.8,
            dashArray: '10, 10'
        }).addTo(this.map);

        this.map.fitBounds(this.routeLine.getBounds(), { padding: [50, 50] });
    }

    updateMarkerPosition(location) {
        if (this.marker && this.routeLine) {
            const newLatLng = [location.latitude, location.longitude];
            this.marker.setLatLng(newLatLng);
            this.routeLine.setLatLngs([
                newLatLng,
                this.routeLine.getLatLngs()[1]
            ]);
        }
    }

    updateDeliveryStatus(status) {
        // Mise à jour du statut dans l'interface
        document.querySelector('.delivery-status').textContent = status;
    }

    showError(message) {
        alert(message);
    }
} 