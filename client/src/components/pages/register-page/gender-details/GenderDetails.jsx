export default function GenderDetails() {
    return <>
        <div className="gender-details">
            <input type="radio" value="Male" name="gender" id="dot-1" />
            <input type="radio" value="Female" name="gender" id="dot-2" />
            <span className="gender-title">Gender</span>
            <div className="category">
                <label htmlFor="dot-1">
                    <span className="dot one"></span>
                    <span className="gender">Male</span>
                </label>
                <label htmlFor="dot-2">
                    <span className="dot two"></span>
                    <span className="gender">Female</span>
                </label>
            </div>
        </div>
    </>
}