import { useCallback, useContext, useMemo, useState } from 'react';

import { AlertContext } from '../contexts/alert-context.js';

import api from '../utils/api.js';

export default function useFetchApiCall() {
    const requestsMap = useMemo(() => new Map(), []);
    const controllersMap = useMemo(() => new Map(), []);

    const [loadingState, setLoadingState] = useState(false);

    const { setAlert } = useContext(AlertContext);

    const keyCreator = (url, method) => `${method}:${url}`;

    const abortFetchRequest = useCallback((url, method) => {
        const controllerKey = keyCreator(url, method);
        const controller = controllersMap.get(controllerKey);

        if (controller) {
            controller.abort();
            controllersMap.delete(controllerKey);
            requestsMap.delete(controllerKey);
        }
    }, [controllersMap, requestsMap]);

    const fetchExecute = useCallback(async (url, method = 'GET', payload) => {
        const convertedMethod = method.toUpperCase();

        const requestKey = keyCreator(url, method);
        requestsMap.set(requestKey, true);

        const abortController = new AbortController();
        const signal = abortController.signal;
        controllersMap.set(requestKey, abortController);

        setLoadingState(true);

        try {
            let resp = null;

            switch (convertedMethod) {
                case 'GET':
                    resp = await api.get(url, { signal });
                    break;
                case 'POST':
                    resp = await api.post(url, payload, { signal });
                    break;
                case 'PUT':
                    resp = await api.put(url, payload, { signal });
                    break;
                case 'PATCH':
                    resp = await api.patch(url, payload, { signal });
                    break;
                case 'DELETE':
                    resp = await api.delete(url, { signal });
                    break;
            }

            if (resp?.error) {
                throw new Error(resp.error);
            } else if (resp?.data) {
                return resp.data;
            }

            return;

        } catch (error) {
            if (error.message === 'Failed to fetch') {
                console.error(error);
                setAlert('Failed to fetch, please try again!');
            } else if (error.name !== 'AbortError') {
                console.error(error);
                setAlert(error.message);
            }
        } finally {
            requestsMap.delete(requestKey);
            controllersMap.delete(requestKey);
            setLoadingState(false);
        }
    }, [setAlert, requestsMap, controllersMap]);

    return {
        isLoading: loadingState,
        fetchExecute,
        abortFetchRequest,
    }
}