import './static/styles/styles.css';

import { Routes, Route } from 'react-router';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
    return <>
        {/* Guest/public pages */}
        <Routes>
            <Route path='/' element={<LandingPage />} />
            <Route path='/login' element={<LoginPage />} />
            <Route path='/register' element={<RegisterPage />} />
            <Route path='/*' element={<NotFoundPage />} />
        </Routes>
    </>
}