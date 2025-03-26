import React, { useState } from 'react';
import './index.css';
import SignupValidation from './connexion/SignupValidation';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Form = ({ title, buttonText, isSignup, toggleForm, handleSubmit, setValues, values, errors }) => (
    <div className={`form-container ${isSignup ? 'login-container' : 'register-container'} active`}>
        <form action="#" onSubmit={handleSubmit}>
            <h1>{title}</h1>
            <input 
                type="text" 
                placeholder="Username" 
                required 
                onChange={(e) => setValues({ ...values, username: e.target.value })} 
            />
            <input 
                type="email" 
                placeholder="Email" 
                required 
                onChange={(e) => setValues({ ...values, email: e.target.value })} 
            />
            <input 
                type="password" 
                placeholder="Password" 
                required 
                onChange={(e) => setValues({ ...values, password: e.target.value })} 
            />
            {isSignup && (
                <input 
                    type="tel" 
                    placeholder="Phone Number" 
                    required 
                    onChange={(e) => setValues({ ...values, phone: e.target.value })} 
                />
            )}
            <button type="submit">{buttonText}</button>
            <span>Already have an account? <a href="/login" className="toggle" onClick={toggleForm}>{isSignup ? 'Login' : 'Signup'}</a></span>
            {errors.email && <p className="error">{errors.email}</p>}
            {errors.password && <p className="error">{errors.password}</p>}
            {isSignup && errors.phone && <p className="error">{errors.phone}</p>}
        </form>
    </div>
);

const Signup = () => {
    const navigate = useNavigate();
    const [isSignup, setIsSignup] = useState(true);
    const [values, setValues] = useState({ username: '', email: '', password: '', phone: '' });
    const [errors, setErrors] = useState({ email: '', password: '', phone: '' });

    const handleSubmit = (event) => {
        event.preventDefault();
        let emailError = '';
        let passwordError = '';
        let phoneError = '';

        if (!values.email) {
            emailError = 'L\'email ne doit pas être vide';
        } else if (!SignupValidation.validateEmail(values.email)) {
            emailError = 'Email incorrect';
        }

        if (!values.password) {
            passwordError = 'Le mot de passe ne doit pas être vide';
        } else if (!SignupValidation.validatePassword(values.password)) {
            passwordError = 'Mot de passe incorrect';
        }

        if (isSignup && !values.phone) {
            phoneError = 'Le numéro de téléphone ne doit pas être vide';
        } else if (isSignup && !SignupValidation.validatePhoneNumber(values.phone)) {
            phoneError = 'Numéro de téléphone incorrect';
        }

        setErrors({ email: emailError, password: passwordError, phone: phoneError });

        if (!emailError && !passwordError && !phoneError) {
            if (isSignup) {
                // Inscription
                axios.post('http://localhost:8081/signup', {
                    username: values.username,
                    email: values.email,
                    password: values.password,
                    phone: values.phone,
                })
                .then(response => {
                    // Rediriger vers la page de connexion après l'inscription
                    navigate('/login');
                })
                .catch(error => {
                    console.error("Erreur lors de l'inscription :", error);
                });
            } else {
                // Connexion
                axios.post('http://localhost:8081/login', {
                    email: values.email,
                    password: values.password,
                })
                .then(response => {
                    // Gérer la connexion réussie (par exemple, stocker le token, rediriger, etc.)
                    navigate('/'); // Rediriger vers la page d'accueil
                })
                .catch(error => {
                    console.error("Erreur lors de la connexion :", error);
                });
            }
        }
    };

    const toggleForm = () => {
        setIsSignup(!isSignup);
    };

    return (
        <div className="container">
            <Form 
                title={isSignup ? "Signup" : "Login"} 
                buttonText={isSignup ? "Signup" : "Login"} 
                isSignup={isSignup} 
                toggleForm={toggleForm} 
                handleSubmit={handleSubmit} 
                setValues={setValues} 
                values={values} 
                errors={errors} 
            />
        </div>
    );
};

export default Signup;
