import MarkerMap from './component/Marker/marker';
import NormalMap from './component/NormalMap/normalMap';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Box, Tab, Tabs } from '@mui/material';
import { ChangeEvent, useState, useCallback } from 'react';
import PolygonMap from './component/Polygon/polygonMap';
import ClusterLayer from './component/ClusterLayer/clusterLayer';
import RegionSelection from './component/RegionSelection';

const App = () => {
  const [currentTab, setCurrentTab] = useState<number>(0);

  const handleTabsChange = useCallback(
    (event: ChangeEvent<{}>, value: number): void => {
      setCurrentTab(value);
    },
    []
  );

  const steps = [
    {
      label: 'Normal Map',
      id: 'NORMAL_MAP',
      content: <NormalMap />,
    },
    {
      label: 'Marker Map',
      id: 'MARKER_MAP',
      content: <MarkerMap />,
    },
    {
      label: 'Draw Polygon Map',
      id: 'DRAW_POLYGON_MAP',
      content: <PolygonMap />,
    },
    {
      label: 'Cluster Map',
      id: 'CLUSTER_MAP',
      content: <ClusterLayer />,
    },
    {
      label: 'Region Map',
      id: 'REGION_MAP',
      content: <RegionSelection />,
    },
  ];
  return (
    <>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={currentTab}
          onChange={handleTabsChange}
          indicatorColor='primary'
        >
          {steps.map((tab, index) => (
            <Tab key={tab.id} label={tab.label} value={index} />
          ))}
        </Tabs>
      </Box>
      <Box sx={{ py: 4 }}>{steps[currentTab].content}</Box>
    </>
  );
};

export default App;
