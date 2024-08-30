import React from 'react';
import ReactApexChart from 'react-apexcharts';

const PolarChart = () => {
  const options = {
    labels: ['Apples', 'Oranges', 'Bananas', 'Berries', 'Pears', 'Peaches'],
    plotOptions: {
      radar: {
        size: 130,
        polygons: {
          strokeColor: '#e9e9e9',
          fill: {
            colors: ['#f8f8f8', '#fff']
          }
        }
      }
    }
  };

  const series = [
    {
      name: 'Series 1',
      data: [80, 50, 30, 60, 20, 90]
    }
  ];

  return <ReactApexChart options={options} series={series} type="radar" height={300} width={600}/>;
};

export default PolarChart;
