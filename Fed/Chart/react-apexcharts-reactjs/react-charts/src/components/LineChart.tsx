import React from 'react';
import ReactApexChart from 'react-apexcharts';

const LineChart = () => {
  const options = {
    chart: {
      id: 'basic-line'
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']
    }
  };

  const series = [
    {
      name: 'Series 1',
      data: [30, 40, 25, 50, 49, 21, 70]
    }
  ];

  return <ReactApexChart options={options} series={series} type="line" height={300} width={600} />;
};

export default LineChart;