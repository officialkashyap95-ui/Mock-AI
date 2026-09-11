import {
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";

import socket from "../services/socket";

const useMicrophone = () => {
    const streamRef = useRef(null);
    const audioContextRef = useRef(null);
    const sourceRef = useRef(null);
    const processorRef = useRef(null);

    const [isMicOn, setIsMicOn] = useState(false);
    const [micError, setMicError] = useState(null);

    const startMicrophone = useCallback(async () => {
        console.log("🎤 startMicrophone() called");

        if (streamRef.current) {
            console.log(
                "⚠️ Microphone already running"
            );

            return;
        }

        try {
            setMicError(null);

            if (!socket.connected) {
                console.error(
                    "❌ Cannot start microphone: Socket.IO is not connected"
                );

                setMicError(
                    "Socket connection is not ready."
                );

                return;
            }

            console.log(
                "🎤 Requesting microphone permission..."
            );

            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    channelCount: 1,
                    sampleRate: 16000,
                    sampleSize: 16,

                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: false,
                },
                video: false,
            });

            console.log(
                "✅ Microphone permission granted"
            );

            streamRef.current = stream;

            const audioContext = new AudioContext({
                sampleRate: 16000,
            });
            console.log(
                "🎵 Browser AudioContext sample rate:",
                audioContext.sampleRate
            );

            audioContextRef.current = audioContext;

            if (
                audioContext.state === "suspended"
            ) {
                await audioContext.resume();
            }

            console.log(
                "🔊 AudioContext:",
                audioContext.state
            );

            const source =
                audioContext.createMediaStreamSource(
                    stream
                );

            sourceRef.current = source;

            const processor =
                audioContext.createScriptProcessor(
                    4096,
                    1,
                    1
                );

            processorRef.current =
                processor;

            processor.onaudioprocess = (
                event
            ) => {
                if (!socket.connected) {
                    return;
                }

                const inputData = event.inputBuffer.getChannelData(0);

                const pcmData = new Int16Array(inputData.length);

                for (let i = 0; i < inputData.length; i++) {
                    const sample = Math.max(-1, Math.min(1, inputData[i]));

                    pcmData[i] =
                        sample < 0
                            ? sample * 0x8000
                            : sample * 0x7fff;
                }

                socket.emit("microphone-audio", pcmData.buffer);
            };

            source.connect(processor);

            processor.connect(
                audioContext.destination
            );

            setIsMicOn(true);

            console.log(
                "🎤 Microphone streaming started"
            );
        } catch (error) {
            console.error(
                "❌ Microphone error:",
                error
            );

            setMicError(
                error?.message ||
                "Unable to access microphone"
            );

            setIsMicOn(false);
        }
    }, []);

    const stopMicrophone =
        useCallback(() => {
            console.log(
                "🛑 Stopping microphone..."
            );

            if (processorRef.current) {
                processorRef.current.onaudioprocess =
                    null;

                processorRef.current.disconnect();

                processorRef.current = null;
            }

            if (sourceRef.current) {
                sourceRef.current.disconnect();

                sourceRef.current = null;
            }

            if (audioContextRef.current) {
                audioContextRef.current
                    .close()
                    .catch(() => { });

                audioContextRef.current = null;
            }

            if (streamRef.current) {
                streamRef.current
                    .getTracks()
                    .forEach((track) => {
                        track.stop();
                    });

                streamRef.current = null;
            }

            setIsMicOn(false);

            console.log(
                "🎤 Microphone stopped"
            );
        }, []);

    // =====================================================
    // CLEANUP
    // =====================================================

    useEffect(() => {
        return () => {
            console.log(
                "🧹 useMicrophone cleanup"
            );

            if (processorRef.current) {
                processorRef.current.onaudioprocess =
                    null;

                processorRef.current.disconnect();

                processorRef.current = null;
            }

            if (sourceRef.current) {
                sourceRef.current.disconnect();

                sourceRef.current = null;
            }

            if (audioContextRef.current) {
                audioContextRef.current
                    .close()
                    .catch(() => { });

                audioContextRef.current = null;
            }

            if (streamRef.current) {
                streamRef.current
                    .getTracks()
                    .forEach((track) => {
                        track.stop();
                    });

                streamRef.current = null;
            }
        };
    }, []);

    return {
        startMicrophone,
        stopMicrophone,
        isMicOn,
        micError,
    };
};

export default useMicrophone;