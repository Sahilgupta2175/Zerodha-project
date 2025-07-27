import React from 'react';
import Hero from './Hero';
import Award from './Award';
import Education from './Education';
import Pricing from './Pricing';
import Stats from './Stats';
import Navbar from '../Navbar';
import Footer from '../Footer';
import OpenAccount from '../OpenAccount';

function HomePage() {
    return (
        <>
            <Navbar />
            <Hero />
            <Award />
            <Stats />
            <Pricing />
            <Education />
            <OpenAccount />
            <Footer />
        </>
    );
}

export default HomePage;