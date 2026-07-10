import React, { useState, useEffect, useRef } from 'react';
import { X, Video, VideoOff, Mic, MicOff, PhoneOff, Sparkles, MonitorUp, Image as ImageIcon, Upload } from 'lucide-react';
import { cn } from '../../lib/utils';

// Add type for window.SelfieSegmentation
declare global {
    interface Window {
        SelfieSegmentation: any;
    }
}

export const VideoCallInterface: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
    const [selectedVideoId, setSelectedVideoId] = useState<string>('');
    const [selectedAudioId, setSelectedAudioId] = useState<string>('');
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const [backgroundMode, setBackgroundMode] = useState<'none' | 'blur' | 'office' | 'custom'>('none');
    const [customBgUrl, setCustomBgUrl] = useState<string | null>(null);
    
    const [isVideoEnabled, setIsVideoEnabled] = useState(true);
    const [isAudioEnabled, setIsAudioEnabled] = useState(true);
    const [isModelLoading, setIsModelLoading] = useState(false);

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const localStreamRef = useRef<MediaStream | null>(null);
    const segmentationRef = useRef<any>(null);
    const animationFrameRef = useRef<number>(0);
    const bgImageRef = useRef<HTMLImageElement | null>(null);
    
    // For keeping track of the current mode inside the render loop
    const stateRef = useRef({ backgroundMode: 'none', customBgUrl: null as string | null });
    useEffect(() => {
        stateRef.current = { backgroundMode, customBgUrl };
    }, [backgroundMode, customBgUrl]);

    const officeBgUrl = "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200";

    useEffect(() => {
        // Enumerate devices
        const getDevices = async () => {
            try {
                // Ask permission first to get labels
                await navigator.mediaDevices.getUserMedia({ audio: true, video: true }); 
                const allDevices = await navigator.mediaDevices.enumerateDevices();
                setDevices(allDevices);
                
                const videos = allDevices.filter(d => d.kind === 'videoinput');
                const audios = allDevices.filter(d => d.kind === 'audioinput');
                if (videos.length > 0) setSelectedVideoId(videos[0].deviceId);
                if (audios.length > 0) setSelectedAudioId(audios[0].deviceId);
            } catch (err) {
                console.error("Device access denied or unavailable", err);
            }
        };
        getDevices();

        // Preload office image
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = officeBgUrl;
        bgImageRef.current = img;

        return () => {
            stopStream();
            if (segmentationRef.current) {
                segmentationRef.current.close();
            }
            cancelAnimationFrame(animationFrameRef.current);
        };
    }, []);

    useEffect(() => {
        if (!selectedVideoId && !selectedAudioId && !isScreenSharing) return;
        startStream();
    }, [selectedVideoId, selectedAudioId, isVideoEnabled, isAudioEnabled, isScreenSharing]);

    // Handle Background Model Loading
    useEffect(() => {
        if (backgroundMode !== 'none' && !isScreenSharing && isVideoEnabled) {
            initSegmentation();
        } else {
            // If none, we still draw the video to canvas without segmentation to keep logic unified,
            // but we don't strictly need the model.
        }
    }, [backgroundMode, isScreenSharing, isVideoEnabled]);

    const initSegmentation = async () => {
        if (segmentationRef.current || isModelLoading) return;
        setIsModelLoading(true);
        
        try {
            // Load scripts dynamically
            if (!window.SelfieSegmentation) {
                await new Promise<void>((resolve, reject) => {
                    const script = document.createElement('script');
                    script.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/selfie_segmentation.js';
                    script.crossOrigin = 'anonymous';
                    script.onload = () => resolve();
                    script.onerror = reject;
                    document.head.appendChild(script);
                });
            }

            const selfieSegmentation = new window.SelfieSegmentation({
                locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`
            });

            selfieSegmentation.setOptions({
                modelSelection: 1, // 1 for general/landscape (faster), 0 for close-up
            });

            selfieSegmentation.onResults(onResults);
            segmentationRef.current = selfieSegmentation;
            
        } catch (e) {
            console.error("Failed to load MediaPipe", e);
        } finally {
            setIsModelLoading(false);
        }
    };

    const processVideo = async () => {
        if (!videoRef.current || videoRef.current.videoWidth === 0) {
            animationFrameRef.current = requestAnimationFrame(processVideo);
            return;
        }

        const mode = stateRef.current.backgroundMode;
        
        if (mode === 'none' || isScreenSharing) {
            // Just draw video directly
            if (canvasRef.current && videoRef.current) {
                const ctx = canvasRef.current.getContext('2d');
                if (ctx) {
                    canvasRef.current.width = videoRef.current.videoWidth;
                    canvasRef.current.height = videoRef.current.videoHeight;
                    ctx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
                }
            }
            animationFrameRef.current = requestAnimationFrame(processVideo);
        } else if (segmentationRef.current) {
            await segmentationRef.current.send({ image: videoRef.current });
            animationFrameRef.current = requestAnimationFrame(processVideo);
        } else {
            animationFrameRef.current = requestAnimationFrame(processVideo);
        }
    };

    const onResults = (results: any) => {
        if (!canvasRef.current || !videoRef.current) return;
        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return;

        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;

        ctx.save();
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

        // Draw the mask
        ctx.drawImage(results.segmentationMask, 0, 0, canvasRef.current.width, canvasRef.current.height);

        // Only overwrite existing pixels (the person)
        ctx.globalCompositeOperation = 'source-in';
        ctx.drawImage(results.image, 0, 0, canvasRef.current.width, canvasRef.current.height);

        // Only overwrite missing pixels (the background)
        ctx.globalCompositeOperation = 'destination-atop';

        const mode = stateRef.current.backgroundMode;
        if (mode === 'blur') {
            ctx.filter = 'blur(15px)';
            ctx.drawImage(results.image, 0, 0, canvasRef.current.width, canvasRef.current.height);
            ctx.filter = 'none';
        } else if (mode === 'office' && bgImageRef.current) {
            ctx.drawImage(bgImageRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
        } else if (mode === 'custom' && stateRef.current.customBgUrl) {
            const customImg = new Image();
            customImg.src = stateRef.current.customBgUrl;
            // Note: drawing a newly created image every frame might flicker if not loaded,
            // but customBgUrl is already a data URL or fully loaded blob here.
            ctx.drawImage(customImg, 0, 0, canvasRef.current.width, canvasRef.current.height);
        } else {
            // fallback
            ctx.drawImage(results.image, 0, 0, canvasRef.current.width, canvasRef.current.height);
        }

        ctx.restore();
    };

    const stopStream = () => {
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(track => track.stop());
            localStreamRef.current = null;
        }
    };

    const startStream = async () => {
        stopStream();
        try {
            let stream: MediaStream;
            if (isScreenSharing) {
                stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
                stream.getVideoTracks()[0].onended = () => setIsScreenSharing(false);
            } else {
                const constraints: MediaStreamConstraints = {};
                if (isVideoEnabled && selectedVideoId) {
                    constraints.video = { deviceId: { exact: selectedVideoId } };
                } else {
                    constraints.video = false;
                }
                
                if (isAudioEnabled && selectedAudioId) {
                    constraints.audio = { deviceId: { exact: selectedAudioId } };
                } else {
                    constraints.audio = false;
                }

                if (!constraints.video && !constraints.audio) return;
                stream = await navigator.mediaDevices.getUserMedia(constraints);
            }
            
            localStreamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play().catch(e => console.error("Video play failed:", e));
                videoRef.current.onloadeddata = () => {
                    cancelAnimationFrame(animationFrameRef.current);
                    processVideo();
                };
            }
        } catch (err) {
            console.error("Error starting stream", err);
            setIsScreenSharing(false);
        }
    };

    const toggleScreenShare = () => {
        setIsScreenSharing(!isScreenSharing);
    };

    const handleCustomBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setCustomBgUrl(url);
            setBackgroundMode('custom');
        }
    };

    return (
        <div className="fixed inset-0 z-[1000] bg-black/95 flex flex-col items-center justify-center p-4 sm:p-10 animate-in fade-in duration-300">
            <button onClick={onClose} className="absolute top-6 right-6 text-white hover:text-[#ec028b] transition-colors">
                <X className="w-8 h-8" />
            </button>

            <div className="w-full max-w-6xl bg-gray-900 border border-gray-800 rounded-2xl shadow-[0_0_50px_rgba(236,2,139,0.1)] overflow-hidden flex flex-col md:flex-row h-[85vh] md:h-auto md:aspect-[21/9]">
                
                {/* Video Area */}
                <div className="flex-1 bg-black relative flex items-center justify-center overflow-hidden h-full">
                    {/* Hidden actual video element, we draw to canvas */}
                    <video 
                        ref={videoRef} 
                        autoPlay 
                        playsInline 
                        muted 
                        className="opacity-0 absolute pointer-events-none w-1 h-1 z-[-1]"
                    />
                    
                    {isVideoEnabled || isScreenSharing ? (
                        <>
                            <canvas 
                                ref={canvasRef}
                                className="w-full h-full object-cover relative z-10"
                            />
                            {isModelLoading && (
                                <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                                    <div className="flex flex-col items-center">
                                        <Sparkles className="w-8 h-8 text-[#ec028b] animate-spin mb-2" />
                                        <span className="text-white text-xs font-bold uppercase tracking-widest">Loading AI Background...</span>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="flex flex-col items-center text-gray-500 z-10">
                            <VideoOff className="w-16 h-16 mb-4 opacity-50" />
                            <p className="tracking-widest uppercase text-sm font-bold">Camera Disabled</p>
                        </div>
                    )}

                    {/* Status Badge */}
                    <div className="absolute top-4 left-4 z-20 flex gap-2">
                        {isScreenSharing && <span className="bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded shadow-lg flex items-center"><MonitorUp className="w-3 h-3 mr-1" /> Screen Sharing</span>}
                        {!isAudioEnabled && <span className="bg-red-600 text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded shadow-lg flex items-center"><MicOff className="w-3 h-3 mr-1" /> Muted</span>}
                    </div>
                </div>

                {/* Sidebar Controls */}
                <div className="w-full md:w-80 bg-gray-900 border-t md:border-t-0 md:border-l border-gray-800 p-6 flex flex-col shrink-0">
                    <h3 className="text-white font-black uppercase tracking-widest mb-6 border-b border-gray-800 pb-4">Meeting Settings</h3>
                    
                    <div className="space-y-6 flex-1 overflow-y-auto custom-scrollbar pr-2">
                        {/* Audio Selection */}
                        <div className="space-y-2">
                            <label className="text-xs text-gray-400 font-bold uppercase tracking-widest">Microphone</label>
                            <select 
                                value={selectedAudioId}
                                onChange={e => setSelectedAudioId(e.target.value)}
                                className="w-full bg-black border border-gray-700 text-white text-sm rounded-lg p-2.5 outline-none focus:border-[#ec028b]"
                                disabled={isScreenSharing}
                            >
                                {devices.filter(d => d.kind === 'audioinput').map(d => (
                                    <option key={d.deviceId} value={d.deviceId}>{d.label || 'Microphone'}</option>
                                ))}
                                {devices.filter(d => d.kind === 'audioinput').length === 0 && <option value="">No microphone found</option>}
                            </select>
                        </div>

                        {/* Camera Selection */}
                        <div className="space-y-2">
                            <label className="text-xs text-gray-400 font-bold uppercase tracking-widest">Camera</label>
                            <select 
                                value={selectedVideoId}
                                onChange={e => setSelectedVideoId(e.target.value)}
                                className="w-full bg-black border border-gray-700 text-white text-sm rounded-lg p-2.5 outline-none focus:border-[#ec028b]"
                                disabled={isScreenSharing}
                            >
                                {devices.filter(d => d.kind === 'videoinput').map(d => (
                                    <option key={d.deviceId} value={d.deviceId}>{d.label || 'Camera'}</option>
                                ))}
                                {devices.filter(d => d.kind === 'videoinput').length === 0 && <option value="">No camera found</option>}
                            </select>
                        </div>

                        {/* Background Selection */}
                        <div className="space-y-2 pt-4 border-t border-gray-800">
                            <label className="text-xs text-gray-400 font-bold uppercase tracking-widest flex items-center gap-2">
                                <ImageIcon className="w-4 h-4 text-[#ec028b]" />
                                Virtual Background
                            </label>
                            <div className="grid grid-cols-2 gap-2 mt-2">
                                <button onClick={() => setBackgroundMode('none')} className={cn("p-2 rounded border text-xs font-bold uppercase transition-colors", backgroundMode === 'none' ? "bg-[#ec028b]/20 border-[#ec028b] text-white" : "bg-black border-gray-700 text-gray-400 hover:border-gray-500")} disabled={isScreenSharing}>None</button>
                                <button onClick={() => setBackgroundMode('blur')} className={cn("p-2 rounded border text-xs font-bold uppercase transition-colors", backgroundMode === 'blur' ? "bg-[#ec028b]/20 border-[#ec028b] text-white" : "bg-black border-gray-700 text-gray-400 hover:border-gray-500")} disabled={isScreenSharing}>Blur</button>
                                <button onClick={() => setBackgroundMode('office')} className={cn("p-2 rounded border text-xs font-bold uppercase transition-colors", backgroundMode === 'office' ? "bg-[#ec028b]/20 border-[#ec028b] text-white" : "bg-black border-gray-700 text-gray-400 hover:border-gray-500")} disabled={isScreenSharing}>Modern Office</button>
                                
                                <label className={cn("p-2 rounded border text-xs font-bold uppercase transition-colors cursor-pointer flex items-center justify-center gap-1", backgroundMode === 'custom' ? "bg-[#ec028b]/20 border-[#ec028b] text-white" : "bg-black border-gray-700 text-gray-400 hover:border-gray-500", isScreenSharing ? "opacity-50 cursor-not-allowed" : "")}>
                                    <Upload className="w-3 h-3" />
                                    Upload
                                    <input type="file" accept="image/*" className="hidden" disabled={isScreenSharing} onChange={handleCustomBgUpload} />
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Action Bar */}
                    <div className="pt-6 border-t border-gray-800 grid grid-cols-4 gap-2 mt-4">
                        <button onClick={() => setIsAudioEnabled(!isAudioEnabled)} className={cn("flex flex-col items-center justify-center p-3 rounded-xl transition-colors", isAudioEnabled ? "bg-gray-800 hover:bg-gray-700 text-white" : "bg-red-500/20 text-red-500 hover:bg-red-500/30")}>
                            {isAudioEnabled ? <Mic className="w-5 h-5 mb-1" /> : <MicOff className="w-5 h-5 mb-1" />}
                            <span className="text-[8px] sm:text-[9px] font-bold uppercase">{isAudioEnabled ? 'Mute' : 'Unmute'}</span>
                        </button>
                        <button onClick={() => setIsVideoEnabled(!isVideoEnabled)} className={cn("flex flex-col items-center justify-center p-3 rounded-xl transition-colors", isVideoEnabled ? "bg-gray-800 hover:bg-gray-700 text-white" : "bg-red-500/20 text-red-500 hover:bg-red-500/30")} disabled={isScreenSharing}>
                            {isVideoEnabled ? <Video className="w-5 h-5 mb-1" /> : <VideoOff className="w-5 h-5 mb-1" />}
                            <span className="text-[8px] sm:text-[9px] font-bold uppercase">{isVideoEnabled ? 'Stop' : 'Start'}</span>
                        </button>
                        <button onClick={toggleScreenShare} className={cn("flex flex-col items-center justify-center p-3 rounded-xl transition-colors", isScreenSharing ? "bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.5)]" : "bg-gray-800 hover:bg-gray-700 text-white")}>
                            <MonitorUp className="w-5 h-5 mb-1" />
                            <span className="text-[8px] sm:text-[9px] font-bold uppercase">{isScreenSharing ? 'Stop' : 'Share'}</span>
                        </button>
                        <button onClick={onClose} className="flex flex-col items-center justify-center p-3 rounded-xl bg-red-600 hover:bg-red-700 text-white transition-colors shadow-[0_0_15px_rgba(220,38,38,0.5)]">
                            <PhoneOff className="w-5 h-5 mb-1" />
                            <span className="text-[8px] sm:text-[9px] font-bold uppercase">End</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
