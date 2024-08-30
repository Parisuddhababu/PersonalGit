import Map, { FullscreenControl, GeolocateControl, NavigationControl, ScaleControl } from "react-map-gl";
import { intitalMapValue, MapHeightWidth, MAP_BOX_API_TOKEN, MAP_STYLE } from "../../config";

const NormalMap = () => {
  return (
    <Map
        initialViewState={intitalMapValue}
        mapStyle={MAP_STYLE}
        attributionControl={false}
        mapboxAccessToken={MAP_BOX_API_TOKEN}
        style={MapHeightWidth}
      >
        <GeolocateControl />
        <FullscreenControl />
        <NavigationControl />
        <ScaleControl />
      </Map>
  );
};

export default NormalMap;
