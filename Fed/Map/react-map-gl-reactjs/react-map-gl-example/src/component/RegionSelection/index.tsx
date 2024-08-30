import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useCallback, useState } from 'react';
import Map, { Layer, Source } from 'react-map-gl';
import {
  MapHeightWidth,
  MAP_BOX_API_TOKEN,
  MAP_STYLE,
  random,
} from '../../config';
import { GEO_JSON } from '../../mock_data/forcast-volume-faker';
import type { FillLayer } from 'react-map-gl';

const ZONE_COLORS = [
  '#0063FF',
  '#FF7D18',
  '#10E566',
  '#E5105D',
  '#6B10E5',
  '#E9EF0E',
];

export const dataLayer: FillLayer = {
  id: 'data',
  type: 'fill',
  paint: {
    'fill-color': ZONE_COLORS[random(0, 5)],
    'fill-opacity': 0.35,
  },
};

export const buildGeoJson = (geoJson: any, index: number) => {
  return {
    ...geoJson,
    features: geoJson.features[index],
  };
};

const RegionSelection = () => {
  const [name, setName] = useState('');
  const [data, setData] = useState<any>(null);

  const handleChange = useCallback((event: any) => {
    setName(event.target.value);
    const randomNumber = random(0, 4);
    if (
      event.target.value === 'abc' ||
      event.target.value === 'xyz' ||
      event.target.value === 'jkl'
    ) {
      setData(buildGeoJson(GEO_JSON, randomNumber));
    }
  }, []);
  return (
    <>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel id='demo-simple-select-label'>Name</InputLabel>
        <Select
          labelId='demo-simple-select-label'
          id='demo-simple-select'
          value={name}
          label='Name'
          onChange={handleChange}
        >
          <MenuItem value={'abc'}>ABC</MenuItem>
          <MenuItem value={'xyz'}>XYZ</MenuItem>
          <MenuItem value={'jkl'}>JKL</MenuItem>
        </Select>
      </FormControl>
      <Map
        initialViewState={{
          latitude: 43.65107,
          longitude: -79.347015,
          zoom: 7.5,
        }}
        mapStyle={MAP_STYLE}
        attributionControl={false}
        mapboxAccessToken={MAP_BOX_API_TOKEN}
        style={MapHeightWidth}
        interactiveLayerIds={['data']}
      >
        {data && (
          <Source type='geojson' data={data?.features}>
            <Layer {...dataLayer} />
          </Source>
        )}
      </Map>
    </>
  );
};

export default RegionSelection;
