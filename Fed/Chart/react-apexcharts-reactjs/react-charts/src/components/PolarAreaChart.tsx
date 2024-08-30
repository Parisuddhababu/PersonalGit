import React from 'react';
import ReactApexChart from 'react-apexcharts';

const PolarAreaChart = () => {
  const options:any = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    stroke: {
      show: true,
      curve: 'smooth',
      lineCap: 'butt',
      colors: undefined,
      width: 2,
      dashArray: 0
    },
    fill: {
      opacity: 0.8
    }
  };

  const series = [30, 40, 25, 50, 49];

  return <ReactApexChart options={options} series={series} type="polarArea" height={300} width={600}/>;
};

export default PolarAreaChart;
