import { useEffect, useRef, useState } from "react";
import { CameraOff } from "lucide-react";

function CameraFeed() {
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const [cameraError, setCameraError] = useState(false);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: 1280,
            height: 720,
          },
          audio: false,
        });

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        setCameraError(false);
      } catch (err) {
        console.error(err);
        setCameraError(true);
      }
    };

    startCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => {
          track.stop();
        });

        streamRef.current = null;
      }

      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }


    };
  }, []);

  if (cameraError) {
    return (
      <div className="h-80 rounded-2xl border border-red-500 bg-slate-900 flex flex-col items-center justify-center text-red-400">
        <CameraOff size={50} />
        <p className="mt-4 text-lg font-medium">
          Camera Access Denied
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="w-full h-80 rounded-2xl object-cover border border-slate-700"
      />

      <div className="absolute bottom-4 left-4 bg-green-600 text-white px-3 py-1 rounded-full">
        ● Live
      </div>
    </div>
  );
}

export default CameraFeed;