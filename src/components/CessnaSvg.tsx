import React, { createRef } from 'react';

interface ICessnaSvgProps {
  rotation?: number;
  fillColor: string;
  strokeColor: string;
}

export default function CessnaSvg(props: ICessnaSvgProps) {
  const pathRef = createRef<SVGPathElement>();

  const baseRotation = -45;

  return (
    <g transform={`rotate(${props.rotation ? baseRotation + props.rotation : baseRotation} 10 10)`}>
      <svg width='20' height='20'>
        <path
          ref={pathRef}
          d='M15.388 4.781c.068.068.061.154-.171.656-.028.06-.18.277-.18.277s.102.113.13.14c.054.055.078.175.056.27-.068.295-.89 1.47-1.35 1.93-.285.286-.432.481-.422.56.009.068.117.356.24.64.219.5.3.599 2.762 3.339 1.95 2.169 2.546 2.87 2.582 3.028.098.439-.282.847-1.264 1.356l-.507.263-7.389-5.29-4.43 3.365.102.18c.056.099.519.676 1.029 1.283.51.607.933 1.161.94 1.232.026.284-1.111 1.177-1.282 1.006-.27-.27-1.399-1.131-1.494-1.14-.068-.007-1.04-.747-1.37-1.077-.329-.33-1.07-1.301-1.076-1.37-.01-.094-.871-1.224-1.14-1.493-.171-.171.722-1.308 1.006-1.282.07.007.625.43 1.231.94.607.51 1.185.973 1.283 1.029l.18.101 3.365-4.43-5.29-7.388.263-.507c.51-.982.918-1.362 1.357-1.264.158.035.859.632 3.028 2.581 2.74 2.462 2.838 2.544 3.339 2.762.284.124.572.232.639.24.08.01.274-.136.56-.422.46-.46 1.635-1.282 1.93-1.35.095-.022.216.003.27.057.028.028.139.129.139.129s.217-.153.277-.18c.502-.233.59-.238.657-.17z'
          fill={props.fillColor}
          stroke={props.strokeColor}
          strokeWidth="2"
        />
      </svg>
    </g>
  );
}
