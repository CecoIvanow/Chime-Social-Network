import { Link } from "react-router";

export default function HeroSection() {
    return <>
        <section className="hero-section" aria-labelledby="main-heading">
            <div className="hero-content">
                <h1 className="hero-heading" id="main-heading">Stay Connected with Your Social Circle</h1>
                <p className="hero-subheading">Share moments, connect with friends, and discover new communities in a safe and welcoming environment.</p>
                <div className="cta-buttons">
                    <Link to="/register" className="cta-button primary-cta">Join Free Today</Link>
                    <Link to="/login" className="cta-button primary-cta">Log into your account</Link>
                    <Link to="/catalog" className="cta-button secondary-cta">Check public posts</Link>
                </div>
            </div>
        </section>
    </>
}