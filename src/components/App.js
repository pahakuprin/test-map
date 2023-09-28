import { Fragment, useEffect, useState } from 'react';

import { MOVE_TOOL, MEASURE_TOOL } from '../constants';
import MeasureTool from '../tools/MeasureTool';

import MapContainer from './MapContainer';
import SideBar from './SideBar';

export default function App() {
  const [map, setMap] = useState(null);
  const [measureTool, setMeasureTool] = useState(null);
  const [currentTool, setCurrentTool] = useState(MOVE_TOOL);

  useEffect(() => {
    if (!map) return;
    const measureTool = new MeasureTool(map);
    setMeasureTool(measureTool);
  }, [map]);

  useEffect(() => {
    switch (currentTool) {
      case MOVE_TOOL:
        measureTool?.disable();
        break;
      case MEASURE_TOOL:
        measureTool?.enable();
        break;
      default:
    }
  }, [currentTool, measureTool]);

  useEffect(() => {
    const handleKeydown = (event) => {
      if (['Backspace', 'Delete'].includes(event.code)) {
        if (currentTool === MEASURE_TOOL) {
          measureTool?.disable();
          measureTool?.enable();
        }
      }

      if (['KeyV', 'Escape'].includes(event.code)) {
        setCurrentTool(MOVE_TOOL);
      }

      if (event.code === 'KeyM') {
        setCurrentTool(MEASURE_TOOL);
      }
    };

    window.addEventListener('keydown', handleKeydown);

    return () => window.removeEventListener('keydown', handleKeydown);
  }, [currentTool, measureTool]);

  return (
    <Fragment>
      <MapContainer setMap={setMap} />
      <SideBar currentCursor={currentTool} onChange={setCurrentTool} />
    </Fragment>
  );
}
