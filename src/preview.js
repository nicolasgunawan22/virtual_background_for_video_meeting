import React, { useEffect } from 'react'

function Preview({ stream, videoPreviewRef }) {

   useEffect(() => {
      if (videoPreviewRef.current && stream) {
         videoPreviewRef.current.srcObject = stream;
      }
   }, [stream, videoPreviewRef]);

   if (!stream) {
      return null;
   }

   return <video ref={videoPreviewRef} width={640} height={480} autoPlay style={{ width: '100%', height: 'min-content' }} />;
}

export default Preview;