import React from 'react';
import ReactApexChart from 'react-apexcharts';

const BoxPlotChart = () => {
  const options:any = {
    chart: {
      type: 'boxPlot'
    },
    xaxis: {
      type: 'category'
    }
  };

  const series = [
    {
      name: 'Series 1',
      data: [
        { x: 'Category A', y: [25, 35, 45, 55, 65] },
        { x: 'Category B', y: [15, 25, 35, 45, 55] },
        // More data...
      ]
    }
  ];

  return <ReactApexChart options={options} series={series} type="boxPlot" height={300} width={600}/>;
};

export default BoxPlotChart;
