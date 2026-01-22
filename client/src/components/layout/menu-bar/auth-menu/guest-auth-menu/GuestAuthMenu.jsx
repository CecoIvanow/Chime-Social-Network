import MenuLink from "../../menu-link/MenuLink";

export default function GuestAuthMenu() {

    return (
        <div className="guest-auth-menu">
            <MenuLink
                linkText="Login"
                linkTitle="Login"
                linkUrl="/login"
            />

            <MenuLink
                linkText="Register"
                linkTitle="Register"
                linkUrl="/register"
            />
        </div>
    );
}