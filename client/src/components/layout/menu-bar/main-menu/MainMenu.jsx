import { useContext } from "react";

import { UserContext } from "../../../../contexts/user-context";

import MenuLink from "../menu-link/MenuLink";

export default function MainMenu() {
    const { loggedInUserId } = useContext(UserContext);

    return (
        <ul className="menu">
            <MenuLink
                linkImageAlt="Home"
                linkImageUri="\images\home-icon.png"
                linkTitle="Home"
                linkUrl="/"
            />

            {loggedInUserId && (
                <MenuLink
                    linkImageAlt="Profile"
                    linkImageUri="\images\profile-icon.png"
                    linkTitle="Profile"
                    linkUrl={`/profile/${loggedInUserId}`}
                />
            )}

            <MenuLink
                linkImageAlt="Catalog"
                linkImageUri="\images\catalog-icon.png"
                linkTitle="Catalog"
                linkUrl="/catalog"
            />

            {/* {loggedInUserId && (
                <>
                    <MenuLink
                        linkImageAlt="Notifications"
                        linkImageUri="\images\notifications-icon.png"
                        linkTitle="Notifications"
                        linkUrl="/notifications"
                    />

                    <MenuLink
                        linkImageAlt="Messages"
                        linkImageUri="\images\messages-icon.png"
                        linkTitle="Messages"
                        linkUrl="/messages"
                    />
                </>
            )} */}
        </ul>
    );
};