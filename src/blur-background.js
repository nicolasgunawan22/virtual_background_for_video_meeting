import * as bodyPix from "@tensorflow-models/body-pix";

export const blurBackground = async (webcam, canvas, net, segmentConfig) => {
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