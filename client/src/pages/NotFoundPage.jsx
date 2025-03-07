import { Link } from "react-router";
import MenuBar from "../components/MenuBar";

export default function NotFoundPage() {
    return <>
        <MenuBar />

        <div id="notfound">
            <div className="notfound">
                <div className="notfound-404">
                    <h1>4<span>0</span>4</h1>
                </div>
                <h2>the page you requested could not be found</h2>
                <button className="notfound-button"><Link to="/" className="notfound-link">Go home</Link></button>
            </div>
        </div>
    </>
}