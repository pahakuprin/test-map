import React, { useState, useEffect, useRef } from 'react';
import TileLayer from 'ol/layer/Tile';
import Map from 'ol/Map';
import { fromLonLat } from 'ol/proj';
import XYZ from 'ol/source/XYZ';
import View from 'ol/View';

import MeasureTool from '../tools/MeasureTool';

export default function MapContainer() {
  const [map, setMap] = useState(null);
  const [measureMode, setMeasureMode] = useState(false);
  const [measureTool, setMeasureTool] = useState(null);

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

    const measureTool = new MeasureTool(map);

    setMap(map);
    setMeasureTool(measureTool);

    return () => map.setTarget(null);
  }, []);

  useEffect(() => {
    const handleKeydown = (event) => {
      if (event.code === 'Space') {
        if (measureMode) {
          measureTool.disable();
        } else {
          measureTool.enable();
        }

        setMeasureMode(!measureMode);
      }

      if (event.code === 'Escape') {
        if (measureMode) {
          measureTool.disable();
          measureTool.enable();
        }
      }
    };

    window.addEventListener('keydown', handleKeydown);

    return () => window.removeEventListener('keydown', handleKeydown);
  }, [measureMode, map, measureTool]);

  return <div ref={mapRef} className='map-container'></div>;
}
