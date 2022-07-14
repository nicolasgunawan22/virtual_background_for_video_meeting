import React from 'react'

function ArrowLeftIcon({
   width = "8",
   height = "16",
   fill = "#444444"
}) {
   return (
      <svg
         width={width}
         height={height}
         viewBox="0 0 8 16"
         fill="none"
         xmlns="http://www.w3.org/2000/svg"
      >
         <path
            d="M6.65238 15.9558C6.48213 15.9563 6.31391 15.9188 6.16009 15.8458C6.00627 15.7728 5.87075 15.6663 5.76349 15.5341L0.259244 8.69654C0.0916306 8.49263 0 8.23686 0 7.9729C0 7.70894 0.0916306 7.45317 0.259244 7.24925L5.95722 0.411682C6.15066 0.178957 6.42862 0.0326052 6.72995 0.0048222C7.03129 -0.0229608 7.33133 0.0701007 7.56405 0.263534C7.79678 0.456967 7.94313 0.734928 7.97091 1.03627C7.99869 1.33761 7.90563 1.63764 7.7122 1.87036L2.61821 7.9786L7.54126 14.0868C7.68061 14.2541 7.76913 14.4578 7.79635 14.6738C7.82356 14.8898 7.78833 15.1091 7.69482 15.3057C7.60131 15.5023 7.45343 15.668 7.26869 15.7832C7.08395 15.8984 6.87008 15.9583 6.65238 15.9558Z"
            fill={fill}
         />
      </svg>
   )
}

export default ArrowLeftIcon;