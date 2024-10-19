import React, { useEffect } from 'react';

const AmbientBackground: React.FC = () => {
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

    // Fragment shader source (five circles representing the elements with time-based Lissajous curve)
    const fragmentShaderSource = `
      precision mediump float;
      uniform float time;
      uniform vec2 resolution;

      void main() {
        vec2 uv = (gl_FragCoord.xy / resolution.xy) * 2.0 - 1.0;

        // Lissajous curve parameters controlled by time
        float a = 1.0 + sin(time * 0.3);
        float b = 10.0 + cos(time * 0.3);
        float delta = time * 3.0;

        // Lissajous curve calculation
        float curveX = sin(a * uv.x + delta);
        float curveY = sin(b * uv.y);

        // Circle positions and radii for the five elements
        vec2 circle1Pos = vec2(0., 0.5);  // Air
        vec2 circle2Pos = vec2(0., .5);   // Fire
        vec2 circle3Pos = vec2(0.0, .5); // Water
        vec2 circle4Pos = vec2(-0., .5);  // Earth
        vec2 circle5Pos = vec2(-0., .5);   // Aether

        float radius = 0.5;

        // Distance from the current fragment to the center of each circle
        float dist1 = length(uv - circle1Pos);
        float dist2 = length(uv - circle2Pos);
        float dist3 = length(uv - circle3Pos);
        float dist4 = length(uv - circle4Pos);
        float dist5 = length(uv - circle5Pos);

        // Circle intensities influenced by the Lissajous curve
        float circle1Intensity = smoothstep(radius, radius - 0.4, dist1) * (0. + 0.2 * sin(a * uv.x + time));
        float circle2Intensity = smoothstep(radius, radius - 0.4, dist2) * (0. + 0.2 * cos(b * uv.y + time));
        float circle3Intensity = smoothstep(radius, radius - 0.4, dist3) * (0. + 0.2 * sin(a * uv.y + delta+time));
        float circle4Intensity = smoothstep(radius, radius - 0.4, dist4) * (0. + 0.2 * cos(b * uv.x + delta+time));
        float circle5Intensity = smoothstep(radius, radius - 0.4, dist5) * (0. + 0.2 * sin(a * uv.y + b * uv.x+time));

        // Color the circles based on their intensity and element representation
        vec3 circle1Color = vec3(0.5, 0.8, .8) * circle1Intensity;    // Air (light blue)
        vec3 circle2Color = vec3(1.0, 0.5, 0.0) * circle2Intensity;    // Fire (orange-red)
        vec3 circle3Color = vec3(0.0, 0.0, 0.8) * circle3Intensity;    // Water (deep blue)
        vec3 circle4Color = vec3(1.0, 0.5, 0.0) * circle4Intensity;   // Earth (brown-green)
        vec3 circle5Color = vec3(1.0, 0.0, 0.8) * circle5Intensity;    // Aether (purple)

        // Combine the colors of the circles
        vec3 finalColor = circle1Color + circle2Color + circle3Color + circle4Color + circle5Color;

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
      gl.uniform2f(resolutionUniformLocation, canvas.width, canvas.height);  // Pass resolution to fragment shader
    };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Render function (animated using time)
    const render = (time: number) => {
      time *= 0.001;  // Convert to seconds

      // Update the time uniform
      gl.uniform1f(timeUniformLocation, time);

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
  }, []);

  return <canvas id="backgroundCanvas" className="absolute top-0 left-0 w-full h-full z-0" />;
};

export default AmbientBackground;
