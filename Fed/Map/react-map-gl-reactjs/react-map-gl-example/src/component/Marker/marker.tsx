import Map, { FullscreenControl, GeolocateControl, NavigationControl, ScaleControl } from "react-map-gl";
import { intitalMapValue, MapHeightWidth, MAP_BOX_API_TOKEN, MAP_STYLE } from "../../config";
import Pin from "./pin";

const Marker = () => {
  return (
    <Map
        initialViewState={intitalMapValue}
        mapStyle={MAP_STYLE}
        mapboxAccessToken={MAP_BOX_API_TOKEN}
        style={MapHeightWidth}
      >
        <GeolocateControl position="top-left" />
        <FullscreenControl position="top-left" />
        <NavigationControl position="top-left" />
        <ScaleControl />

        <Pin />

      </Map>
  )
}

export default Marker;