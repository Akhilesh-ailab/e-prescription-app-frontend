import { useState, useRef, useCallback, useEffect } from 'react';

export function useVoiceRecorder() {
    const [isRecording, setIsRecording] = useState(false);
    const [volume, setVolume] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const monitorIntervalRef = useRef<number | null>(null);

    const stopListening = useCallback(() => {
        if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach(track => track.stop());
            mediaStreamRef.current = null;
        }
        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
            audioContextRef.current.close();
            audioContextRef.current = null;
        }
        if (monitorIntervalRef.current) {
            clearInterval(monitorIntervalRef.current);
            monitorIntervalRef.current = null;
        }
        setIsRecording(false);
        setVolume(0);
    }, []);

    const startListening = useCallback(async () => {
        setError(null);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaStreamRef.current = stream;

            const audioContext = new AudioContext();
            audioContextRef.current = audioContext;
            const analyser = audioContext.createAnalyser();
            const microphone = audioContext.createMediaStreamSource(stream);
            microphone.connect(analyser);

            analyser.fftSize = 256;
            const dataArray = new Uint8Array(analyser.frequencyBinCount);

            setIsRecording(true);

            let lastSoundTime = Date.now();

            const checkAudioLevel = () => {
                analyser.getByteFrequencyData(dataArray);
                const avg = dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length;
                setVolume(Math.min(100, Math.round((avg / 128) * 100)));

                if (avg > 10) {
                    lastSoundTime = Date.now();
                }

                if (Date.now() - lastSoundTime > 10000) {
                    console.log("Auto-cutoff: 10 seconds of silence detected.");
                    stopListening();
                }
            };

            monitorIntervalRef.current = window.setInterval(checkAudioLevel, 100);

        } catch (err) {
            console.error("Microphone access denied or not found.", err);
            setError('Microphone access denied. Please allow microphone access in your browser settings and try again.');
        }
    }, [stopListening]);

    useEffect(() => {
        return () => stopListening();
    }, [stopListening]);

    const dismissError = useCallback(() => setError(null), []);

    return { isRecording, startListening, stopListening, volume, error, dismissError };
}