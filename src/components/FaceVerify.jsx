import { useState, useRef, useEffect } from 'react';

function FaceVerify({ onVerified }) {
  const [result, setResult] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    if (cameraActive && videoRef.current?.srcObject) {
      videoRef.current.play().catch((err) => {
        console.error('video再生エラー:', err);
      });
    }
  }, [cameraActive]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraActive(true);

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch((err) => {
            console.error('video再生エラー:', err);
          });
        }
      }, 100);
    } catch (err) {
      console.error('カメラ起動エラー:', err);
    }
  };

  const stopCamera = () => {
    if (!videoRef.current) return;
    const stream = videoRef.current.srcObject;
    if (stream) {
      stream.getTracks().forEach(track => {
        track.stop();
      });
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  const handleCapture = async () => {
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext('2d').drawImage(videoRef.current, 0, 0);

    canvas.toBlob(async (blob) => {
      const formData = new FormData();
      formData.append('file', blob, 'capture.jpg');

      try {
        const res = await fetch('http://localhost:8000/verify-face', {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        setResult(data);

        if (data.match) {
          onVerified(data);
        } else {
          alert("顔認証に失敗しました。打刻できません。");
        }

        stopCamera(); // ✅ 認証後にカメラ停止

      } catch (err) {
        console.error('認証エラー:', err);
        stopCamera(); // エラー時もカメラ停止
      }
    }, 'image/jpeg');
  };

  return (
    <div className="mb-4">
      {!cameraActive ? (
        <button
          onClick={startCamera}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded mb-2"
        >
          カメラを起動
        </button>
      ) : (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{ width: '100%', maxHeight: '300px', backgroundColor: '#000', borderRadius: '8px' }}
          />
            <button
            onClick={handleCapture}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded"
          >
            撮影して認証
          </button>
        </>
      )}
      {result && (
        <div className="mt-2 text-sm text-gray-700">
          <p>ステータス: {result.status}</p>
          <p>一致: {result.match ? '✅ 一致' : '❌ 不一致'}</p>
          <p>信頼度: {result.confidence}</p>
        </div>
      )}
    </div>
  );
}

export default FaceVerify;
