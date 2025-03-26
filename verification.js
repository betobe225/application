// Gestion du flux de vérification
const verificationFlow = {
    // État initial
    currentStep: 0,
    
    // Définition des étapes
    steps: [
        'email-verification.html',
        'phone-verification.html',
        'documents-verification.html',
        'final-verification.html'
    ],

    // Fonction pour passer à l'étape suivante
    nextStep() {
        if (this.currentStep < this.steps.length - 1) {
            this.currentStep++;
            window.location.href = this.steps[this.currentStep];
        }
    },

    // Fonction pour revenir à l'étape précédente
    previousStep() {
        if (this.currentStep > 0) {
            this.currentStep--;
            window.location.href = this.steps[this.currentStep];
        }
    },

    // Vérifier si toutes les étapes sont complétées
    isComplete() {
        return this.currentStep === this.steps.length - 1;
    }
};

// Stockage de la progression dans sessionStorage
function saveProgress() {
    sessionStorage.setItem('verificationStep', verificationFlow.currentStep);
}

// Restauration de la progression
function loadProgress() {
    const savedStep = sessionStorage.getItem('verificationStep');
    if (savedStep !== null) {
        verificationFlow.currentStep = parseInt(savedStep);
    }
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    loadProgress();
    
    // Gestion des boutons de navigation
    const nextButton = document.querySelector('.next-step');
    const prevButton = document.querySelector('.previous-step');
    
    if (nextButton) {
        nextButton.addEventListener('click', () => {
            verificationFlow.nextStep();
            saveProgress();
        });
    }
    
    if (prevButton) {
        prevButton.addEventListener('click', () => {
            verificationFlow.previousStep();
            saveProgress();
        });
    }
}); 