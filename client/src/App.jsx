import './static/styles/styles.css';

import { useEffect, useState } from 'react';
import { Routes, Route, useLocation, useNavigate, Navigate } from 'react-router';

import LandingPage from './pages/LandingPage';
import UserHomePage from './pages/UserHomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';
import CatalogPage from './pages/CatalogPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import MenuBar from './components/MenuBar';

export default function App() {
    const [isUser, setIsUser] = useState(null);

    const location = useLocation();

    return <>
        {(isUser || (!isUser && location.pathname !== '/')) && (
            <MenuBar isUser={isUser} />
        )}

        <Routes>
            {/* User only pages */}
            <Route path='/' element={isUser ? <UserHomePage /> : <LandingPage />} />
            <Route path='/settings' element={isUser ? <SettingsPage /> : <Navigate to="/login" />} />
            <Route path='/profile' element={isUser ? <ProfilePage /> : <Navigate to="/login" />} />

            {/* Guest only pages */}
            <Route path='/login' element={!isUser ? <LoginPage setIsUser={setIsUser} /> : <Navigate to="/" />} />
            <Route path='/register' element={!isUser ? <RegisterPage setIsUser={setIsUser} /> : <Navigate to="/" />} />

            {/* Public pages */}
            <Route path='/catalog' element={<CatalogPage />} />
            <Route path='/*' element={<NotFoundPage />} />
        </Routes>
    </>
}