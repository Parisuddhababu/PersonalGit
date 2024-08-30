import React from 'react';
import ReactApexChart from 'react-apexcharts';

const CandlestickChart = () => {
  const options:any = {
    xaxis: {
      type: 'datetime'
    },
    yaxis: {
      tooltip: {
        enabled: true
      }
    }
  };

  const series = [
    {
      data: [
        { x: new Date(2023, 0, 1), y: [45, 65, 35, 55] },
        { x: new Date(2023, 1, 1), y: [55, 85, 40, 75] },
        { x: new Date(2023, 2, 1), y: [60, 70, 50, 65] },
        // More data points...
      ]
    }
  ];

  return <ReactApexChart options={options} series={series} type="candlestick" height={300}  width={600}/>;
};

export default CandlestickChart;
