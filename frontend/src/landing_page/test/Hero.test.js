import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Hero from "../home/Hero";

// Test Suite
describe("Hero Component", () => {
	test('renders hero image', () => {
        render(
            <MemoryRouter>
                <Hero />
            </MemoryRouter>
        );
        const heroImage = screen.getByAltText("Hero Image");
        expect(heroImage).toBeInTheDocument();
        expect(heroImage).toHaveAttribute('src', 'Images\\homeHero.png');
    })
})
