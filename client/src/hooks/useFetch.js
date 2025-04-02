import { useCallback, useContext, useEffect, useRef, useState } from 'react';

import { AlertContext } from '../contexts/alert-context.js';

import api from '../utils/api';

export default function useFetch() {
    const [loadingState, setLoadingState] = useState(false);
    const isLoadingRef = useRef(false);

    const { setAlert } = useContext(AlertContext);

    const abortControllerRef = useRef(null);

    useEffect(() => {
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        }
    }, [])

    const fetchExecute = useCallback(async (url, method = 'GET', payload) => {
        const convertedMethod = method.toUpperCase();

        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        abortControllerRef.current = new AbortController();

        setLoadingState(loadingState => {
            if (loadingState === false) {
                isLoadingRef.current = true;
                return true;
            }

            return loadingState;
        });

        try {
            let resp = null;

            switch (convertedMethod) {
                case 'GET':
                    resp = await api.get(url, { signal: abortControllerRef.current.signal });
                    break;
                case 'POST':
                    resp = await api.post(url, payload, { signal: abortControllerRef.current.signal });
                    break;
                case 'PATCH':
                    resp = await api.patch(url, payload, { signal: abortControllerRef.current.signal });
                    break;
                case 'DELETE':
                    resp = await api.delete(url, { signal: abortControllerRef.current.signal });
                    break;
            }

            if (resp?.error) {
                throw new Error(resp.error);
            } else if (resp?.data) {
                return resp.data;
            }

            return;

        } catch (error) {
            if (error.name !== 'AbortError') {
                console.error(error);
                setAlert(error.message);
            }
        } finally {
            setLoadingState(loadingState => {
                if (loadingState === true) {
                    isLoadingRef.current = false;
                    return false;
                }

                return loadingState;
            });
        }
    }, [setAlert]);

    return {
        isLoading: loadingState,
        fetchExecute,
        isLoadingRef,
    }
}