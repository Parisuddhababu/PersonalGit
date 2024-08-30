import React from 'react';
import './App.css';
import LineChart from './components/LineChart';
import BarChart from './components/BarChart';
import AreaChart from './components/AreaChart';
import PieChart from './components/PieChart';
import DonutChart from './components/DonutChart';
import RadialBarChart from './components/RadialBarChart';
import ScatterPlot from './components/ScatterPlot';
import BubbleChart from './components/BubbleChart';
import RangeBarChart from './components/RangeBarChart';
import CandlestickChart from './components/CandlestickChart';
import HeatmapChart from './components/HeatmapChart';
import PolarAreaChart from './components/PolarAreaChart';
import TreemapChart from './components/TreemapChart';
import GanttChart from './components/GanttChart';
import PolarChart from './components/PolarChart';
import BoxPlotChart from './components/BoxPlotChart';

function App() {
  return (
    <div className="App">
      <div className='container'>
        <div style={{ "display": "flex", "flexDirection": "column"}}>
          <LineChart />
          <h2>Line Chart</h2>
        </div>
        <div style={{ "display": "flex", "flexDirection": "column"}}>
          <BarChart />
          <h2>Bar Chart</h2>
        </div>
        <div style={{ "display": "flex", "flexDirection": "column"}}>
          <AreaChart />
          <h2>Area Chart</h2>
        </div>
        <div style={{ "display": "flex", "flexDirection": "column"}}>
          <PieChart />
          <h2>Pie Chart</h2>
        </div>
        <div style={{ "display": "flex", "flexDirection": "column"}}>
          <DonutChart />
          <h2>Donut Chart</h2>
        </div>
        <div style={{ "display": "flex", "flexDirection": "column"}}>
          <RadialBarChart />
          <h2>Radial Bar Chart</h2>
        </div>
        <div style={{ "display": "flex", "flexDirection": "column"}}>
          <ScatterPlot />
          <h2>ScatterPlot Chart</h2>
        </div>
        <div style={{ "display": "flex", "flexDirection": "column"}}>
          <BubbleChart />
          <h2>Bubble Chart</h2>
        </div>
        <div style={{ "display": "flex", "flexDirection": "column"}}>
          <RangeBarChart />
          <h2>Range Bar Chart</h2>
        </div>
        <div style={{ "display": "flex", "flexDirection": "column"}}>
          <CandlestickChart />
          <h2>Candle stick Chart</h2>
        </div>
        <div style={{ "display": "flex", "flexDirection": "column"}}>
          <HeatmapChart />
          <h2>Heatmap Chart</h2>
        </div>
        <div style={{ "display": "flex", "flexDirection": "column"}}>
          <PolarAreaChart />
          <h2>Polar Area Chart</h2>
        </div>
        <div style={{ "display": "flex", "flexDirection": "column"}}>
          <TreemapChart />
          <h2>Treemap Chart</h2>
        </div>
        <div style={{ "display": "flex", "flexDirection": "column"}}>
          <GanttChart />
          <h2>Gantt Chart</h2>
        </div>
        <div style={{ "display": "flex", "flexDirection": "column"}}>
          <PolarChart />
          <h2>Polar Chart</h2>
        </div>
        <div style={{ "display": "flex", "flexDirection": "column"}}>
          <BoxPlotChart />
          <h2>Box Plot Chart</h2>
        </div>
      </div>
    </div>
  );
}

export default App;
