const recommendationSystem = {
    async getRecommendedDriver(delivery) {
        const drivers = await db.collection('drivers')
            .where('status', '==', 'available')
            .get();

        const scoredDrivers = await Promise.all(drivers.docs.map(async doc => {
            const driver = doc.data();
            const score = await this.calculateScore(driver, delivery);
            return { id: doc.id, ...driver, score };
        }));

        return scoredDrivers
            .sort((a, b) => b.score - a.score)
            .slice(0, 3); // Top 3 recommandations
    },

    async calculateScore(driver, delivery) {
        let score = 0;

        // Distance score (0-40 points)
        const distance = locationSystem.calculateDistance(
            driver.lastLocation.latitude,
            driver.lastLocation.longitude,
            delivery.pickup.latitude,
            delivery.pickup.longitude
        );
        score += Math.max(0, 40 - (distance / 1000)); // -1 point par km

        // Rating score (0-30 points)
        score += driver.rating * 6; // 5 étoiles = 30 points

        // Experience score (0-20 points)
        const deliveriesCompleted = await this.getCompletedDeliveries(driver.id);
        score += Math.min(20, deliveriesCompleted); // 1 point par livraison jusqu'à 20

        // Vehicle type compatibility (0-10 points)
        if (this.isVehicleCompatible(driver.vehicle, delivery.package)) {
            score += 10;
        }

        return score;
    },

    async getCompletedDeliveries(driverId) {
        const deliveries = await db.collection('deliveries')
            .where('driverId', '==', driverId)
            .where('status', '==', 'completed')
            .get();
        return deliveries.size;
    },

    isVehicleCompatible(vehicle, package) {
        const vehicleCapacity = {
            bike: 5,
            scooter: 15,
            car: 30
        };
        return vehicleCapacity[vehicle] >= package.weight;
    }
}; 