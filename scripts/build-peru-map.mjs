import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

// Reuses the department geometry and projection from the local "Regionales 2026" project.
// Usage: node scripts/build-peru-map.mjs "/path/to/peru-departamentos.geojson"
const input = process.argv[2];
if (!input) {
  console.error('Pass the path to peru-departamentos.geojson');
  process.exit(1);
}

const source = JSON.parse(await readFile(resolve(input), 'utf8'));
const features = source.features ?? [];
const width = 620;
const height = 570;
const padding = 24;
const positions = [];
const flatten = (node) => {
  if (Array.isArray(node) && typeof node[0] === 'number' && typeof node[1] === 'number') positions.push(node);
  else if (Array.isArray(node)) node.forEach(flatten);
};
features.forEach((feature) => flatten(feature.geometry.coordinates));

const xs = positions.map(([x]) => x);
const ys = positions.map(([, y]) => y);
const minX = Math.min(...xs);
const maxX = Math.max(...xs);
const minY = Math.min(...ys);
const maxY = Math.max(...ys);
const scale = Math.min((width - padding * 2) / (maxX - minX), (height - padding * 2) / (maxY - minY));
const offsetX = (width - (maxX - minX) * scale) / 2;
const offsetY = (height - (maxY - minY) * scale) / 2;
const project = ([x, y]) => [offsetX + (x - minX) * scale, offsetY + (maxY - y) * scale];
const pathFor = (feature) => {
  const polygons = feature.geometry.type === 'Polygon' ? [feature.geometry.coordinates] : feature.geometry.coordinates;
  return polygons.map((polygon) => polygon.map((ring) => ring.map((position, index) => {
    const [x, y] = project(position);
    return `${index === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`;
  }).join(' ') + ' Z').join(' ')).join(' ');
};
const escape = (value) => String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[character]);
const paths = features.map((feature) => {
  const name = feature.properties?.NOMBDEP || 'Departamento';
  return `  <path d="${pathFor(feature)}"><title>${escape(name)}</title></path>`;
}).join('\n');
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="map-title">\n  <title id="map-title">Mapa de departamentos del Perú</title>\n  <g fill="#e9e3d7" fill-rule="evenodd" stroke="#c3b9a8" stroke-width=".8" stroke-linejoin="round">\n${paths}\n  </g>\n</svg>\n`;
const output = resolve('assets/peru-regiones.svg');
await writeFile(output, svg);
console.log(`Created ${output} from ${features.length} departments`);
for (const [name, coordinates] of Object.entries({ Lima: [-77.0428, -12.0464], Chiclayo: [-79.8409, -6.7714], Cusco: [-71.9675, -13.5319], Pucallpa: [-74.5539, -8.3791] })) {
  console.log(`${name}: ${project(coordinates).map((value) => value.toFixed(1)).join(', ')}`);
}
