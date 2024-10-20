import React, { useEffect, useState } from 'react';
import "tailwindcss/tailwind.css";

const AmbientBackground: React.FC = () => {
  const [variables, setVariables] = useState({
    timeMultiplier: 1.0,
    smoothFactor: 0.5,
    radiusMultiplier: 1.0,
    aMultiplier: 10.0,
    bMultiplier: 20.0,
  });

  const variableConfig = {
    timeMultiplier: { min: 0, max: 10, step: 1 },
    smoothFactor: { min: 0, max: 2, step: 0.1 },
    radiusMultiplier: { min: 0, max: 10, step: 1 },
    aMultiplier: { min: 0, max: 30, step: 1 },
    bMultiplier: { min: 0, max: 50, step: 1 },
  };


  useEffect(() => {
    const canvas = document.getElementById('backgroundCanvas') as HTMLCanvasElement;
    const gl = canvas.getContext('webgl');

    if (!gl) {
      console.error("WebGL not supported.");
      return;
    }

    // Vertex shader source (full screen quad)
    const vertexShaderSource = `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);  // Full screen quad
      }
    `;

    // Fragment shader source generated from array data
    const circles = [
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

    const fragmentShaderSource = `
      precision mediump float;
      uniform float time;
      uniform vec2 resolution;

      void main() {
        vec2 uv = (gl_FragCoord.xy / resolution.xy) * 2.0 - 1.0;

        // Lissajous curve parameters controlled by time
        float a = float(${variables.aMultiplier}) + sin(time * 0.01);
        float b = float(${variables.bMultiplier}) + cos(time * 0.01);
        float delta = time * float(${variables.timeMultiplier});

        // Lissajous curve calculation
        float curveX = sin(a * uv.x);
        float curveY = cos(b * uv.y);
        float curve3 = sin(a * uv.y);
        float curve4 = cos(b * uv.x);

        float radius = (float(${variables.radiusMultiplier}) * (curveX + curveY)) ;

        vec3 finalColor = vec3(0.0);

        ${circles.map((circle, index) => `
        // Circle ${index + 1} (${circle.name})
        vec2 circle${index + 1}Pos = ${circle.position};
        float dist${index + 1} = length(uv - circle${index + 1}Pos);
        float circle${index + 1}Intensity = smoothstep(radius, radius - float(${variables.smoothFactor}), dist${index + 1}) * (0. + 0.42 * ${circle.intensityFunc});
        vec3 circle${index + 1}Color = ${circle.color} * circle${index + 1}Intensity;
        finalColor += circle${index + 1}Color;
        `).join('')}

        gl_FragColor = vec4(finalColor, 1);
      }
    `;

    // Helper function to compile shaders
    const createShader = (gl: WebGLRenderingContext, type: number, source: string) => {
        const shader = gl.createShader(type);
        if (!shader) {
          console.error('Shader creation failed.');
          return null;
        }
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
          console.error('Shader compile failed: ' + gl.getShaderInfoLog(shader));
          gl.deleteShader(shader);
          return null;
        }
        return shader;
      };
  
      // Helper function to create program
      const createProgram = (gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader) => {
        const program = gl.createProgram();
  
        if (!program) {
          console.error('Program creation failed.');
          return null;
        }
  
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
  
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
          console.error('Program failed to link: ' + gl.getProgramInfoLog(program));
          return null;
        }
  
        return program;
      };
  
      const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
      const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
  
      if (!vertexShader || !fragmentShader) {
        return;
      }
  
      const program = createProgram(gl, vertexShader, fragmentShader);
      if (!program) {
        return;
      }
      gl.useProgram(program);
  
      // Define a full screen quad (plane covering the screen)
      const vertices = new Float32Array([
        -1, -1,
         1, -1,
        -1,  1,
         1,  1,
      ]);
  
      const buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  
      const positionAttributeLocation = gl.getAttribLocation(program, "position");
      gl.enableVertexAttribArray(positionAttributeLocation);
      gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
  
      // Uniform locations
      const timeUniformLocation = gl.getUniformLocation(program, "time");
      const resolutionUniformLocation = gl.getUniformLocation(program, "resolution");
  
      // Resize the canvas
      const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.useProgram(program);
        gl.uniform2f(resolutionUniformLocation, canvas.width, canvas.height);  // Pass resolution to fragment shader
      };
      window.addEventListener('resize', resizeCanvas);
      resizeCanvas();
  
      // Render function (animated using time)
      const render = (time: number) => {
        time *= 0.001;  // Convert to seconds
  
        gl.useProgram(program);  // Ensure the correct program is used
  
        // Update the time uniform
        if (timeUniformLocation) {
          gl.uniform1f(timeUniformLocation, time * variables.timeMultiplier);
        }
  
        // Clear the canvas (white background)
        gl.clearColor(1.0, 1.0, 1.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
  
        // Draw the fullscreen quad
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  
        requestAnimationFrame(render);
      };
      requestAnimationFrame(render);
  
      return () => {
        window.removeEventListener('resize', resizeCanvas);
      };
    }, [variables]);
  
    return(
    <>
    <canvas id="backgroundCanvas" className="absolute top-0 left-0 w-full h-full z-0" />
    <div className="relative top-0 left-0 m-0 p-4 bg-white bg-opacity-75 rounded-md shadow-lg z-10">
      <h3 className="text-lg font-semibold mb-4">Control Panel</h3>
      {Object.keys(variables).map((key) => (
      <div key={key} className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">{key}</label>
        <input
          type="range"
          min={variableConfig[key as keyof typeof variableConfig].min}
          max={variableConfig[key as keyof typeof variableConfig].max}
          step={variableConfig[key as keyof typeof variableConfig].step}
          value={variables[key as keyof typeof variables]}
          onChange={(e) => {
          const newValue = parseFloat(e.target.value);
          setVariables((prev) => ({ ...prev, [key]: newValue }));
        }}
          className="w-full"
        />
      </div>
    ))}
    </div>
    </>
    )
  
  };
  
  export default AmbientBackground;
  