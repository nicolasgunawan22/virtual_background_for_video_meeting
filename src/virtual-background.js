import * as bodyPix from "@tensorflow-models/body-pix";

export const drawImage = async (webcam, context, canvas, model) => {
   const tempCanvas = document.createElement("canvas");
   tempCanvas.width = webcam.videoWidth;
   tempCanvas.height = webcam.videoHeight;
   const tempCtx = tempCanvas.getContext("2d");

   (async function drawMask() {
      requestAnimationFrame(drawMask);
      const segmentation = await model.segmentPerson(webcam);
      const mask = bodyPix.toMask(segmentation);
      tempCtx.putImageData(mask, 0, 0);
      context.drawImage(webcam, 0, 0, canvas.width, canvas.height);
      context.save();
      context.globalCompositeOperation = "destination-out";
      context.drawImage(tempCanvas, 0, 0, canvas.width, canvas.height);
      context.restore();
   })();
}