import React, { useState } from 'react';
import './index.css';
import Validation from './loginValidation';

const Form = ({ isLogin, toggleForm, handleSubmit, setValues, values }) => (
    <div className={`form-container ${isLogin ? 'login-container' : 'register-container'} active`}>
        <form action="#" onSubmit={handleSubmit}>
            <h1>{isLogin ? 'Login' : 'Register'}</h1>
            {isLogin ? (
                <>
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
                    <button type="submit">Login</button>
                </>
            ) : (
                <>
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
                    <button type="submit">Register</button>
                </>
            )}
            <span>
                {isLogin ? "Don't have an account? " : 'Already have an account? '}
                <a href="/signup" className="toggle" onClick={toggleForm}>
                    {isLogin ? 'Register' : 'Login'}
                </a>
            </span>
        </form>
    </div>
);

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [values, setValues] = useState({ email: '', password: '', username: '' });
    const [errors, setErrors] = useState({ email: '', password: '', username: '' });

    const handleSubmit = (event) => {
        event.preventDefault();
        let emailError = '';
        let passwordError = '';
        let usernameError = '';

        // Validation de l'email
        if (!values.email) {
            emailError = 'L\'email ne doit pas être vide';
        } else if (!Validation.validateEmail(values.email)) {
            emailError = 'Email incorrect';
        }

        // Validation du mot de passe
        if (!values.password) {
            passwordError = 'Le mot de passe ne doit pas être vide';
        } else if (!Validation.validatePassword(values.password)) {
            passwordError = 'Mot de passe incorrect';
        }

        // Validation du nom d'utilisateur (pour l'enregistrement)
        if (!isLogin && !values.username) {
            usernameError = 'Le nom d\'utilisateur ne doit pas être vide';
        }

        setErrors({ email: emailError, password: passwordError, username: usernameError });

        if (!emailError && !passwordError && (!isLogin && !usernameError)) {
            // Logique de soumission ici
        }
    };

    const toggleForm = () => {
        setIsLogin(!isLogin);
    };

    return (
        <div className="container">
            <Form 
                isLogin={isLogin} 
                toggleForm={toggleForm} 
                handleSubmit={handleSubmit} 
                setValues={setValues} 
                values={values} 
            />
            {errors.email && <p className="error">{errors.email}</p>}
            {errors.password && <p className="error">{errors.password}</p>}
            {errors.username && <p className="error">{errors.username}</p>}
        </div>
    );
};

export default Login;
