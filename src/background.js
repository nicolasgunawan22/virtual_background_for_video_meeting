import * as bodyPix from "@tensorflow-models/body-pix";

export const drawBlur = async (webcam, canvas, net, segmentConfig) => {
   (async function drawMask() {
      requestAnimationFrame(drawMask);
      if (Boolean(webcam) && Boolean(canvas) && webcam.readyState === 4) {
         const person = await net.segmentPerson(webcam, segmentConfig);
         const backgroundBlurAmount = 8;
         const edgeBlurAmount = 8;
         const flipHorizontal = false;

         bodyPix.drawBokehEffect(
            canvas,
            webcam,
            person,
            backgroundBlurAmount,
            edgeBlurAmount,
            flipHorizontal
         );
      }
   })();
}

export const drawImage = async (webcamRef, canvasRef, model, segmentConfig, className, prevClassName) => {
   const webcam = webcamRef.current.video;
   const canvas = canvasRef.current;
   webcam.width = canvas.width = webcam.videoWidth;
   webcam.height = canvas.height = webcam.videoHeight;
   const context = canvas.getContext("2d");
   context.clearRect(0, 0, canvas.width, canvas.height);
   if (prevClassName) {
      canvas.classList.remove(prevClassName);
   }
   canvas.classList.add(className);
   if (model) {
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = webcam.videoWidth;
      tempCanvas.height = webcam.videoHeight;
      const tempCtx = tempCanvas.getContext("2d");

      (async function drawMask() {
         requestAnimationFrame(drawMask);
         const segmentation = await model.segmentPerson(webcam, segmentConfig);
         const mask = bodyPix.toMask(segmentation);
         tempCtx.putImageData(mask, 0, 0);
         context.drawImage(webcam, 0, 0, canvas.width, canvas.height);
         context.save();
         context.globalCompositeOperation = "destination-out";
         context.drawImage(tempCanvas, 0, 0, canvas.width, canvas.height);
         context.restore();
      })();
   }
}

export const drawScreenShared = async (webcam, canvas, videoPreviewRef, net, segmentConfig) => {
   const videoPreview = videoPreviewRef.current

   const ctx = canvas.getContext("2d");

   const tempCanvas = document.createElement("canvas");
   const tempCtx = tempCanvas.getContext("2d");
   tempCanvas.height = webcam.videoHeight;
   tempCanvas.width = webcam.videoWidth;
   canvas.classList.add('background');
   (function step() {
      // ctx.drawImage(videoPreview, 0, 0, canvas.width, canvas.height)
      // requestAnimationFrame(step)
   })();

   (async function drawMask() {
      requestAnimationFrame(drawMask);
      const person = await net.segmentPerson(webcam, segmentConfig);
      const mask = bodyPix.toMask(person);
      tempCtx.putImageData(mask, 0, 0);
      ctx.drawImage(webcam, 0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.globalCompositeOperation = "destination-out";
      ctx.drawImage(tempCanvas, 0, 0, canvas.width, canvas.height);
      ctx.restore();
   })();
}