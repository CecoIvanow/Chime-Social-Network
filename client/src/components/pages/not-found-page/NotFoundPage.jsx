import LinkButton from "../../ui/buttons/link-button/LinkButton";
import NotFoundMessage from "./not-found-message/NotFoundMessage";

export default function NotFoundPage() {
    return <>
        <div id="notfound">
            <div className="notfound">
                <NotFoundMessage/>

                <LinkButton
                    btnStyle="button"
                    urlLink={'/'}
                    buttonName="Home"
                />

            </div>
        </div>
    </>
}