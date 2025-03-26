import React from 'react';
import './index.css'; // Assurez-vous d'importer vos styles
import logo from './assets/logo-transparent-png.png'; // Importer l'image

const RendreService = () => {
    return (
        <div className="check-container" role="main">
            <div className="logo-container">
                <a href="/" aria-label="Retour à l'accueil ExpressDelivery">
                    <img src={logo} alt="ExpressDelivery Logo" width="120" height="120" />
                </a>
            </div>
            <h1>Envoyer un colis</h1>
            <p className="description">
                Choisissez comment vous souhaitez procéder pour envoyer votre colis
            </p>
            <div className="button-container">
                <a href="send-package.html" className="send-button guest" role="button">
                    <span className="icon" aria-hidden="true">📦</span>
                    <span>Envoyer sans compte</span>
                </a>
                <a href="login.html" className="send-button account" role="button">
                    <span className="icon" aria-hidden="true">👤</span>
                    <span>Utiliser mon compte</span>
                </a>
            </div>
        </div>
    );
};

export default RendreService;