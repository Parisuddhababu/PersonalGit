import { useCallback, useState } from 'react';
import { Marker, Popup } from 'react-map-gl';
import CITIES from '../../mock_data/cities.json';
import MarkerIcon from '../common/markerIcon';

const CityMarker = ({ city, onClick }: any) => {
  return (
    <Marker
      key={`marker-${city.city}`}
      longitude={city.longitude}
      latitude={city.latitude}
      anchor='bottom'
      onClick={onClick(city)}
    >
      <MarkerIcon />
    </Marker>
  );
};

const Pin = () => {
  const [popupInfo, setPopupInfo] = useState<any>(null);
  const handleMarkerClick = useCallback((e: any, city: any) => {
    e.originalEvent.stopPropagation();
    setPopupInfo(city);
  }, []);
  const handlePopupClick = useCallback(() => {
    setPopupInfo(null);
  }, []);
  return (
    <>
      {CITIES.map((city, index) => {
        return (
          <CityMarker
            key={`marker-${city.city}`}
            city={city}
            onClick={handleMarkerClick}
          />
        );
      })}

      {popupInfo && (
        <Popup
          anchor='top'
          longitude={Number(popupInfo.longitude)}
          latitude={Number(popupInfo.latitude)}
          onClose={handlePopupClick}
        >
          <div>City Name: {popupInfo.city}</div>
          <div>Total Area: {popupInfo.area}</div>
        </Popup>
      )}
    </>
  );
};

export default Pin;
