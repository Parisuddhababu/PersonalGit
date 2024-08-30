import React from 'react';
import ReactApexChart from 'react-apexcharts';

const GanttChart = () => {
  const options:any = {
    xaxis: {
      type: 'datetime'
    },
    yaxis: {
      labels: {
        show: false
      }
    }
  };

  const series = [
    {
      data: [
        {
          x: 'Project A',
          y: [new Date(2023, 0, 1).getTime(), new Date(2023, 1, 15).getTime()]
        },
        {
          x: 'Project B',
          y: [new Date(2023, 2, 1).getTime(), new Date(2023, 4, 30).getTime()]
        },
        // More data...
      ]
    }
  ];

  return <ReactApexChart options={options} series={series} type="rangeBar" height={300}  width={600} />;
};

export default GanttChart;
