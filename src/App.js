import React, { useRef } from "react";
import "@tensorflow/tfjs";
import * as bodyPix from "@tensorflow-models/body-pix";
import Webcam from "react-webcam"

import './App.css';

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const videoRef = useRef(null);

  const bodyPixConfig = {
    architecture: 'MobileNetV1',
    outputStride: 16,
    multiplier: 0.75,
    quantBytes: 2,
  }

  const segmentConfig = {
    maxDetections: 5,
    scoreThreshold: 0.3,
    nmsRadius: 20,
    flipHorizontal: true,
    internalResolution: 'medium',
    segmentationThreshold: 0.7,
  }

  const runBlur = async () => {
    const net = await bodyPix.load(bodyPixConfig);
    console.log(videoRef)
    setInterval(() => {
      blurBackground(net)
    }, 10)
  }

  const blurBackground = async (net) => {
    if (typeof webcamRef.current !== "undefined" && webcamRef.current !== null && webcamRef.current.video.readyState === 4) {
      const video = webcamRef.current.video;
      const videoHeight = video.videoHeight;
      const videoWidth = video.videoWidth;
      console.log(video)

      webcamRef.current.video.height = videoHeight
      webcamRef.current.video.width = videoWidth

      canvasRef.current.height = videoHeight
      canvasRef.current.width = videoWidth

      const person = await net.segmentPerson(video, segmentConfig);

      const backgroundBlurAmount = 5;
      const edgeBlurAmount = 5;
      const flipHorizontal = false;

      bodyPix.drawBokehEffect(
        canvasRef.current,
        video,
        person,
        backgroundBlurAmount,
        edgeBlurAmount,
        flipHorizontal
      );
    }
  }

  runBlur();

  // const runBlur2 = async () => {
  //   const constraints = { video: true, audio: false };
  //   try {
  //     let stream = await navigator.mediaDevices.getUserMedia(constraints);
  //     videoRef.current.srcObject = stream;
  //     videoRef.current.onloadedmetadata = async () => {
  //       videoRef.current.play();
  //       const net = await bodyPix.load(bodyPixConfig);
  //       setInterval(() => {
  //         blurBackground2(net)
  //       }, 0)
  //     };
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }

  // const blurBackground2 = async (net) => {
  //   if (typeof videoRef.current !== "undefined" && videoRef.current !== null) {
  //     const segmentation = await net.segmentPerson(videoRef.current, segmentConfig);
  //     const backgroundBlurAmount = 3;
  //     const edgeBlurAmount = 3;
  //     const flipHorizontal = false;
  //     bodyPix.drawBokehEffect(
  //       canvasRef.current,
  //       videoRef.current,
  //       segmentation,
  //       backgroundBlurAmount,
  //       edgeBlurAmount,
  //       flipHorizontal
  //     );
  //   }
  // }

  // runBlur2();

  return (
    <div className="App">
      <header className="App-header">
        <Webcam
          ref={webcamRef}
          audio={false}
          height={480}
          width={640}
          style={{
            position: "absolute",
            margin: "0 auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zIndex: 9,
            width: 640,
            height: 480,
          }}
        />
        {/* <video
          ref={videoRef}
          height={480}
          width={640}
          style={{
            position: "absolute",
            margin: "0 auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zIndex: 9,
            width: 640,
            height: 480,
          }}
        /> */}
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            margin: "0 auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zIndex: 9,
            width: 640,
            height: 480,
          }}
        />
      </header>
    </div>
  );
}

export default App;
