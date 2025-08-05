import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from './landing_page/home/HomePage.jsx';
import SignupPage from './landing_page/signup/SignUp.jsx';
import AboutPage from './landing_page/about/AboutPage.jsx';
import ProductPage from './landing_page/product/ProductPage.jsx';
import PricingPage from './landing_page/pricing/PricingPage.jsx';
import SupportPage from './landing_page/support/SupportPage.jsx';
import Navbar from './landing_page/Navbar.jsx';
import Footer from './landing_page/Footer.jsx';
import NotFound from './landing_page/NotFound.jsx';
import 'react-toastify/ReactToastify.css';
import LoginPage from './landing_page/login/login.jsx';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path='/' element={<HomePage />}></Route>
                <Route path='/signup' element={<SignupPage />}></Route>
                <Route path='/login' element={<LoginPage />}></Route>
                <Route path='/about' element={<AboutPage />}></Route>
                <Route path='/product' element={<ProductPage />}></Route>
                <Route path='/pricing' element={<PricingPage />}></Route>
                <Route path='/support' element={<SupportPage />}></Route>
                <Route path='*' element={<NotFound />}></Route>
            </Routes>
            <Footer />
        </BrowserRouter>
    </StrictMode>,
)
