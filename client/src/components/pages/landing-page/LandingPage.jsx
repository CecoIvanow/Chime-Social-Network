import FeaturesSection from "./features-section/FeaturesSection";
import HeroSection from "./hero-section/HeroSection";


export default function LandingPage() {
    return <>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />

        <div className="landing-container">
            <HeroSection />

            <FeaturesSection />
        </div>

    </>
}