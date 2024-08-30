export const HORIZONTAL_BAR = {
    series: [
        {
          name: 'Marine Sprite',
          data: [25, 55, 20, 40]
        },
        {
          name: 'Striking Calf',
          data: [30, 70, 30, 45]
        }
    ],
    options: {
        dataLabels: {
          enabled: false,
        },
        colors: ['#BBD5E9', '#467592'],
        chart: {
          toolbar: {
            show: false,
          },
          type: 'bar',
          height: 350,
          stacked: true
        },
        plotOptions: {
          bar: {
            horizontal: true,
            dataLabels: {
              total: {
                enabled: false,
              }
            }
          }
        },
        stroke: {
          width: 0,
        },
        xaxis: {
          categories: ['Lime Ridge', 'Masonville', 'Willowbrook', 'Fairview'],
        },
        yaxis: {
          title: {
            text: 'Weight (MT)',
          }
        },
        fill: {
          opacity: 1
        },
        legend: {
          position: 'top',
          horizontalAlign: 'left',
          offsetX: 0
        }
    }
};

export const CHART_DATA = {
    series: [
      {
        name: 'Input Weight',
        type: 'column',
        data: [2.8, 1.8, 1.5, 1.6],
      },
      {
        name: 'Output Weight',
        type: 'column',
        data: [1.8, 2.7, 0.8, 1.1],
      },
      {
        name: 'Weight-Bar',
        type: 'line',
        data: [2.8, 1.8, 1.5, 1.6],
      },
    ],
    options: {
      chart: {
        height: 350,
        type: 'line',
        stacked: false,
        toolbar: {
            show: false,
        }
      },
      colors: ['#0091B7', '#F6901E'],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        width: [0, 0, 2],
        colors: ['#0091B7'],
      },
      xaxis: {
        type: 'category',
        categories: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        axisBorder: {
            show: true,
            color: '#e2e0e0',
        },
        labels: {
            maxHeight: 41,
            style: {
                colors: '#363637',
            },
        },
      },
      yaxis: [
        {
          axisTicks: {
            show: true,
          },
          axisBorder: {
            show: true,
            color: '#e2e0e0',
          },
          labels: {
            style: {
              colors: '#363637',
            },
          },
          title: {
            text: 'Weight',
            style: {
              color: '#363637',
            },
          },
          tooltip: {
            enabled: true,
          },
        },
        {
          seriesName: 'Income',
          opposite: true,
          axisTicks: {
            show: true,
          },
          axisBorder: {
            show: true,
            color: '#e2e0e0',
          },
          labels: {
            style: {
              colors: '#363637',
            },
          },
          title: {
            text: 'Percentage Volume Reduction',
            style: {
              color: '#363637',
            },
          },
        },
      ],
    },
};

export const TOTAL_LIFT = {
    series: [
      {
        name: 'Input Weight',
        type: 'column',
        data: [8, 5, 22, 14],
      },
      {
        name: 'Output Weight',
        type: 'column',
        data: [14, 11, 10, 23],
      },
    ],
    options: {
      chart: {
        height: 350,
        type: 'line',
        stacked: false,
        toolbar: {
            show: false,
        }
      },
      colors: ['#0091B7', '#F6901E'],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        width: 0,
      },
      xaxis: {
        type: 'category',
        categories: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        axisBorder: {
            show: true,
            color: '#e2e0e0',
        },
        labels: {
            maxHeight: 41,
            style: {
                colors: '#363637',
            },
        },
      },
      yaxis: [
        {
          min: 0,
          max: 32,
          axisTicks: {
            show: true,
          },
          axisBorder: {
            show: true,
            color: '#e2e0e0',
          },
          labels: {
            style: {
              colors: '#363637',
            },
          },
          title: {
            text: 'Weight',
            style: {
              color: '#363637',
            },
          },
          tooltip: {
            enabled: true,
          },
        },
        {
          seriesName: 'Income',
          min: 0,
          max: 16,
          opposite: true,
          axisTicks: {
            show: true,
          },
          axisBorder: {
            show: true,
            color: '#e2e0e0',
          },
          labels: {
            style: {
              colors: '#363637',
            },
          },
          title: {
            text: 'Lifts',
            style: {
              color: '#363637',
            },
          },
        },
      ],
    },
};

export const COLUMN_BAR = {
    series: [
      {
        name: 'Total Lifts',
        data: [4.4, 4, 2.1, 2.5],
      },
      {
        name: 'Total Weight',
        data: [0.4, 0.5, 0.6, 0.4],
      },
    ],
    
    options: {
      dataLabels: {
        enabled: false,
      },
      colors: ['#0091B7', '#F6901E'],
      chart: {
        type: 'bar',
        height: 350,
        stacked: true,
        toolbar: {
          show: false,
        },
        zoom: {
          enabled: true,
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
        },
      },
      xaxis: {
        type: 'category',
        categories: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      },
      yaxis: {
        title: {
          text: 'Time Spent',
        }
      },
      legend: {
        position: 'bottom',
        offsetY: 10,
      },
      fill: {
        opacity: 1,
      },
    },
};

export const PIE_CHART = {
    series: [80, 20],
    options: {
      chart: {
        width: 400,
        type: 'pie',
        toolbar: {
          show: false,
        },
      },
      colors: ['#033500', '#0091B7'],
      labels: ['Recycled Waste', 'Non-Recycled Waste'],
      legend: {
        position: 'top',
      },
      responsive: [{
        breakpoint: 1180,
        options: {
          chart: {
            width: 350
          },
        }
      }]
    },
};

export const SINGLE_COLUMN_BAR = {
    series: [
      {
        name: 'Total Lifts',
        data: [40, 70, 21, 25],
      },
    ],
    
    options: {
      dataLabels: {
        enabled: false,
      },
      colors: ['#0091B7'],
      chart: {
        type: 'bar',
        height: 350,
        stacked: true,
        toolbar: {
          show: false,
        },
        zoom: {
          enabled: true,
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
        },
      },
      xaxis: {
        type: 'category',
        categories: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      },
      yaxis: {
        min: 0,
        max: 100,
      },
      legend: {
        position: 'bottom',
        offsetY: 10,
      },
      fill: {
        opacity: 1,
      },
    },
};