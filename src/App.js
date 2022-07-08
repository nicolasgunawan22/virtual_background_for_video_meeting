import React, { useState, useEffect, useRef } from "react";

import "@tensorflow/tfjs";
import "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-converter";
import "@tensorflow/tfjs-backend-webgl";
import * as bodyPix from "@tensorflow-models/body-pix";

import Webcam from "react-webcam"
import useMediaRecorder from '@wmik/use-media-recorder';

import { drawBlur, drawImage, drawScreenShared } from './background'
import Preview from './preview';
import './App.css';

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const videoPreviewRef = useRef(null);
  const imageRef = useRef(null)
  const imageInputRef = useRef(null)

  const [model, setModel] = useState();
  const [isLoading, setLoading] = useState(false);

  let {
    error,
    status,
    getMediaStream,
    liveStream
  } = useMediaRecorder({
    recordScreen: true,
    blobOptions: { type: 'video/webm' },
    mediaStreamConstraints: { audio: false, video: { width: 640, height: 480 } }
  });

  useEffect(() => {
    const bodyPixConfig = {
      architecture: 'MobileNetV1',
      outputStride: 16,
      multiplier: 0.5,
      quantBytes: 2,
    }


    const loadModel = async () => {
      const net = await bodyPix.load(bodyPixConfig)
      setModel(net)
    }
    loadModel()
  }, [])

  const segmentConfig = {
    maxDetections: 5,
    scoreThreshold: 0.3,
    nmsRadius: 20,
    flipHorizontal: true,
    internalResolution: 'medium',
    segmentationThreshold: 0.75,
  }

  const handleBlurBackground = () => {
    if (Boolean(webcamRef) && Boolean(canvasRef) && Boolean(model)) {

      const webcam = webcamRef.current.video;
      const canvas = canvasRef.current;
      webcam.width = canvas.width = webcam.videoWidth;
      webcam.height = canvas.height = webcam.videoHeight;
      drawBlur(webcam, canvas, model, segmentConfig, setLoading)
    }
  }


  const handleImageBackground = (webcamRef, canvasRef, imageRef) => {
    if (Boolean(webcamRef) && Boolean(canvasRef) && Boolean(imageRef) && Boolean(model)) {
      drawImage(webcamRef, canvasRef, imageRef, model, segmentConfig, setLoading);
    }
  };

  const handleScreenSharedBackground = () => {
    if (Boolean(webcamRef) && Boolean(canvasRef) && Boolean(videoPreviewRef) && Boolean(model)) {
      const webcam = webcamRef.current.video;
      const canvas = canvasRef.current;
      webcam.width = canvas.width = webcam.videoWidth;
      webcam.height = canvas.height = webcam.videoHeight;
      drawScreenShared(webcam, canvas, videoPreviewRef, model, segmentConfig, setLoading)
    }
  }

  const handleChangeImage = (e) => {
    const file = imageInputRef.current.files[0]
    const reader = new FileReader();
    reader.addEventListener("load", function () {
      imageRef.current.src = reader.result;
    }, false);

    if (file) {
      reader.readAsDataURL(file);
    }
  }

  const handleClearEffect = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    window.location.reload()
  }

  return (
    <div className="App">
      <div
        style={{
          position: 'relative',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Webcam
          ref={webcamRef}
          audio={false}
          height={480}
          width={640}
          style={{
            zIndex: 9,
            height: 480,
            width: '100%',
            margin: '32px auto'
          }}
        />
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            margin: "32px auto",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 9,
            height: 480,
            width: 640,
          }}
        />
        {isLoading && (
          <h3
            style={{
              position: 'absolute',
              zIndex: 10,
            }}
          >
            Loading...
          </h3>
        )}
      </div>

      <div
        style={{
          width: 'min(640px, 100%)',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'flex-start',
          gap: 30,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <h2 style={{ marginBottom: 0 }}>Effects</h2>
          <button
            className="custom-button"
            onClick={() => {
              setLoading(true);
              handleBlurBackground();
            }}
          >
            Blur
          </button>
          <button
            className="custom-button"
            onClick={() => {
              setLoading(true);
              handleImageBackground(webcamRef, canvasRef, imageRef, 'background')
            }}
          >
            Image Background
          </button>
          <button
            className="custom-button"
            onClick={() => {
              setLoading(true);
              handleScreenSharedBackground();
            }}
          >
            Screen Shared Background
          </button>
          <button
            className="custom-button"
            onClick={() => {
              setLoading(true);
              handleClearEffect();
            }}
          >
            Clear Effect
          </button>

          <h2 style={{ marginBottom: 0 }}>Background Preview</h2>
          <div
            className="image-preview"
            onClick={() => imageInputRef.current.click()}
          >
            <img
              ref={imageRef}
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=869&q=80"
              alt="background_preview"
              style={{
                width: 240,
                height: 180,
                filter: 'brightness(0.85)',
              }}
            />
            <h5 className="click-preview">Click to Change</h5>
            <input
              ref={imageInputRef}
              type="file"
              onChange={(e) => handleChangeImage(e)}
              style={{ display: 'none' }}
            />
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 10,
            width: '100%',
          }}
        >
          <h2 style={{ marginBottom: 0 }}>Screen Sharing</h2>
          <p style={{ margin: 0 }}><b>Status</b>: {error ? `${status.replace('_', ' ')} ${error.message}` : status}</p>
          <button
            className="custom-button"
            type="button"
            onClick={getMediaStream}
            disabled={status === 'ready'}
          >
            Share screen
          </button>
          <Preview stream={liveStream} videoPreviewRef={videoPreviewRef} />
        </div>
      </div>
    </div>
  );
}

export default App;
