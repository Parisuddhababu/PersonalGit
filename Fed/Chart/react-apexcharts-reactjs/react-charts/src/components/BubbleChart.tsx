import React from 'react';
import ReactApexChart from 'react-apexcharts';

const BubbleChart = () => {
  const options:any = {
    chart: {
      zoom: {
        enabled: true,
        type: 'xy'
      }
    },
    xaxis: {
      tickAmount: 12,
      type: 'numeric'
    },
    yaxis: {
      max: 70
    }
  };

  const series = [
    {
      name: 'Bubble Data',
      data: [
        { x: 14, y: 54, z: 30 },
        { x: 10, y: 42, z: 20 },
        { x: 32, y: 74, z: 10 },
        { x: 41, y: 53, z: 5 },
        { x: 35, y: 89, z: 18 },
        { x: 40, y: 63, z: 25 }
      ]
    }
  ];

  return <ReactApexChart options={options} series={series} type="bubble" height={300} width={600}/>;
};

export default BubbleChart;
