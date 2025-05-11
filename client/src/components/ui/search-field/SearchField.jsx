import { useState } from "react";

export default function SearchField({
    setSearchParams,
    searchBy
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

    return (
        <div
            className="search-filter"
            data-testid="search-field-container"
        >
            <input
                type="text"
                className="search-input"
                placeholder={`Search by ${searchBy}...`}
                onChange={onValueChangeHandler}
                data-testid="search-field-input"
            />
        </div>
    )
}