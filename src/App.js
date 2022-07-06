import React, { useState, useEffect, useRef } from "react";
import "@tensorflow/tfjs";
import "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-converter";
import "@tensorflow/tfjs-backend-webgl";
import * as bodyPix from "@tensorflow-models/body-pix";
import Webcam from "react-webcam"

import { blurBackground } from './blur-background'
import { drawImage } from './virtual-background'

import './App.css';

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const [model, setModel] = useState();
  const [prevClassName, setPrevClassName] = useState();

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

  const runBlur = () => {
    if (Boolean(webcamRef) && Boolean(canvasRef) && Boolean(model)) {
      const webcam = webcamRef.current.video;
      const canvas = canvasRef.current;
      webcam.width = canvas.width = webcam.videoWidth;
      webcam.height = canvas.height = webcam.videoHeight;
      blurBackground(webcam, canvas, model, segmentConfig)
    }
  }

  const clickHandler = async (webcamRef, canvasRef, className) => {
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

  return (
    <div className="App">
      <header className="App-header">
        <Webcam
          ref={webcamRef}
          audio={false}
          style={{
            position: "absolute",
            margin: "0 auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zIndex: 9,
            height: 480,
            width: 640,
          }}
        />
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            margin: "0 auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zIndex: 9,
            height: 480,
            width: 640,
          }}
        />
      </header>
      <div style={{ bottom: 0 }} >
        <button onClick={() => runBlur()}>
          Blur
        </button>
        <button onClick={() => clickHandler(webcamRef, canvasRef, 'background')}>
          Background
        </button>
      </div>
    </div>
  );
}

export default App;
