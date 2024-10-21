import React, { useEffect, useRef, useState } from 'react';
import { useIndex } from './IndexContext';
import ControlPanel from './ControlPanel';
import "tailwindcss/tailwind.css";

const AmbientBackground: React.FC = () => {
  const { variables } = useIndex();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [exportClicked, setExportClicked] = useState(false);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const shaderProgramRef = useRef<WebGLProgram | null>(null);
  const timeUniformLocationRef = useRef<WebGLUniformLocation | null>(null);
  const resolutionUniformLocationRef = useRef<WebGLUniformLocation | null>(null);

  const render = (time: number) => {
    const gl = glRef.current;
    const shaderProgram = shaderProgramRef.current;
    const timeUniformLocation = timeUniformLocationRef.current;

    if (!gl || !shaderProgram) return;

    time *= 0.001; // Convert to seconds
    gl.useProgram(shaderProgram);

    // Update the time uniform
    if (timeUniformLocation) {
      gl.uniform1f(timeUniformLocation, time * variables.timeMultiplier);
    }

    gl.clear(gl.COLOR_BUFFER_BIT);

    // Draw the fullscreen quad
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    // Check if export is clicked
    if (exportClicked === true && canvasRef.current) {
      setExportClicked(false)
      const image = canvasRef.current.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = "canvas_export.png";
      link.click();   
    }
    if (!exportClicked) requestAnimationFrame(render);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl');
    if (!gl) {
      console.error("WebGL not supported.");
      return;
    }

    glRef.current = gl;

    // Vertex Shader Source
    const vertexShaderSource = `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);  // Full screen quad
      }
    `;

    // Fragment Shader Source
    const circles = [
      { position: 'vec2(0., curveX)', color: 'vec3(0.5, 0.8, .8)', intensityFunc: 'sin(a * uv.y + b * uv.x + time)' },
      { position: 'vec2(0., curveY)', color: 'vec3(1.0, 0.5, 0.0)', intensityFunc: 'cos(b * uv.x + a * uv.x + time)' },
      { position: 'vec2(0., curve3)', color: 'vec3(0.0, 0.0, 0.8)', intensityFunc: 'sin(a * uv.x + b * uv.x + delta + time)' },
      { position: 'vec2(0., curve4)', color: 'vec3(1.0, 0.5, 0.0)', intensityFunc: 'cos(b * uv.x + a * uv.x + delta + time)' },
      { position: 'vec2(0., 0.)', color: 'vec3(1.0, 0.0, 0.8)', intensityFunc: 'sin(a * uv.y + b * uv.x + time)' },
      { position: 'vec2(0.5, curveX)', color: 'vec3(0.3, 0.7, 1.0)', intensityFunc: 'cos(a * uv.y + time)' },
      { position: 'vec2(-0.5, curveY)', color: 'vec3(1.0, 1.0, 0.2)', intensityFunc: 'sin(b * uv.x + time)' },
      { position: 'vec2(0.3, curve3)', color: 'vec3(0.0, 0.9, 1.0)', intensityFunc: 'cos(a * uv.x + delta + time)' },
      { position: 'vec2(-0.3, curve4)', color: 'vec3(0.5, 0.3, 0.2)', intensityFunc: 'sin(b * uv.y + delta + time)' },
      { position: 'vec2(0.2, 0.2)', color: 'vec3(1.0, 0.5, 1.0)', intensityFunc: 'cos(a * uv.x + b * uv.y + time)' },
      { position: 'vec2(-0.2, -0.2)', color: 'vec3(0.1, 0.1, 0.1)', intensityFunc: 'sin(a * uv.x - b * uv.y + time)' },
      { position: 'vec2(0.1, -0.3)', color: 'vec3(1.0, 1.0, 0.9)', intensityFunc: 'cos(a * uv.y - b * uv.x + delta + time)' }
    ];

    const fragmentShaderSource = `
      precision mediump float;
      uniform float time;
      uniform vec2 resolution;

      void main() {
        vec2 uv = (gl_FragCoord.xy / resolution.xy) * 2.0 - 1.0;

        // Lissajous curve parameters controlled by time
        float a = float(${variables.aMultiplier}) + sin(time * 0.1);
        float b = float(${variables.bMultiplier}) + cos(time * 0.1);
        float delta = time * float(${variables.timeMultiplier});

        // Lissajous curve calculation
        float curveX = sin(a * uv.x);
        float curveY = cos(b * uv.y);
        float curve3 = sin(a * uv.y);
        float curve4 = cos(b * uv.x);

        float radius = float(${variables.radiusMultiplier}) * (curveY);

        vec3 finalColor = vec3(0.0);

        ${circles.map((circle, index) => `
        // Circle ${index + 1}
        vec2 circle${index + 1}Pos = ${circle.position};
        float dist${index + 1} = length(uv - circle${index + 1}Pos);
        float circle${index + 1}Intensity = smoothstep(radius, radius - float(${variables.smoothFactor}), dist${index + 1}) * (0. + 0.4 * ${circle.intensityFunc});
        vec3 circle${index + 1}Color = ${circle.color} * circle${index + 1}Intensity;
        finalColor += circle${index + 1}Color;
        `).join('')}

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    // Helper function to compile shaders
    const createShader = (gl: WebGLRenderingContext, type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;

      gl.shaderSource(shader, source);
      gl.compileShader(shader);

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("An error occurred compiling the shaders:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }

      return shader;
    };

    // Helper function to create program
    const createProgram = (gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader) => {
      const program = gl.createProgram();
      if (!program) return null;

      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);

      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error("Unable to initialize the shader program:", gl.getProgramInfoLog(program));
        return null;
      }

      return program;
    };

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    if (!vertexShader || !fragmentShader) return;

    const shaderProgram = createProgram(gl, vertexShader, fragmentShader);
    if (!shaderProgram) return;

    shaderProgramRef.current = shaderProgram;
    gl.useProgram(shaderProgram);

    // Define a full screen quad
    const vertices = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
       1,  1,
    ]);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const positionAttributeLocation = gl.getAttribLocation(shaderProgram, "position");
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    // Uniform Locations
    timeUniformLocationRef.current = gl.getUniformLocation(shaderProgram, "time");
    resolutionUniformLocationRef.current = gl.getUniformLocation(shaderProgram, "resolution");

    // Resize the canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.useProgram(shaderProgram);
      if (resolutionUniformLocationRef.current) {
        gl.uniform2f(resolutionUniformLocationRef.current, canvas.width, canvas.height);
      }
    };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [variables]);

  useEffect(() => {
    requestAnimationFrame(render);
  }, [variables, exportClicked]);

  const handleExport = () => {
    setExportClicked(true);
  };

  return (
    <>
      <canvas ref={canvasRef} id="backgroundCanvas" className="w-full h-full absolute top-0 left-0" />
      <ControlPanel />
      <button onClick={handleExport} className="relative bottom-5 right-5 bg-blue-500 text-white py-2 px-4 rounded">Export Frame</button>
    </>
  );
};

export default AmbientBackground;
