import MapboxDraw from '@mapbox/mapbox-gl-draw';
import { useControl } from 'react-map-gl';

import type { MapRef, ControlPosition } from 'react-map-gl';

type DrawControlProps = ConstructorParameters<typeof MapboxDraw>[0] & {
  position?: ControlPosition;

  onCreate?: (evt: { features: object[] }) => void;
  onUpdate?: (evt: { features: object[]; action: string }) => void;
  onDelete?: (evt: { features: object[] }) => void;
};

const PolygonControl = (props: DrawControlProps) => {
  useControl<MapboxDraw>(
    // @ts-ignore
    ({ map }: { map: MapRef }) => {
      // Here we can handle Drawing content
      return new MapboxDraw(props);
    },
    {
      position: props.position,
    }
  );

  return null;
};

export default PolygonControl;
