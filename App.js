import './App.css';
import Login from './connexion/login';
import Signup from './connexion/Signup';
import HomePage from './accueil/HomePage';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import RendreService from './RendreService';
import RequestService from './RequestService';

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/HomePage" element={ <HomePage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/rendre-service" element={<RendreService />} />
                <Route path="/request-service" element={<RequestService />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
