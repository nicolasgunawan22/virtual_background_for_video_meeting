import React, { useState, useEffect, useRef } from "react";

import "@tensorflow/tfjs";
import "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-converter";
import "@tensorflow/tfjs-backend-webgl";
import '@mediapipe/selfie_segmentation';
import * as bodyPix from "@tensorflow-models/body-pix";
import * as bodySegmentation from "@tensorflow-models/body-segmentation"

import Webcam from "react-webcam"
import useMediaRecorder from '@wmik/use-media-recorder';

import { drawBlur, drawImage, drawScreenShared } from './background'
import Preview from './preview';
import './App.css';

import '@mediapipe/pose';
import '@tensorflow/tfjs-backend-wasm';

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const videoPreviewRef = useRef();


  const [model, setModel] = useState();
  const [prevClassName, setPrevClassName] = useState();
  const [audio, setAudio] = useState(false);

  let {
    error,
    status,
    stopRecording,
    getMediaStream,
    startRecording,
    liveStream
  } = useMediaRecorder({
    recordScreen: true,
    blobOptions: { type: 'video/webm' },
    mediaStreamConstraints: { audio: false, video: { width: 640, height: 480 } }
  });

  console.log({ videoPreviewRef })

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
    segmentationThreshold: 0.7,
  }

  const handleBlurBackground = () => {
    if (Boolean(webcamRef) && Boolean(canvasRef) && Boolean(model)) {
      const webcam = webcamRef.current.video;
      const canvas = canvasRef.current;
      webcam.width = canvas.width = webcam.videoWidth;
      webcam.height = canvas.height = webcam.videoHeight;
      drawBlur(webcam, canvas, model, segmentConfig)
    }
  }

  const handleImageBackground = async (webcamRef, canvasRef, className) => {
    setPrevClassName(className);
    drawImage(webcamRef, canvasRef, model, segmentConfig, className, prevClassName);
  };

  const handleScreenSharedBackground = async () => {
    if (Boolean(webcamRef) && Boolean(canvasRef) && Boolean(model)) {
      const webcam = webcamRef.current.video;
      const canvas = canvasRef.current;
      webcam.width = canvas.width = webcam.videoWidth;
      webcam.height = canvas.height = webcam.videoHeight;
      drawScreenShared(webcam, canvas, videoPreviewRef, model, segmentConfig)
    }
  }

  return (
    <div className="App">
      <Webcam
        ref={webcamRef}
        audio={false}
        style={{
          position: "absolute",
          margin: "32px auto",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 9,
          height: 480,
          width: 640,
        }}
      />
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          margin: "32px auto",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 9,
          height: 480,
          width: 640,
        }}
      />

      <div
        style={{
          position: 'absolute',
          bottom: 0,
          marginBottom: "48px",
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <div
          style={{
            textAlign: 'center'
          }}
        >
          <h2>Effects</h2>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <button onClick={() => handleBlurBackground()}>
              Blur
            </button>
            <button onClick={() => handleImageBackground(webcamRef, canvasRef, 'background')}>
              Image Background
            </button>
            <button onClick={() => handleScreenSharedBackground()}>
              Screen Shared Background
            </button>
          </div>
        </div>

        <article
          style={{
            textAlign: 'center'
          }}
        >
          <h2>Screen Sharing</h2>
          <p><b>Status</b>: {error ? `${status} ${error.message}` : status}</p>
          {/* <label>
            Enable microphone
            <input
              type="checkbox"
              checked={audio}
              onChange={() => setAudio((prevState) => !prevState)}
            />
          </label> */}
          <section>
            <button
              type="button"
              onClick={getMediaStream}
              disabled={status === 'ready'}
            >
              Share screen
            </button>
            {/* <button
              type="button"
              onClick={startRecording}
              disabled={status === 'recording'}
            >
              Start recording
            </button>
            <button
              type="button"
              onClick={stopRecording}
              disabled={status !== 'recording'}
            >
              Stop recording
            </button> */}
          </section>
          <Preview stream={liveStream} videoPreviewRef={videoPreviewRef} />
        </article>
      </div>
    </div >
  );
}

export default App;
