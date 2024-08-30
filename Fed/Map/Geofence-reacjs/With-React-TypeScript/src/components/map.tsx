import React, { useCallback, useRef, useState } from 'react';
import {
  GoogleMap,
  DrawingManager,
  Polygon,
  useJsApiLoader,
  Autocomplete,
} from '@react-google-maps/api';
import './map.css';

const Maps = () => {
  //Google Maps Loading
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'USE_YOUR_GOOGLE_MAP_API_KEY',
    libraries: ['places', 'drawing'],
  });
  //Drawing Manager Options
  const drawingManagerOptions = {
    polygonOptions: {
      fillOpacity: 0.3,
      fillColor: '#ff0000',
      strokeColor: '#ff0000',
      strokeWeight: 2,
    },
    drawingControl: true,
    drawingControlOptions: {
      position: window.google?.maps?.ControlPosition?.TOP_CENTER,
      drawingModes: [window.google?.maps?.drawing?.OverlayType?.POLYGON],
    },
  };
  const polygonRefs = useRef<google.maps.Polygon>();
  const [polygons, setPolygons] = useState<google.maps.LatLngLiteral[]>([]);
  const [polygonList, setPolygonsList] = useState<
    { lat: number; lng: number }[][][]
  >([]);

  const [center, setCenter] = useState({ lat: 23.0225, lng: 72.5714 });

  //PolyOptions
  const polygonOptions = {
    fillOpacity: 0.3,
    fillColor: '#ff0000',
    strokeColor: '#ff0000',
    strokeWeight: 2,
    editable: true,
  };

  //PolygonComplete Handler
  const handlePolygonComplete = useCallback(
    (polygon: google.maps.Polygon) => {
      const path = polygon
        .getPath()
        .getArray()
        .map((latLng) => ({
          lat: latLng.lat(),
          lng: latLng.lng(),
        }));
      setPolygons(path);
    },
    [setPolygons]
  );

  //Overlay ChangeHandler
  const onOverlayComplete = useCallback(
    (changeOverLay: google.maps.drawing.OverlayCompleteEvent) => {
      changeOverLay.overlay?.setMap(null);
    },
    []
  );

  const onEditPolygon = useCallback(() => {
    const polygonRef = polygonRefs.current;
    if (polygonRef) {
      const coordinates = polygonRef
        .getPath()
        .getArray()
        .map((latLng) => ({
          lat: latLng.lat(),
          lng: latLng.lng(),
        }));
      setPolygons(coordinates);
    }
  }, [polygonRefs, setPolygons]);
  const onLoadPolygon = (polygon: google.maps.Polygon) => {
    polygonRefs.current = polygon;
  };

  const mapRef = useRef<google.maps.Map>();

  const onLoadMap = useCallback(
    (map: google.maps.Map) => {
      mapRef.current = map;
    },
    [mapRef]
  );
  const changeHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === '1') {
      setPolygons([
        { lat: 23.0225, lng: 72.5714 },
        { lat: 23.0522, lng: 72.5714 },
        { lat: 23.001, lng: 72.4714 },
      ]);
    }

    if (e.target.value === '2') {
      setPolygons([
        { lat: 23.0395, lng: 72.54222 },
        { lat: 23.00569, lng: 72.54153 },
        { lat: 23.00696, lng: 72.60539 },
        { lat: 23.03919, lng: 72.60367 },
      ]);
    }
  };
  const autocompleteRef = useRef<
    google.maps.places.Autocomplete | google.maps.Map
  >();

  const onLoadAutocomplete = useCallback(
    (autocomplete: google.maps.places.Autocomplete | google.maps.Map) => {
      autocompleteRef.current = autocomplete;
    },
    [autocompleteRef]
  );

  const onPlaceChanged = useCallback(() => {
    const { geometry } = (
      autocompleteRef.current as
        | google.maps.places.Autocomplete
        | google.maps.Map
        | any
    ).getPlace();
    setCenter({ lat: geometry.location.lat(), lng: geometry.location.lng() });

    const bounds = new window.google.maps.LatLngBounds();
    if (geometry.viewport) {
      bounds.union(geometry.viewport);
    } else {
      bounds.extend(geometry.location);
    }
    (mapRef.current as google.maps.Map).fitBounds(bounds);
  }, [setCenter, mapRef]);

  const saveHandler = () => {
    setPolygonsList((prev) => [...prev, [polygons]]);
    setPolygons([]);
  };

  const handleOnLoadPolygon = useCallback((event: google.maps.Polygon) => {
    onLoadPolygon(event);
  }, []);

  return isLoaded ? (
    <div>
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '400px' }}
        zoom={13}
        center={center}
        onLoad={onLoadMap}
      >
        <DrawingManager
          drawingMode={google.maps.drawing.OverlayType.POLYGON}
          onPolygonComplete={handlePolygonComplete}
          onOverlayComplete={onOverlayComplete}
          options={drawingManagerOptions}
        />
        {polygons.length > 0 && (
          <Polygon
            options={polygonOptions}
            paths={polygons}
            onLoad={handleOnLoadPolygon}
            onMouseUp={onEditPolygon}
            editable
          />
        )}

        <Autocomplete
          onLoad={onLoadAutocomplete}
          onPlaceChanged={onPlaceChanged}
        >
          <input
            type='text'
            placeholder='Search Location'
            style={{
              boxSizing: 'border-box',
              border: '1px solid transparent',
              width: '240px',
              height: '38px',
              padding: '0 12px',
              borderRadius: '3px',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
              fontSize: '14px',
              outline: 'none',
              textOverflow: 'ellipses',
              position: 'absolute',
              right: '8%',
              top: '11px',
              marginLeft: '-120px',
            }}
          />
        </Autocomplete>
      </GoogleMap>
      <div>
        <button onClick={saveHandler}>Save</button>
      </div>
      <div>
        <label htmlFor='poly'>SELECT</label>
        <select onChange={(e) => changeHandler(e)} id='poly'>
          <option value='1'>Polygon1</option>
          <option value='2'>Polygon2</option>
        </select>
        <button onClick={() => setPolygons([])}>Clear</button>
      </div>
      <div>
        <ul>
          {polygonList.map(
            (item: { lat: number; lng: number }[][], index: number) =>
              item.map((i) => (
                <div className='coordinates' key={i[0].lat}>
                  <p style={{ fontWeight: 'bold' }}>{index + 1}</p>
                  {i.map((j) => (
                    <p className='listContainer' key={j.lat}>
                      [Lat:{j.lat}, Lng:{j.lng}]
                    </p>
                  ))}
                </div>
              ))
          )}
        </ul>
      </div>
    </div>
  ) : (
    <h1>Loading........</h1>
  );
};

export default Maps;
