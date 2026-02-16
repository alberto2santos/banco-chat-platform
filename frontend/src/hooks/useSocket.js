import { useEffect, useRef } from 'react';
import socketService from '../services/socket';

export const useSocket = (evento, callback) => {
    const callbackRef = useRef(callback);

    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    useEffect(() => {
        const handler = (...args) => callbackRef.current(...args);
        
        if (socketService.socket) {
            socketService.socket.on(evento, handler);
        }

        return () => {
            if (socketService.socket) {
                socketService.socket.off(evento, handler);
            }
        };
    }, [evento]);
};