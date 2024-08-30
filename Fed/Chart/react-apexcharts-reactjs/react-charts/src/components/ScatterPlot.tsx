import React from 'react';
import ReactApexChart from 'react-apexcharts';

const ScatterPlot = () => {
  const options:any = {
    chart: {
      zoom: {
        enabled: true,
        type: 'xy'
      }
    },
    xaxis: {
      type: 'numeric'
    },
    yaxis: {
      min: 0,
      max: 100
    }
  };

  const series = [
    {
      name: 'Sample Data',
      data: [
        [14, 54],
        [10, 42],
        [32, 74],
        [41, 53],
        [35, 89],
        [40, 63]
      ]
    }
  ];

  return <ReactApexChart options={options} series={series} type="scatter" height={300} width={600}/>;
};

export default ScatterPlot;
