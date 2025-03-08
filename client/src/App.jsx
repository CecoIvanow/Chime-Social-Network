import './static/styles/styles.css';

import { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router';

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
        {(location.pathname !== '/' && !isUser) && (
            <MenuBar isUser={isUser} />
        )}

        <Routes>
            {/* User only pages */}
            {isUser && (
                <>
                    <Route path='/' element={<UserHomePage />} />
                    <Route path='/settings' element={<SettingsPage />} />
                    <Route path='/profile' element={<ProfilePage />} />
                </>
            )}

            {/* Guest only pages */}
            {!isUser && (
                <>
                    <Route path='/' element={<LandingPage />} />
                    <Route path='/login' element={<LoginPage setIsUser={setIsUser} />} />
                    <Route path='/register' element={<RegisterPage setIsUser={setIsUser} />} />
                </>
            )}

            {/* Public pages */}
            <Route path='/catalog' element={<CatalogPage />} />
            <Route path='/*' element={<NotFoundPage />} />
        </Routes>
    </>
}