import React from 'react';
import ReactApexChart from 'react-apexcharts';

const RadialBarChart = () => {
  const options:any = {
    plotOptions: {
      radialBar: {
        dataLabels: {
          name: {
            fontSize: '22px'
          },
          value: {
            fontSize: '16px'
          },
          total: {
            show: true,
            label: 'Total',
            formatter: function (w:any) {
              return 249;
            }
          }
        }
      }
    },
    labels: ['Apples', 'Oranges', 'Bananas', 'Berries']
  };

  const series = [44, 55, 67, 83];

  return <ReactApexChart options={options} series={series} type="radialBar" height={300} width={600} />;
};

export default RadialBarChart;
