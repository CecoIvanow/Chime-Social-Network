import GenderLabel from "./gender-label/GenderLabel"

export default function GenderLabelsList() {
    const genderLabels = [
        { id: "dot-1", value: "Male", genderClassName: "one" },
        { id: "dot-2", value: "Female", genderClassName: "two" },
    ]

    return (
        <div className="category">
            {genderLabels.map(label =>
                <GenderLabel
                    key={label.id}
                    label={label}
                />
            )}
        </div>
    )
}