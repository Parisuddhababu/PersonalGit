# React Map GL

ntegrating Google Maps serves various purposes, enhancing the functionality and user experience of web applications.

### Purpose

- Geolocation and Mapping
  - Displaying Maps
- Location-Based Services
  - Geocoding
- Markers and Info Windows
  - Place Markers
- Directions and Routing
  - Route Planning
- Street View Integration
- Custom Overlays and Layers
  - Customization
- Search and Autocomplete
  - Place Autocomplete
- Geofence Integration
- Integration with Location-Based APIs
  - Third-Party Integration

### Prerequisites

Before you begin, ensure you have the following installed on your machine:

- Node.js and npm (Node Package Manager)

  - Node version: v16.16.0
  - NPM version: 9.6.7

### Installation Command

```bash
$ npm install --save react-map-gl mapbox-gl
```

### Import Css Statements

```bash
$ import 'mapbox-gl/dist/mapbox-gl.css'
```

### Requirements

- Require a map box token for a using a react-map-gl
- Provide a mapbox token to map props `mapboxAccessToken`
- If required a third party authorization then you can also passed your token

```bash
const transformRequest = (url, resourceType) => {
  if (resourceType === 'Tile' && url.match('yourTileSource.com')) {
    return {
      url: url,
      headers: { 'Authorization': 'Bearer ' + yourAuthToken }
    }
  }
}
```

### State Management

- Two Type of State Management

1. `Controlled`

```bash
import * as React from 'react';
import Map from 'react-map-gl';


function App() {
  return <Map
    initialViewState={{
      longitude: -100,
      latitude: 40,
      zoom: 3.5
    }}
    mapStyle="mapbox://styles/mapbox/streets-v9"
  />;
```

2. `Un-controlled`

```bash
import * as React from 'react';
import Map from 'react-map-gl';


function App() {
  const [viewState, setViewState] = React.useState({
    longitude: -100,
    latitude: 40,
    zoom: 3.5
  });


  return <Map
    {...viewState}
    onMove={evt => setViewState(evt.viewState)}
    mapStyle="mapbox://styles/mapbox/streets-v9"
  />;
}
```

- We can add data using custom layer and source components

### Default Map

```bash
import * as React from 'react';
import Map from 'react-map-gl';


function App() {
  return <Map
    initialViewState={{
      longitude: -100,
      latitude: 40,
      zoom: 3.5
    }}
    style={{width: '100vw', height: '100vh'}}
    mapStyle="mapbox://styles/mapbox/streets-v9"
    mapboxAccessToken="MY_ACCESS_TOKEN"
  />;
}
```

#### How to used Methods and Hooks

```bash
import * as React from 'react';
import Map from 'react-map-gl';


function App() {
  const mapRef = React.useRef();


  React.useEffect(() => {
    mapRef.current.on('styleimagemissing', () => {
      // do something
    });
  }, [])


  return <Map ref={mapRef} />;
}
```

### Map Styling Options

| Options           | Type                                                        |
| ----------------- | ----------------------------------------------------------- | --- | ---- |
| Fog               | Mapbox Fog Options                                          |     | null |
| Light             | anchor: string <br/> color: string <br /> intencity: number |
| mapStyle          | string `OR` immutable                                       |
| Projections       | string                                                      |
| renderWorldCopies | boolean                                                     |
| styleDiffing      | booolean                                                    |
| terrain           | TerainSpecification                                         |

### Camera Options

- bounds?: `LngLatBoundsLike` - The initial bounds of the map. If specified, it overrides the longitude, latitude and zoom options. Default `null`.
- `fitBoundsOptions: FitBoundsOptions` - A fitBounds options object to use only when setting the bounds option. Default null
- `longitude: number` - The initial longitude of the map center. Default 0
- `latitude: number` - The initial latitude of the map center. Default 0
- `zoom: number` - The initial zoom level. Default 0.
- `pitch: number` - The initial pitch (tilt) of the map. Default 0.
- `bearing: number` - The initial bearing (rotation) of the map. Default 0.

## Input Handler Options

| Options             | Type     |
| ------------------- | -------- |
| boxZoom             | boolean  |
| doubleClickZoom     | boolean  |
| dragRotate          | boolean  |
| dragPan             | boolean  |
| Keyword             | boolean  |
| scrollZoom          | boolean  |
| touchPitch          | boolean  |
| touchzoomRotate     | boolean  |
| interactiveLayerIds | string[] |

## Callback Methods

| Method Name    | Return type                           |
| -------------- | ------------------------------------- | --------------------------- |
| onResize       | (event: MapboxEvent) => void          |
| onLoad         | (event: MapboxEvent) => void          |
| onRender       | (event: MapboxEvent) => void          |
| onIdle         | (event: MapboxEvent) => void          |
| onRemove       | (event: MapboxEvent) => void          |
| onError        | (event: MapboxEvent) => void          |
| onMouseDown    | (event: MapLayerMouseEvent) => void   |
| onMouseUp      | (event: MapLayerMouseEvent) => void   |
| onMouseOver    | (event: MapLayerMouseEvent) => void   |
| onMouseEnter   | (event: MapLayerMouseEvent) => void   |
| onMouseMove    | (event: MapLayerMouseEvent) => void   |
| onMouseLeave   | (event: MapLayerMouseEvent) => void   |
| onMouseOut     | (event: MapLayerMouseEvent) => void   |
| onClick        | (event: MapLayerMouseEvent) => void   |
| onDblClick     | (event: MapLayerMouseEvent) => void   |
| onContextMenu  | (event: MapLayerMouseEvent) => void   |
| onWheel        | (event: MapWheelEvent) => void        |
| onTouchStart   | (event: MapLayerTouchEvent) => void   |
| onTouchEnd     | (event: MapLayerTouchEvent) => void   |
| onTouchMove    | (event: MapLayerTouchEvent) => void   |
| onTouchCancel  | (event: MapLayerTouchEvent) => void   |
| onMoveStart    | (event: ViewStateChangeEvent) => void |
| onMove         | (event: ViewStateChangeEvent) => void |
| onMoveEnd      | (event: ViewStateChangeEvent) => void |
| onDragStart    | (event: ViewStateChangeEvent) => void |
| onDrag         | (event: ViewStateChangeEvent) => void |
| onDragEnd      | (event: ViewStateChangeEvent) => void |
| onZoomStart    | (event: ViewStateChangeEvent) => void |
| onZoom         | (event: ViewStateChangeEvent) => void |
| onZoomEnd      | (event: ViewStateChangeEvent) => void |
| onRotateStart  | (event: ViewStateChangeEvent) => void |
| onRotate       | (event: ViewStateChangeEvent) => void |
| onRotateEnd    | (event: ViewStateChangeEvent) => void |
| onPitchStart   | (event: ViewStateChangeEvent) => void |
| onPitch        | (event: ViewStateChangeEvent) => void |
| onPitchEnd     | (event: ViewStateChangeEvent) => void |
| onBoxZoomStart | (event: MapBoxZoomEvent) => void      |
| onBoxZoomEnd   | (event: MapBoxZoomEvent) => void      |
| onData         | (event: MapStyleDataEvent             | MapSourceDataEvent) => void |
| onStyleData    | (event: MapStyleDataEvent) => void    |
| onSourceData   | (event: MapSourceDataEvent) => void   |

### Attribute Controls

```bash
import * as React from 'react';
import Map, {AttributionControl} from 'react-map-gl';


function App() {
  return <Map
    initialViewState={{
      longitude: -100,
      latitude: 40,
      zoom: 3.5
    }}
    mapStyle="mapbox://styles/mapbox/streets-v9"
    {
      // disable the default attribution
    }
    attributionControl={false}
  >
    <AttributionControl customAttribution="Map design by me" />
  </Map>;
}
```

- Note that following property are not reactive. It will render only first mount time

| Attributes Name   | Type                                                       |
| ----------------- | ---------------------------------------------------------- |
| Compact           | boolean `OR` undefined                                     |
| customAttribution | string `OR` string[]                                       |
| Postion           | top-left `OR` top-right `OR` bottom-right `OR` bottom-left |
| Style             | css Property                                               |

### Full Screen Control

```bash
import * as React from 'react';
import Map, {FullscreenControl} from 'react-map-gl';


function App() {
  return <Map
    initialViewState={{
      longitude: -100,
      latitude: 40,
      zoom: 3.5
    }}
    mapStyle="mapbox://styles/mapbox/streets-v9"
  >
    <FullscreenControl />
  </Map>;
}
```

| Properties  | Type                                                       |
| ----------- | ---------------------------------------------------------- |
| containerId | string                                                     |
| Position    | top-left `OR` top-right `OR` bottom-left `OR` bottom-right |
| Style       | css property                                               |

### Geo Locate Control

```bash
import * as React from 'react';
import Map, {GeolocateControl} from 'react-map-gl';


function App() {
  return <Map
    initialViewState={{
      longitude: -100,
      latitude: 40,
      zoom: 3.5
    }}
    mapStyle="mapbox://styles/mapbox/streets-v9"
  >
    <GeolocateControl />
  </Map>;
}
```

### Geo Locate control method example

```bash
import * as React from 'react';
import Map, {GeolocateControl} from 'react-map-gl';


function App() {
  const geolocateControlRef = React.useRef();


  React.useEffect(() => {
    geolocateControlRef.current.trigger();
  }, [])


  return <Map><GeolocateControl ref={geolocateControlRef} /></Map>;
}
```

| Properties         | Type                                                       |
| ------------------ | ---------------------------------------------------------- |
| positionOptions    | PositionOptions                                            |
| trackUserLocation  | boolean                                                    |
| fitBoundOptions    | FitBoundOptions                                            |
| Position           | top-left `OR` top-right `OR` bottom-left `OR` bottom-right |
| Style              | css property                                               |
| showAccuracyCircle | boolean                                                    |
| showUserHeading    | boolean                                                    |
| showUserLocation   | boolean                                                    |

#### Callback functions

| Function Name            | Return Type                         |
| ------------------------ | ----------------------------------- |
| onGeolocate              | (evt: GeolocateEventResult) => void |
| onError                  | (evt: GeolocateEventResult) => void |
| onOutOfMaxBound          | (evt: GeolocateEventResult) => void |
| onTrackUserLocationStart | (evt: GeolocateEventResult) => void |
| onTrackUserLocationEnd   | (evt: GeolocateEventResult) => void |

### Layer

```bash
import * as React from 'react';
import Map, {Layer} from 'react-map-gl';


const parkLayer = {
  id: 'landuse_park',
  type: 'fill',
  source: 'mapbox',
  'source-layer': 'landuse',
  filter: ['==', 'class', 'park'],
  paint: {
    'fill-color': '#4E3FC8'
  }
};


function App() {
  return <Map
    initialViewState={{
      longitude: -122.4,
      latitude: 37.8,
      zoom: 14
    }}
    mapStyle="mapbox://styles/mapbox/streets-v9"
  >
    <Layer {...parkLayer} />
  </Map>;
}
```

| Properties | Type    |
| ---------- | ------- |
| id         | string  |
| type       | string; |
| beforeId   | string  |
| source     | string  |

### Map Provider

- Context provider that facilitate map operation outside of component directly render a map

```bash
import {MapProvider} from 'react-map-gl';


function Root() {
  return (
    <MapProvider>
      {
        // Application tree, somewhere one or more <Map /> component(s) are rendered
      }
    </MapProvider>
  );
}
```

### Marker

```bash
import * as React from 'react';
import Map, {Marker} from 'react-map-gl';


function App() {
  return <Map
    initialViewState={{
      longitude: -100,
      latitude: 40,
      zoom: 3.5
    }}
    mapStyle="mapbox://styles/mapbox/streets-v9"
  >
    <Marker longitude={-100} latitude={40} anchor="bottom" >
      <img src="./pin.png" />
    </Marker>
  </Map>;
}
```

| Properties        | Type                                                                                                             |
| ----------------- | ---------------------------------------------------------------------------------------------------------------- |
| anchor            | center `OR` left `OR` right `OR` top `OR` bottom `OR` bottom-left `OR` bottom-right `OR` top-left `OR` top-right |
| color             | string                                                                                                           |
| clickTolerance    | number                                                                                                           |
| draggable         | boolean                                                                                                          |
| latitude          | number                                                                                                           |
| longitude         | number                                                                                                           |
| offSet            | PointLike                                                                                                        |
| pitchAlignment    | map `OR` viewport `OR` auto                                                                                      |
| rotation          | number                                                                                                           |
| rotationAlignment | map `OR` viewport `OR` auto                                                                                      |
| scale             | number                                                                                                           |
| style             | css Property                                                                                                     |

| CallBack Function | Return Type                    |
| ----------------- | ------------------------------ |
| onClick           | (evt: MapEvent) => void        |
| onDragStart       | (evt: MarkerDragEvent) => void |
| onDrag            | (evt: MarkerDragEvent) => void |
| onDragEnd         | (evt: MarkerDragEvent) => void |

### Navigation Control

```bash
import * as React from 'react';
import Map, {NavigationControl} from 'react-map-gl';


function App() {
  return <Map
    initialViewState={{
      longitude: -100,
      latitude: 40,
      zoom: 3.5
    }}
    mapStyle="mapbox://styles/mapbox/streets-v9"
  >
    <NavigationControl />
  </Map>;
}
```

| Properties     | Type                                                       |
| -------------- | ---------------------------------------------------------- |
| position       | top-left `OR` top-right `OR` bottom-left `OR` bottom-right |
| style          | css Property                                               |
| showCompass    | boolean                                                    |
| showZoom       | boolean                                                    |
| visualizePitch | boolean                                                    |

### Popup

```bash
import * as React from 'react';
import Map, {Popup} from 'react-map-gl';


function App() {
  const [showPopup, setShowPopup] = React.useState(true);


  return <Map
    initialViewState={{
      longitude: -100,
      latitude: 40,
      zoom: 3.5
    }}
    mapStyle="mapbox://styles/mapbox/streets-v9"
  >
    {showPopup && (
      <Popup longitude={-100} latitude={40}
        anchor="bottom"
        onClose={() => setShowPopup(false)}>
        You are here
      </Popup>)}
  </Map>;
}
```

| Properties     | Type                                                                                                             |
| -------------- | ---------------------------------------------------------------------------------------------------------------- |
| anchor         | center `OR` left `OR` right `OR` top `OR` bottom `OR` bottom-left `OR` bottom-right `OR` top-left `OR` top-right |
| className      | string                                                                                                           |
| closeButton    | boolean                                                                                                          |
| closeOnClick   | boolean                                                                                                          |
| closeOnMove    | boolean                                                                                                          |
| focusAfterOpen | boolean                                                                                                          |
| Offset         | number `OR` PointLike `OR` Record <string, PointLike>                                                            |
| maxWidth       | string                                                                                                           |
| style          | css Property                                                                                                     |

| Callback Function | Return Type              |
| ----------------- | ------------------------ |
| onOpen            | (ev: PopupEvent) => void |
| onClose           | (ev: PopupEvent) => void |

### Scale Control

```bash
import * as React from 'react';
import Map, {ScaleControl} from 'react-map-gl';


function App() {
  return <Map
    initialViewState={{
      longitude: -100,
      latitude: 40,
      zoom: 3.5
    }}
    mapStyle="mapbox://styles/mapbox/streets-v9"
  >
    <ScaleControl />
  </Map>;
}
```

| Properties | Type                                                       |
| ---------- | ---------------------------------------------------------- |
| maxWidth   | string                                                     |
| position   | top-left `OR` top-right `OR` bottom-left `OR` bottom-right |
| style      | css Properties                                             |
| unit       | imperial `OR` metric `OR` nautical                         |

### Source

```bash
import * as React from 'react';
import Map, {Source, Layer} from 'react-map-gl';


const geojson = {
  type: 'FeatureCollection',
  features: [
    {type: 'Feature', geometry: {type: 'Point', coordinates: [-122.4, 37.8]}}
  ]
};


const layerStyle = {
  id: 'point',
  type: 'circle',
  paint: {
    'circle-radius': 10,
    'circle-color': '#007cbf'
  }
};


function App() {
  return <Map
    initialViewState={{
      longitude: -122.4,
      latitude: 37.8,
      zoom: 14
    }}
    mapStyle="mapbox://styles/mapbox/streets-v9"
  >
    <Source id="my-data" type="geojson" data={geojson}>
      <Layer {...layerStyle} />
    </Source>
  </Map>;
}
```

| Properties | Type   |
| ---------- | ------ |
| id         | string |
| type       | string |

### useControl

```bash
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import Map, {useControl} from 'react-map-gl';


function DrawControl(props: DrawControlProps) {
  useControl(() => new MapboxDraw(props), {
    position: props.position
  });


  return null;
}


function App() {
  return (
    <Map
      initialViewState={{
        longitude: -122.4,
        latitude: 37.8,
        zoom: 14
      }}
      mapStyle="mapbox://styles/mapbox/satellite-v9"
    >
      <DrawControl
        position="top-left"
        displayControlsDefault={false}
        controls={{
          polygon: true,
          trash: true
        }}
      />
    </Map>
  );
}
```

### Signature

```bash
useControl<T extends IControl>(
  onCreate: ({map: MapRef, mapLib: mapboxgl}) => IControl,
  options?: {
    position?: ControlPosition;
  }
): T


useControl<T extends IControl>(
  onCreate: ({map: MapRef, mapLib: mapboxgl}) => IControl,
  onRemove: ({map: MapRef, mapLib: mapboxgl}) => void,
  options?: {
    position?: ControlPosition;
  }
): T
```

### useMap

```bash
// Example using `useMap` inside a Map
import {Map, useMap} from 'react-map-gl';


function Root() {
  return (
    <Map ... >
      <NavigationButton />
    </Map>
  );
}


function NavigateButton() {
  const {current: map} = useMap();


  const onClick = () => {
    map.flyTo({center: [-122.4, 37.8]});
  };


  return <button onClick={onClick}>Go</button>;
}

```

### useMap with map Provider

```bash
// Example using `useMap` with `MapProvider`
import {MapProvider, Map, useMap} from 'react-map-gl';


function Root() {
  return (
    <MapProvider>
      <Map id="myMapA" ... />
      <Map id="myMapB" ... />
      <NavigateButton />
    </MapProvider>
  );
}

function NavigateButton() {
  const {myMapA, myMapB} = useMap();


  const onClick = () => {
    myMapA.flyTo({center: [-122.4, 37.8]});
    myMapB.flyTo({center: [-74, 40.7]});
  };
  return <button onClick={onClick}>Go</button>;
}
```

## Types

- Types imported from react-map-gl when we used a typescript

  1. MapboxMap
  2. IControl
  3. CustomLayerInterface
  4. MapRef
  5. GeolocateControlRef

- Styling

  1.  MapboxStyle
  2.  Fog
  3.  Light
  4.  TerrainSpecification
  5.  ProjectionSpecification
  6.  BackgroundLayer
  7.  CircleLayer
  8.  FillExtrusionLayer
  9.  FillLayer
  10. HitmapLayer
  11. HillshadeLayer
  12. LineLayer
  13. RasterLayer
  14. SymbolLayer
  15. SkyLayer
  16. GeoJSONSourceRow
  17. VideoSourceLayer
  18. ImageSourceRow
  19. VectorSourceRow
  20. RasterSource
  21. RasterDemSource
  22. CanvasSourceRow

- Configurations

  1.  anchor
  2.  alignment
  3.  controlPosition
  4.  DragpanOptions
  5.  FitBoundOptions
  6.  ZoomRotateOptions
  7.  PaddingOptions
  8.  TransformRequestFunction

- Data Types

  1.  LngLat
  2.  LngLatLike
  3.  LngLatBoundLike
  4.  Point
  5.  PointLike
  6.  MapboxGeoJSONFeature
  7.  viewState

- Source

  1.  GeoJSONSource
  1.  VideoSource
  1.  ImageSource
  1.  CanvasSource
  1.  VectorTileSource

- Events
  1.  MapboxEvent
  1.  MapLayerMouseEvent
  1.  MapWheelEvent
  1.  MapLayerTouchEvent
  1.  ViewStateChangeEvent
  1.  MapBoxZoomEvent
  1.  MapStyleDataEvent
  1.  MapSourceDataEvent
  1.  ErrorEvent
  1.  GeolocateEvent
  1.  GeolocateResultEvent
  1.  GeolocateErrorEvent
  1.  MarkerDragevent
  1.  PopupEvent

> ### Documentation Link

- https://visgl.github.io/react-map-gl/docs
- https://visgl.github.io/react-map-gl/examples
