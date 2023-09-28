import { useEffect, useRef } from 'react';
import TileLayer from 'ol/layer/Tile';
import Map from 'ol/Map';
import { fromLonLat } from 'ol/proj';
import XYZ from 'ol/source/XYZ';
import View from 'ol/View';

export default function MapContainer({ setMap }) {
  const mapRef = useRef(null);

  useEffect(() => {
    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new XYZ({
            url: `http://tile.digimap.ru/rumap/{z}/{x}/{y}.png?guid=${process.env.REACT_APP_GUID}`,
          }),
        }),
      ],
      view: new View({
        center: fromLonLat([37.618423, 55.751244]),
        zoom: 8,
      }),
      controls: [],
    });

    setMap(map);

    return () => map.setTarget(null);
  }, [setMap]);

  return <div ref={mapRef} className='map-container'></div>;
}
