import React from "react";
import ReactApexChart from 'react-apexcharts';

const BarChart=()=>{
    const options = {
        chart: {
          id: 'basic-bar-chart',
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
    
      return <ReactApexChart options={options} series={series} type="bar" height={300} width={600} />;
};
export default BarChart;
