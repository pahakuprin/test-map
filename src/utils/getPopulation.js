import GeoJSON from 'ol/format/GeoJSON';

export default async function getPopulation(feature) {
  const converter = new GeoJSON({
    dataProjection: 'EPSG:4326',
    featureProjection: 'EPSG:3857',
  });

  const geojson = converter.writeFeatures([feature]);

  return fetch(
    `https://gis01.rumap.ru/4898/areaStatistics?guid=${process.env.REACT_APP_GUID}&geojson=${geojson}&geometry=1`
  )
    .then((response) => response.json())
    .then(({ population_rsv }) => {
      const population = population_rsv?.toString() || '';

      return population;
    });
}
