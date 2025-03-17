import '../styles/styles.css'

import { useState } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router';

import MenuBar from './components/layout/menu-bar/MenuBar.jsx';
import LandingPage from './components/pages/landing-page/LandingPage.jsx';
import UserHomePage from './components/pages/user-home-page/UserHomePage.jsx';
import LoginPage from './components/pages/login-page/LoginPage.jsx';
import RegisterPage from './components/pages/register-page/RegisterPage.jsx';
import NotFoundPage from './components/pages/not-found-page/NotFoundPage.jsx';
import CatalogPage from './components/pages/catalog-page/CatalogPage.jsx';
import SettingsPage from './components/pages/settings-page/SettingsPage.jsx';
import ProfilePage from './components/pages/profile-page/ProfilePage.jsx';
import Logout from './components/pages/logout/Logout.jsx';
import PostDetailsPage from './components/pages/post-details-page/PostDetailsPage.jsx';
import PostEditPage from './components/pages/post-edit-page/PostEditPage.jsx';

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
            <Route path='/post/:postId/edit' element={isUser ? <PostEditPage userId={isUser} /> : <Navigate to="/login" />} />
            <Route path='/settings' element={isUser ? <SettingsPage userId={isUser} /> : <Navigate to="/login" />} />
            <Route path='/logout' element={isUser ? <Logout setIsUser={setIsUser} /> : <Navigate to="/" />} />

            {/* Guest only pages */}
            <Route path='/register' element={!isUser ? <RegisterPage setIsUser={setIsUser} /> : <Navigate to="/" />} />
            <Route path='/login' element={!isUser ? <LoginPage setIsUser={setIsUser} /> : <Navigate to="/" />} />

            {/* Public pages */}
            <Route path='/post/:postId/details' element={<PostDetailsPage isUser={isUser} />} />
            <Route path='/profile/:userId' element={<ProfilePage isUser={isUser} />} />
            <Route path='/catalog' element={<CatalogPage isUser={isUser} />} />
            <Route path='/*' element={<NotFoundPage />} />
        </Routes>
    </>
}