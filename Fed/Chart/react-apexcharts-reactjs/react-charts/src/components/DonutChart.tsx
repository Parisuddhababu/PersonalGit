import React from 'react';
import ReactApexChart from 'react-apexcharts';

const DonutChart = () => {
  const options = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    dataLabels: {
      enabled: true
    }
  };

  const series = [30, 40, 25, 50, 49];

  return <ReactApexChart options={options} series={series} type="donut" height={300} width={600}/>;
};

export default DonutChart;
