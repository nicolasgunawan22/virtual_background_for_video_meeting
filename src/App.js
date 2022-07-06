import React, { useState, useEffect, useRef } from "react";
import "@tensorflow/tfjs";
import "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-converter";
import "@tensorflow/tfjs-backend-webgl";
import * as bodyPix from "@tensorflow-models/body-pix";
import Webcam from "react-webcam"
import { drawBlur, drawImage } from './background'
import useMediaRecorder from '@wmik/use-media-recorder';
import './App.css';

function Player({ srcBlob, audio }) {
  console.log({ srcBlob, audio })
  if (!srcBlob) {
    return null;
  }

  if (audio) {
    return <audio src={URL.createObjectURL(srcBlob)} controls />;
  }

  return (
    <video
      src={URL.createObjectURL(srcBlob)}
      width={520}
      height={480}
      controls
    />
  );
}

function LiveStreamPreview({ stream }) {
  let videoPreviewRef = React.useRef();

  React.useEffect(() => {
    if (videoPreviewRef.current && stream) {
      videoPreviewRef.current.srcObject = stream;
    }
  }, [stream]);

  if (!stream) {
    return null;
  }

  return <video ref={videoPreviewRef} width={520} height={480} autoPlay />;
}


function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const [model, setModel] = useState();
  const [prevClassName, setPrevClassName] = useState();
  const [audio, setAudio] = useState(false);

  useEffect(() => {
    const bodyPixConfig = {
      architecture: 'MobileNetV1',
      outputStride: 16,
      multiplier: 0.75,
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
    const webcam = webcamRef.current.video;
    const canvas = canvasRef.current;
    webcam.width = canvas.width = webcam.videoWidth;
    webcam.height = canvas.height = webcam.videoHeight;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    if (prevClassName) {
      canvas.classList.remove(prevClassName);
      setPrevClassName(className);
    } else {
      setPrevClassName(className);
    }
    canvas.classList.add(className);
    if (model) {
      drawImage(webcam, context, canvas, model);
    }
  };

  let {
    error,
    status,
    mediaBlob,
    stopRecording,
    getMediaStream,
    startRecording,
    liveStream
  } = useMediaRecorder({
    recordScreen: true,
    blobOptions: { type: 'video/webm' },
    mediaStreamConstraints: { audio, video: true }
  });


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

      <div style={{
        position: 'absolute',
        bottom: 0,
        marginBottom: "64px",
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        gap: 10
      }}>
        <button onClick={() => handleBlurBackground()}>
          Blur
        </button>
        <button onClick={() => handleImageBackground(webcamRef, canvasRef, 'background')}>
          Background
        </button>
      </div>
      {/* <article>
        <h1>Screen recorder</h1>
        {error ? `${status} ${error.message}` : status}
        <label>
          Enable microphone
          <input
            type="checkbox"
            checked={audio}
            onChange={() => setAudio((prevState) => !prevState)}
          />
        </label>
        <section>
          <button
            type="button"
            onClick={getMediaStream}
            disabled={status === 'ready'}
          >
            Share screen
          </button>
          <button
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
          </button>
        </section>
        <Player srcBlob={mediaBlob} />
        <LiveStreamPreview stream={liveStream} />
      </article> */}
    </div >
  );
}

export default App;
