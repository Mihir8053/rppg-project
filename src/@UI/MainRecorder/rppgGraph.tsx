import React, { useRef, useEffect } from 'react';
import Chart from 'chart.js/auto';

// const RppgGraph = ({ rppgData }) => {
//   const canvasRef = useRef<HTMLCanvasElement | null>(null);
//   useEffect(() => {
//     if (canvasRef.current && rppgData) {
//       const ctx = canvasRef.current.getContext('2d');
//       const chart = new Chart(ctx, {
//         type: 'line',
//         data: {
//           labels: rppgData.map((_, index) => index),
//           datasets: [
//             {
//               label: 'RPPG Data',
//               data: rppgData,
//               fill: false,
//               borderColor: 'rgba(75, 192, 192, 1)',
//               tension: 0.1,
//             },
//           ],
//         },
//         options: {
//           scales: {
//             x: {
//               type: 'linear',
//             },
//             y: {
//               min: 0,
//               max: 1, // Set the appropriate min and max values
//             },
//           },
//         },
//       });
//     }
//   }, [rppgData]);

//   return <canvas ref={canvasRef} width={400} height={200} />;
// };


function rppgGraph() {
  return (
    <div>rppgGraph</div>
  )
}

export default rppgGraph
