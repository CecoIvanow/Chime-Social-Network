import { useState } from "react";

export default function usePersistedState(initialState) {
    const [state, setState] = useState(() => {
        const persistedState = localStorage.getItem('user');

        if (!persistedState) {
            return initialState;
        }

        const persistedStateData = JSON.parse(persistedState);

        return persistedStateData;
    })

    const setPersistedState = (data) => {
        if (!data) {
            localStorage.removeItem('user');
        } else {
            const persistedData = JSON.stringify(data);
            localStorage.setItem('user', persistedData);
        }

        setState(data);
    }

    return [
        state,
        setPersistedState,
    ]
}