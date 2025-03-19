export default function FeatureCard({
    iconClass, headingId, title, description
}) {
    return (
        <article className="feature-card" aria-labelledby={headingId}>
            <div className="feature-icon" aria-hidden="true">
                <i className={iconClass}></i>
            </div>
            <h3 id={headingId} className="feature-title">{title}</h3>
            <p className="feature-description">{description}</p>
        </article>
    );
}