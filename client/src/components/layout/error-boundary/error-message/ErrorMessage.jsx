import Button from "../../../ui/buttons/button/Button";

export default function ErrorMessage() {
    return <>
        <div className="error">
            <div className="error-container">
                <div className="error-icon"></div>
                <h1 className="header-message">Oops, something went wrong.</h1>
                <p className="paragraph-message">Please reload the page.</p>

                <Button
                    onClickHandler={() => window.location.reload()}
                    buttonName="Reload"
                    btnStyle="button comment-btn"
                />
            </div>
        </div>
    </>
}