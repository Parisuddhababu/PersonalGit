import React from 'react';
import ReactApexChart from 'react-apexcharts';

const TreemapChart = () => {
  const options = {
    series: [
      {
        data: [
          {
            x: 'Fruits',
            y: 10
          },
          {
            x: 'Vegetables',
            y: 20
          },
          // More data...
        ]
      }
    ]
  };

  return <ReactApexChart options={options} series={options.series} type="treemap" height={300} width={600}/>;
};

export default TreemapChart;
