import './public/styles/styles.css';

import { useState } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router';

import LandingPage from './pages/LandingPage';
import UserHomePage from './pages/UserHomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';
import CatalogPage from './pages/CatalogPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import Logout from './pages/Logout';
import MenuBar from './components/MenuBar';

export default function App() {
    const [isUser, setIsUser] = useState(false);

    const location = useLocation();

    return <>
        {(isUser || (!isUser && location.pathname !== '/')) && (
            <MenuBar isUser={isUser} />
        )}

        <Routes>
            {/* State dependent pages */}
            <Route path='/' element={isUser ? <UserHomePage setIsUser={setIsUser} /> : <LandingPage />} />

            {/* User only pages */}
            <Route path='/settings' element={isUser ? <SettingsPage userId={isUser}/> : <Navigate to="/login" />} />
            <Route path='/logout' element={isUser ? <Logout setIsUser={setIsUser} /> : <Navigate to="/" />} />

            {/* Guest only pages */}
            <Route path='/login' element={!isUser ? <LoginPage setIsUser={setIsUser} /> : <Navigate to="/" />} />
            <Route path='/register' element={!isUser ? <RegisterPage setIsUser={setIsUser} /> : <Navigate to="/" />} />

            {/* Public pages */}
            <Route path='/profile/:userId' element={<ProfilePage isUser={isUser}/>} />
            <Route path='/catalog' element={<CatalogPage isUser={isUser}/>} />
            <Route path='/*' element={<NotFoundPage />} />
        </Routes>
    </>
}