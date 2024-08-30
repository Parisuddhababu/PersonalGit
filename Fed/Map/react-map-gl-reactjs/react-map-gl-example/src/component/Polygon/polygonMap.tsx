import { useCallback, useState } from 'react';
import Map from 'react-map-gl';
import {
  intitalMapValue,
  MapHeightWidth,
  MAP_BOX_API_TOKEN,
  MAP_STYLE,
} from '../../config';
import PolygonControl from './PolygonControl';

const PolygonMap = () => {
  const [features, setFeatures] = useState<any>(null);

  /**
   * Update Polygon
   */
  const onUpdate = useCallback(
    (e: any) => {
      setFeatures((currFeatures: any) => {
        const newFeatures = { ...currFeatures };
        for (const f of e.features) {
          newFeatures[f.id] = f;
        }
        return newFeatures;
      });
      console.log('features', features);
    },
    [features]
  );
  /**
   * Polygon Delete
   */
  const onDelete = useCallback((e: any) => {
    setFeatures((currFeatures: any) => {
      const newFeatures = { ...currFeatures };
      for (const f of e.features) {
        delete newFeatures[f.id];
      }
      return newFeatures;
    });
  }, []);
  return (
    <Map
      initialViewState={intitalMapValue}
      mapStyle={MAP_STYLE}
      mapboxAccessToken={MAP_BOX_API_TOKEN}
      style={MapHeightWidth}
    >
      <PolygonControl
        position='top-left'
        displayControlsDefault={false}
        controls={{
          polygon: true,
          trash: true,
        }}
        defaultMode='draw_polygon'
        onCreate={onUpdate}
        onUpdate={onUpdate}
        onDelete={onDelete}
      />
    </Map>
  );
};

export default PolygonMap;
