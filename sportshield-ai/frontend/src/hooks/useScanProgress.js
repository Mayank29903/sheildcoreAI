import { useState, useEffect, useRef } from 'react';
import { getScanStatus } from '../lib/api';

const WS_RETRY_DELAYS = [500, 1000, 2000];
const POLL_INTERVAL = 2000;

export function useScanProgress(scanId) {
    const [steps, setSteps] = useState({
        deepfake: 'running', audio_sync: 'running', exif: 'running',
        registry: 'running', watermark: 'running', gemini_vision: 'running'
    });
    const [stepData, setStepData] = useState({});
    const [isComplete, setIsComplete] = useState(false);
    const [connectionMode, setConnectionMode] = useState('idle');
    
    const wsRef = useRef(null);
    const retryCountRef = useRef(0);
    const pollIntervalRef = useRef(null);
    const isCompleteRef = useRef(isComplete);

    useEffect(() => {
        isCompleteRef.current = isComplete;
    }, [isComplete]);

    const handleStepUpdate = (msg) => {
        if (msg.step === 'complete') {
            setIsComplete(true);
        } else {
            setSteps(prev => ({ ...prev, [msg.step]: msg.status }));
            if (msg.data) setStepData(prev => ({ ...prev, [msg.step]: msg.data }));
        }
    };

    const startPolling = () => {
        setConnectionMode('polling');
        if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
        
        pollIntervalRef.current = setInterval(async () => {
            if (isCompleteRef.current) {
                clearInterval(pollIntervalRef.current);
                return;
            }
            try {
                const res = await getScanStatus(scanId);
                const data = res.data;
                if (data.status === 'complete') {
                    setIsComplete(true);
                    clearInterval(pollIntervalRef.current);
                }
                if (data.steps) {
                    const newSteps = { ...steps };
                    Object.keys(data.steps).forEach(k => {
                        if (data.steps[k] && data.steps[k].done) newSteps[k] = 'done';
                    });
                    setSteps(newSteps);
                }
            } catch (err) {
                console.error("Polling error", err);
            }
        }, POLL_INTERVAL);
    };

    const connectWebSocket = () => {
        if (isCompleteRef.current) return;
        
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
        const wsUrl = baseUrl.replace(/^http/, 'ws') + `/ws/scan/${scanId}`;
        
        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        let pingInterval;

        ws.onopen = () => {
            setConnectionMode('websocket');
            retryCountRef.current = 0;
            pingInterval = setInterval(() => {
                if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify({ type: 'ping' }));
            }, 20000);
        };

        ws.onmessage = (e) => {
            try {
                const msg = JSON.parse(e.data);
                handleStepUpdate(msg);
            } catch (err) {
                console.error("WS Parse error", err);
            }
        };

        ws.onclose = () => {
            if (pingInterval) clearInterval(pingInterval);
            if (isCompleteRef.current) return;
            
            setConnectionMode('reconnecting');
            if (retryCountRef.current < WS_RETRY_DELAYS.length) {
                setTimeout(connectWebSocket, WS_RETRY_DELAYS[retryCountRef.current]);
                retryCountRef.current += 1;
            } else {
                startPolling();
            }
        };
    };

    useEffect(() => {
        if (!scanId) return;
        
        setSteps({
            deepfake: 'running', audio_sync: 'running', exif: 'running',
            registry: 'running', watermark: 'running', gemini_vision: 'running'
        });
        setStepData({});
        setIsComplete(false);
        retryCountRef.current = 0;
        
        connectWebSocket();

        return () => {
            if (wsRef.current) wsRef.current.close();
            if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
        };
    }, [scanId]);

    return { steps, stepData, isComplete, connectionMode };
}
