import { doubleClick } from 'ol/events/condition';
import { Draw, Modify, Snap } from 'ol/interaction';
import VectorLayer from 'ol/layer/Vector';
import { Style, Fill, Stroke, Text } from 'ol/style';
import VectorSource from 'ol/source/Vector';

import getPopulation from '../utils/getPopulation';

export default class MeasureTool {
  map;
  source;
  layer;
  modify;
  draw;
  snap;

  constructor(map) {
    this.map = map;

    this.source = new VectorSource();

    this.layer = new VectorLayer({
      source: this.source,
      style: (feature) => {
        const population = feature.get('population') || '';

        measureStyle.getText().setText(population);

        return measureStyle;
      },
    });

    this.source.on('addfeature', ({ feature }) => {
      this.updatePopulation(feature);
    });

    this.modify = new Modify({
      deleteCondition: doubleClick,
      source: this.source,
    });

    this.draw = new Draw({
      source: this.source,
      type: 'Polygon',
    });

    this.snap = new Snap({ source: this.source });

    this.modify.on('modifyend', (event) => {
      const features = event.features.getArray();
      features.forEach((feature) => this.updatePopulation(feature));
    });

    this.draw.on('drawend', () => {
      this.map.removeInteraction(this.draw);
    });
  }

  enable() {
    this.source.clear();
    this.mapAttach();
  }

  disable() {
    this.mapDetach();
  }

  updatePopulation(feature) {
    getPopulation(feature).then((population) =>
      feature.set('population', population)
    );
  }

  mapAttach() {
    this.map.addInteraction(this.modify);
    this.map.addInteraction(this.draw);
    this.map.addInteraction(this.snap);
    this.map.addLayer(this.layer);
  }

  mapDetach() {
    this.map.removeInteraction(this.modify);
    this.map.removeInteraction(this.draw);
    this.map.removeInteraction(this.snap);
    this.map.removeLayer(this.layer);
  }
}

const measureStyle = new Style({
  fill: new Fill({
    color: 'rgba(255, 255, 255, 0.6)',
  }),
  stroke: new Stroke({
    color: '#319FD3',
    width: 1,
  }),
  text: new Text({
    font: '12px Calibri,sans-serif',
    overflow: true,
    fill: new Fill({
      color: '#000',
    }),
    stroke: new Stroke({
      color: '#fff',
      width: 3,
    }),
  }),
});
