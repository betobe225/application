import React from 'react';
import { Link } from 'react-router-dom'; // Importer Link pour la navigation
import './index.css'; // Assurez-vous d'importer vos styles
import logo from './assets/logo-transparent-png.png'; // Importer l'image

const HomePage = () => {
    return (
        <div>

            <main>
                <section id="accueil" className="hero">
                    <div className="hero-logo">
                        <img src={logo} alt="ExpressDelivery Logo" className="main-logo" />
                        <div className="logo-text">ExpressDelivery</div>
                    </div>
                    <p>Connectez-vous avec des livreurs de confiance près de chez vous</p>
                    <div className="cta-buttons">
                        <Link to="/rendre-service" className="cta-button deliver">Rendre un service</Link>
                        <Link to="/request-service" className="cta-button send">Demander un service</Link>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default HomePage;
