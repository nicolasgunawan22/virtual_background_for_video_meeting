import * as bodyPix from "@tensorflow-models/body-pix";

export const drawBlur = async (webcam, canvas, net, segmentConfig) => {
   (async function drawMask() {
      requestAnimationFrame(drawMask);
      if (Boolean(webcam) && Boolean(canvas) && webcam.readyState === 4) {
         const person = await net.segmentPerson(webcam, segmentConfig);
         const backgroundBlurAmount = 5;
         const edgeBlurAmount = 5;
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

export const drawImage = async (webcam, context, canvas, model) => {
   const tempCanvas = document.createElement("canvas");
   tempCanvas.width = webcam.videoWidth;
   tempCanvas.height = webcam.videoHeight;
   const tempCtx = tempCanvas.getContext("2d");

   (async function drawMask() {
      requestAnimationFrame(drawMask);
      const segmentation = await model.segmentPerson(webcam);
      const mask = bodyPix.toMask(segmentation);
      console.log(mask)
      tempCtx.putImageData(mask, 0, 0);
      context.drawImage(webcam, 0, 0, canvas.width, canvas.height);
      context.save();
      context.globalCompositeOperation = "destination-out";
      context.drawImage(tempCanvas, 0, 0, canvas.width, canvas.height);
      context.restore();
   })();
}