import Button from "../../../ui/buttons/button/Button";
import ErrorIcon from "./error-icon/ErrorIcon";
import HeaderMessage from "./header-message/HeaderMessage";
import ParagraphMessage from "./paragraph-message/ParagraphMessage";

export default function ErrorMessage() {
    return <>
        <div className="error">
            <div className="error-container">
                <ErrorIcon />

                <HeaderMessage />

                <ParagraphMessage />

                <Button
                    onClickHandler={() => window.location.reload()}
                    buttonName="Reload"
                    btnStyle="button comment-btn"
                />
            </div>
        </div>
    </>
}