      // Vertex shader source (full screen quad)
    export  const vertexShaderSource = `
        attribute vec2 position;
        void main() {
          gl_Position = vec4(position, 0.0, 1.0);  // Full screen quad
        }
      `;
    // Fragment shader source generated from array data
    export const circles = [
      { position: 'vec2(0., curveX)', name: 'Air', color: 'vec3(0.5, 0.8, .8)', dist: 'dist1', intensityFunc: 'sin(a * uv.y + b * uv.x + time)' },
      { position: 'vec2(0., curveY)', name: 'Fire', color: 'vec3(1.0, 0.5, 0.0)', dist: 'dist2', intensityFunc: 'cos(b * uv.x + a * uv.x + time)' },
      { position: 'vec2(0., curve3)', name: 'Water', color: 'vec3(0.0, 0.0, 0.8)', dist: 'dist3', intensityFunc: 'sin(a * uv.x + b * uv.x + delta + time)' },
      { position: 'vec2(0., curve4)', name: 'Earth', color: 'vec3(1.0, 0.5, 0.0)', dist: 'dist4', intensityFunc: 'cos(b * uv.x + a * uv.x + delta + time)' },
      { position: 'vec2(0., 0.)', name: 'Aether', color: 'vec3(1.0, 0.0, 0.8)', dist: 'dist5', intensityFunc: 'sin(a * uv.y + b * uv.x + time)' },
      { position: 'vec2(0.5, curveX)', name: 'Wind', color: 'vec3(0.3, 0.7, 1.0)', dist: 'dist6', intensityFunc: 'cos(a * uv.y + time)' },
      { position: 'vec2(-0.5, curveY)', name: 'Lightning', color: 'vec3(1.0, 1.0, 0.2)', dist: 'dist7', intensityFunc: 'sin(b * uv.x + time)' },
      { position: 'vec2(0.3, curve3)', name: 'Ice', color: 'vec3(0.0, 0.9, 1.0)', dist: 'dist8', intensityFunc: 'cos(a * uv.x + delta + time)' },
      { position: 'vec2(-0.3, curve4)', name: 'Stone', color: 'vec3(0.5, 0.3, 0.2)', dist: 'dist9', intensityFunc: 'sin(b * uv.y + delta + time)' },
      { position: 'vec2(0.2, 0.2)', name: 'Spirit', color: 'vec3(1.0, 0.5, 1.0)', dist: 'dist10', intensityFunc: 'cos(a * uv.x + b * uv.y + time)' },
      { position: 'vec2(-0.2, -0.2)', name: 'Shadow', color: 'vec3(0.1, 0.1, 0.1)', dist: 'dist11', intensityFunc: 'sin(a * uv.x - b * uv.y + time)' },
      { position: 'vec2(0.1, -0.3)', name: 'Light', color: 'vec3(1.0, 1.0, 0.9)', dist: 'dist12', intensityFunc: 'cos(a * uv.y - b * uv.x + delta + time)' }
    ];
