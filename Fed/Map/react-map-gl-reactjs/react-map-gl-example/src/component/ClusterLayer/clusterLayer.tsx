import Map, {
  Layer,
  MapRef,
  NavigationControl,
  ScaleControl,
  Source,
} from 'react-map-gl';
import {
  intitalMapValue,
  MapHeightWidth,
  MAP_BOX_API_TOKEN,
  MAP_STYLE,
} from '../../config';
import {
  clusterCountLayer,
  clusterLayer,
  unclusteredPointLayer,
} from './clusterLayerType';
import type { GeoJSONSource } from 'react-map-gl';
import { useCallback, useRef } from 'react';

const ClusterLayer = () => {
  const mapRef = useRef<MapRef>(null);

  const onClick = useCallback((event: any) => {
    const feature = event.features[0];
    const clusterId = feature.properties.cluster_id;
    if (mapRef && mapRef.current) {
      const mapboxSource = mapRef.current.getSource(
        'sourceId'
      ) as GeoJSONSource;

      mapboxSource.getClusterExpansionZoom(clusterId, (err, zoom) => {
        if (err) {
          return;
        }
        if (mapRef && mapRef.current) {
          mapRef.current.easeTo({
            center: feature.geometry.coordinates,
            zoom,
            duration: 500,
          });
        }
      });
    }
  }, []);

  return (
    <Map
      initialViewState={intitalMapValue}
      mapStyle={MAP_STYLE}
      mapboxAccessToken={MAP_BOX_API_TOKEN} // @ts-ignore
      interactiveLayerIds={[clusterLayer.id]}
      onClick={onClick}
      ref={mapRef}
      style={MapHeightWidth}
    >
      <Source
        id='sourceId'
        type='geojson'
        data='https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson'
        cluster={true}
        clusterMaxZoom={14}
        clusterRadius={50}
      >
        <Layer {...clusterLayer} />
        <Layer {...clusterCountLayer} />
        <Layer {...unclusteredPointLayer} />
      </Source>
      <NavigationControl position='top-right' />
      <ScaleControl position='top-right' />
    </Map>
  );
};

export default ClusterLayer;
