import FeatureCard from "./feature-card/FeatureCard";

export default function FeaturesSection() {
    const featureCards = [
        { iconClass: "fas fa-user-friends", headingId: "profile-heading", title: "Personal Profiles", description: "Create your profile, share your story, and showcase your personality." },
        { iconClass: "fas fa-comments", headingId: "chat-heading", title: "Real-time Chat", description: "Stay in touch with instant messaging with friends and family." },
        { iconClass: "fas fa-users", headingId: "groups-heading", title: "Friends", description: "Get in touch with your friends that share your passions and hobbies, from travel to music and beyond." },
    ];

    return <>
        <section className="features-section" aria-labelledby="features-heading">
            <h2 id="features-heading" className="sr-only">Key Features</h2>
            <div className="features-container">

                {featureCards.map(feat => (
                    <FeatureCard
                        key={feat.headingId}
                        description={feat.description}
                        headingId={feat.headingId}
                        iconClass={feat.iconClass}
                        title={feat.title}
                    />
                ))}

            </div>
        </section>
    </>
}