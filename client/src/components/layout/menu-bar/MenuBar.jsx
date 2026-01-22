import Logo from "./logo/Logo";
import MainMenu from "./main-menu/MainMenu";
import AuthMenu from "./auth-menu/AuthMenu";

export default function MenuBar() {

    return <>
        <nav>
            <div className="navbar">
                <Logo />
                
                <MainMenu />

                <AuthMenu />
            </div>
        </nav>
    </>
}