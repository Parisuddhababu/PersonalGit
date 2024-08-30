import React from 'react';
import ReactApexChart from 'react-apexcharts';

const RangeBarChart = () => {
  const options:any = {
    plotOptions: {
      bar: {
        horizontal: true
      }
    },
    xaxis: {
      type: 'datetime'
    },
    yaxis: {
      min: new Date(2023, 0, 1).getTime(),
      max: new Date(2023, 11, 31).getTime()
    }
  };

  const series = [
    {
      name: 'Project A',
      data: [
        {
          x: 'Team 1',
          y: [new Date(2023, 1, 1).getTime(), new Date(2023, 4, 1).getTime()]
        },
        {
          x: 'Team 2',
          y: [new Date(2023, 2, 1).getTime(), new Date(2023, 7, 1).getTime()]
        }
      ]
    }
  ];

  return <ReactApexChart options={options} series={series} type="rangeBar" height={300} width={600}/>;
};

export default RangeBarChart;
