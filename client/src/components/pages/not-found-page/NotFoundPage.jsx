import LinkButton from "../../ui/buttons/link-button/LinkButton";

export default function NotFoundPage() {
    return <>
        <div id="notfound">
            <div className="notfound">
                <div className="notfound-404">
                    <h1>4<span>0</span>4</h1>
                </div>
                <h2>the page you requested could not be found</h2>

                <LinkButton
                    btnStyle="button"
                    urlLink={'/'}
                    buttonName="Home"
                />

            </div>
        </div>
    </>
}