import '../styles/styles.css'

import { useState } from 'react';
import {
    Routes,
    Route,
    useLocation,
    Navigate
} from 'react-router';

import { AlertContext } from './contexts/alert-context.js';
import { UserContext } from './contexts/user-context.js';

import usePersistedState from './hooks/usePersistedState.js';

import AuthGuard from './routes/auth-guard/AuthGuard';

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
import ProfileEditPage from './components/pages/profile-edit-page/ProfileEditPage.jsx';
import PostEditRedirect from './components/pages/post-edit-redirect/PostEditRedirect.jsx';
import AlertNotification from './components/ui/alert-notification/AlertNotification.jsx';
import ErrorBoundary from './components/layout/error-boundary/ErrorBoundary.jsx';

export default function App() {
    const [loggedInUserId, setLoggedInUserId] = usePersistedState(false);
    const [alert, setAlert] = useState(false);

    const location = useLocation();

    const alertContextValues = {
        alert,
        setAlert
    }

    const userContextValues = {
        loggedInUserId,
        setLoggedInUserId
    }

    return (
        <ErrorBoundary>
            <AlertContext.Provider value={alertContextValues}>
                <UserContext.Provider value={userContextValues}>

                    {(loggedInUserId || (!loggedInUserId && location.pathname !== '/')) && (
                        <MenuBar />
                    )}

                    {alert && (
                        <AlertNotification />
                    )}

                    <Routes>
                        <Route path='/' element={loggedInUserId ? <UserHomePage /> : <LandingPage />} />

                        <Route element={<AuthGuard />}>
                            <Route path='/profile/:profileId/edit' element={<ProfileEditPage />} />
                            <Route path='/post/:postId/edit' element={<PostEditRedirect />} />
                            <Route path='/settings' element={<SettingsPage />} />
                            <Route path='/logout' element={<Logout />} />
                        </Route>

                        <Route path='/register' element={!loggedInUserId ? <RegisterPage /> : <Navigate to="/" />} />
                        <Route path='/login' element={!loggedInUserId ? <LoginPage /> : <Navigate to="/" />} />

                        <Route path='/post/:postId/details' element={<PostDetailsPage />} />
                        <Route path='/profile/:profileId' element={<ProfilePage />} />
                        <Route path='/catalog' element={<CatalogPage />} />
                        <Route path='/*' element={<NotFoundPage />} />
                    </Routes>
                </UserContext.Provider>
            </AlertContext.Provider>
        </ErrorBoundary>
    )
}