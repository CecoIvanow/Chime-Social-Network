import MenuLink from "../../menu-link/MenuLink";

export default function UserAuthMenu() {
    
    return (
        <div className="user-auth-menu">
            <MenuLink
                linkImageAlt="Settings"
                linkImageUri="\images\settings-icon.png"
                linkTitle="Settings"
                linkUrl="/settings"
            />

            <MenuLink
                linkImageAlt="Logout"
                linkImageUri="\images\logout-icon.png"
                linkTitle="Logout"
                linkUrl="/logout"
            />
        </div>
    );
}