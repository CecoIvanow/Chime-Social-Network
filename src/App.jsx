import './static/styles/styles.css';

import { Routes, Route } from 'react-router';

import UserHomePage from './pages/UserHomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';
import CatalogPage from './pages/CatalogPage';

export default function App() {
    return <>
        {/* Guest/public pages */}
        <Routes>
            <Route path='/' element={<UserHomePage />} />
            <Route path='/login' element={<LoginPage />} />
            <Route path='/register' element={<RegisterPage />} />
            <Route path='/catalog' element={<CatalogPage />} />
            <Route path='/*' element={<NotFoundPage />} />
        </Routes>
    </>
}