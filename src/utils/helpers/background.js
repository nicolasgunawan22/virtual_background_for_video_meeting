import * as bodyPix from "@tensorflow-models/body-pix";

let requestId = 0;
export const drawBlur = async (webcam, canvas, net, segmentConfig, setLoading, isOn, setEffects) => {
   if (isOn) {
      console.log({ requestId })
      cancelAnimationFrame(requestId);
      setEffects({ blur: false, image: false, screen: false })
      setLoading(false);
      requestId = 0;
   } else {
      async function drawMask() {
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
            setLoading(false);
         }
         requestId = requestAnimationFrame(drawMask);
         console.log({ requestId })
      };
      requestId = requestAnimationFrame(drawMask);
      setEffects({ blur: true, image: false, screen: false })
   }
}

export const drawImage = async (webcamRef, canvasRef, imageRef, model, segmentConfig, setLoading, isOn, setEffects) => {
   const webcam = webcamRef.current.video;
   const canvas = canvasRef.current;
   const image = imageRef.current;

   webcam.width = canvas.width = webcam.videoWidth;
   webcam.height = canvas.height = webcam.videoHeight;
   const context = canvas.getContext("2d");
   context.clearRect(0, 0, canvas.width, canvas.height);

   if (model) {
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = webcam.videoWidth;
      tempCanvas.height = webcam.videoHeight;
      const tempCtx = tempCanvas.getContext("2d");

      async function drawMask() {
         const segmentation = await model.segmentPerson(webcam, segmentConfig);
         const mask = bodyPix.toMask(segmentation);
         context.drawImage(image, 0, 0, canvas.width, canvas.height);
         tempCtx.putImageData(mask, 0, 0);
         context.save();
         context.globalCompositeOperation = "destination-in";
         context.drawImage(tempCanvas, 0, 0, canvas.width, canvas.height);
         context.restore();
         setLoading(false)
         requestAnimationFrame(drawMask);
      };
      requestAnimationFrame(drawMask);
   }
}

export const drawScreenShared = async (webcam, canvas, videoPreviewRef, net, segmentConfig, setLoading, isOn, setEffects) => {
   if (webcam && canvas && videoPreviewRef && net) {
      const videoPreview = videoPreviewRef.current
      const ctx = canvas.getContext("2d");

      const tempCanvas = document.createElement("canvas");
      const tempCtx = tempCanvas.getContext("2d");
      tempCanvas.height = webcam.height;
      tempCanvas.width = webcam.width;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      (async function drawMask() {
         const person = await net.segmentPerson(webcam, segmentConfig);
         const mask = bodyPix.toMask(person);

         ctx.drawImage(videoPreview, 0, 0, videoPreview.videoWidth, videoPreview.videoHeight)
         ctx.save();
         tempCtx.putImageData(mask, 0, 0);
         ctx.globalCompositeOperation = "destination-in";
         ctx.drawImage(tempCanvas, 0, 0, webcam.width, webcam.height);
         ctx.restore();
         setLoading(false)

         requestAnimationFrame(drawMask);
      })();
   }
}