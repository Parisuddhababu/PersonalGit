import React from 'react';
import ReactApexChart from 'react-apexcharts';

const HeatmapChart = () => {
  const options = {
    xaxis: {
      categories: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    }
  };

  const series = [
    {
      name: 'Metric 1',
      data: [
        { x: 'Sunday', y: 12 },
        { x: 'Monday', y: 15 },
        // More data...
      ]
    },
    {
      name: 'Metric 2',
      data: [
        { x: 'Sunday', y: 25 },
        { x: 'Monday', y: 28 },
        // More data...
      ]
    }
  ];

  return <ReactApexChart options={options} series={series} type="heatmap" height={300} width={600}/>;
};

export default HeatmapChart;
