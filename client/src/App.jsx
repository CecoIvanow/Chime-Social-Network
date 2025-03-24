import '../styles/styles.css'

import {
    Routes,
    Route,
    useLocation,
    Navigate
} from 'react-router';
import { useState } from 'react';

import { UserContext } from './contexts/user-context.js';

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

export default function App() {
    const [isUser, setIsUser] = useState(false);

    const location = useLocation();

    return (
        <UserContext.Provider value={{ isUser, setIsUser }}>

            {(isUser || (!isUser && location.pathname !== '/')) && (
                <MenuBar />
            )}

            <Routes>
                {/* State dependent pages */}
                <Route path='/' element={isUser ? <UserHomePage /> : <LandingPage />} />

                {/* User only pages */}
                <Route path='/post/:postId/edit' element={isUser ? <PostDetailsPage shouldEdit={true} /> : <Navigate to="/login" />} />
                <Route path='/settings' element={isUser ? <SettingsPage /> : <Navigate to="/login" />} />
                <Route path='/logout' element={isUser ? <Logout /> : <Navigate to="/" />} />

                {/* Guest only pages */}
                <Route path='/register' element={!isUser ? <RegisterPage /> : <Navigate to="/" />} />
                <Route path='/login' element={!isUser ? <LoginPage /> : <Navigate to="/" />} />

                {/* Public pages */}
                <Route path='/post/:postId/details' element={<PostDetailsPage />} />
                <Route path='/profile/:userId' element={<ProfilePage />} />
                <Route path='/catalog' element={<CatalogPage />} />
                <Route path='/*' element={<NotFoundPage />} />
            </Routes>
        </UserContext.Provider>
    )
}