# React ApexCharts Documentation

![React ApexCharts Logo](https://raw.githubusercontent.com/apexcharts/react-apexcharts/master/assets/logo.png)

Welcome to the documentation for React ApexCharts! This guide will help you get started with integrating and using ApexCharts in your React applications. ApexCharts is a modern JavaScript charting library that offers a wide range of customizable charts for data visualization.

- ### Purpose:

  - Data Visualization

    - Rich Charts

  - Integration with React

    - Easy to use React Component

  - Dynamic Updates

  - Interactivity

  - Numerous Chart Types

- ### prerequisite:

  - Node version: v16.16.0
  - NPM version: 9.6.7

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Basic Example](#basic-example)
- [Props](#props)
- [Events](#events)
- [Customization](#customization)
- [Advanced Usage](#advanced-usage)
- [Resources](#resources)

## Installation & How We Can Used In Other Application

To use React ApexCharts in your project, you need to install the package using npm or yarn:

```bash
npm install react-apexcharts apexcharts
```

or

```bash
yarn add react-apexcharts apexcharts
```

## Usage

Import the `react-apexcharts` component and use it to render different types of charts in your React components.

```jsx
import React from 'react';
import ReactApexChart from 'react-apexcharts';

const ChartComponent = () => {
  const options = {
    // Chart options
  };

  const series = [
    // Data series
  ];

  return (
    <ReactApexChart
      options={options}
      series={series}
      type='line'
      height={300}
    />
  );
};

export default ChartComponent;
```

## Basic Example

Let's create a simple line chart:

```jsx
import React from 'react';
import ReactApexChart from 'react-apexcharts';

const LineChart = () => {
  const options = {
    chart: {
      id: 'basic-line',
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    },
  };

  const series = [
    {
      name: 'Series 1',
      data: [30, 40, 25, 50, 49, 21, 70],
    },
  ];

  return (
    <ReactApexChart
      options={options}
      series={series}
      type='line'
      height={300}
    />
  );
};

export default LineChart;
```

## Props

- `options`: An object containing ApexCharts configuration options.
- `series`: An array of objects representing data series for the chart.
- `type`: A string indicating the type of chart (e.g., "line", "bar", "pie").
- `height`: Height of the chart in pixels.

For a complete list of available props and their descriptions, please refer to the [Props documentation](https://apexcharts.com/docs/react-charts/#props).

## Events

ApexCharts supports a variety of events that you can use to interact with the charts. Check out the [Events documentation](https://apexcharts.com/docs/react-charts/#events) for more details.

## Customization

You can customize the appearance of your charts by modifying the options object. Refer to the [Customization documentation](https://apexcharts.com/docs/react-charts/#customization) for in-depth information.

## Advanced Usage

Learn about more advanced features like updating charts dynamically, using different types of charts, and integrating with APIs in the [Advanced Usage documentation](https://apexcharts.com/docs/react-charts/#advanced-usage).

## Resources

- [GitHub Repository](https://github.com/apexcharts/react-apexcharts)
- [Official Website](https://apexcharts.com/)
- [Documentation](https://apexcharts.com/docs/react-charts/)

Feel free to explore, experiment, and create stunning data visualizations using React ApexCharts!

## Screenshots

![react-apexcharts](https://dev.azure.com/BrainvireInfo/9e43166a-9cd3-4232-8a59-017698f26e78/_apis/git/repositories/9b507252-6292-49a7-b0b5-3bc86fc9d32d/items?path=/react-apexcharts/react-charts-images/image_2023_08_23T11_06_17_530Z.png&versionDescriptor%5BversionOptions%5D=0&versionDescriptor%5BversionType%5D=0&versionDescriptor%5Bversion%5D=dev&resolveLfs=true&%24format=octetStream&api-version=5.0)
