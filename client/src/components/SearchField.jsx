import { useState } from "react";

export default function SearchField({
    setSearchParams
}) {

    const [curTimeOutId, setCurTimeOutId] = useState(null);

    async function onValueChangeHandler(e) {
        const value = e.target.value;

        if (curTimeOutId) {
            clearTimeout(curTimeOutId);
        }

        const newTimeOutId = setTimeout(() => {
            setSearchParams(value);
        }, 1250);

        setCurTimeOutId(newTimeOutId);
    }

    return <>
        <div className="search-filter">
            <input type="text" className="search-input" placeholder="Search..." onChange={onValueChangeHandler}/>
        </div>
    </>
}