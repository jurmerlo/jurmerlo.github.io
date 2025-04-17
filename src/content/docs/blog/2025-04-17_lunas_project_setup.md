---
title: Lunas Project Setup
date: 2025-04-17
prev: false
next: false
tags: [lunas]
---

In my last post I wrote about the requirements for Lunas. It will be a web first game engine in TypeScript. I will use 
[Node.js](https://nodejs.org/en), [Pnpm](https://pnpm.io) and [Vite](https://vite.dev) to build the engine. There are 
some other dev dependencies like prettier and eslint, but I'm not using any dependencies for the engine core.

### Pnpm
I'm using Pnpm because it is faster than npm and caches libraries across projects. It is a personal preference. 

### Vite
Bundling with Vite is not really necessary as this library will be used inside a game project so why am I using Vite?  
In previous iterations I always needed a separate project to see if the engine works correctly while working on it. 
With Vite I can setup a project to run with the dev server, but export only the engine library when publishing. This 
way I can have both in the same project.

The project structure looks like this:

```
src
  ├─ game
  │ └─ main.ts
  └─ lunas
    └─ index.ts
```
The `game` folder is used for testing. Everything in the `lunas` folder is exported when building the engine.


To make this work I have `vite.config.ts` that looks like this:
```ts
import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    copyPublicDir: false,
    lib: {
      entry: resolve(__dirname, 'src/lunas/index.ts'),
      formats: ['es'],
      fileName: 'lunas',
    },
  },
  plugins: [dts({ include: 'src/lunas', rollupTypes: true })],
});
```

Using the `index.ts` inside the lunas folder to as entry point and only export the types inside the `lunas` folder.

I also have an extra tsconfig called `tsconfig.build.json`:
```json
{
  "extends": "./tsconfig.json",
  "include": ["src/lunas"]
}
```

This is used for `tsc` in the build script in the `package.json`.
```json
"build": "tsc -p tsconfig.build.json && vite build",
```

### Game Loop
If want the core engine to be callback based. So you can add your own functions to be called each `update` and `draw` etc. 
For now I added a quick game loop using `requestAnimationFrame`. Getting a WebGL renderer up and running will take some time so 
for now I'm just clearing the screen. This is what the game class looks like for now:
```ts
/**
 * The main game class that handles the game loop and rendering.
 */
export class Game {
  /**
   * The time of the last update in milliseconds.
   */
  private lastFrameTime = 0;

  /**
   * The WebGL2 rendering context.
   */
  private gl: WebGL2RenderingContext;

  /**
   * Create and start the game.
   */
  constructor() {
    const canvas = document.getElementById('lunasCanvas') as HTMLCanvasElement;
    if (!canvas) {
      throw new Error('Canvas element with id "lunasCanvas" not found');
    }

    this.gl = this.getGLContext(canvas);

    // Start the game loop.
    requestAnimationFrame(() => {
      this.lastFrameTime = performance.now();
      this.loop();
    });
  }

  /**
   * The main game loop that updates and draws the game.
   * This method is called every frame.
   */
  private loop(): void {
    const now = performance.now();
    const timePassed = now - this.lastFrameTime;
    this.lastFrameTime = now;

    const dt = timePassed / 1000; // Convert to seconds
    this.update(dt);
    this.draw();

    requestAnimationFrame(() => this.loop());
  }

  /**
   * Update the game state.
   * @param _dt The time passed since the last frame in seconds.
   */
  private update(_dt: number): void {
    // Update game logic here
  }

  /**
   * Draw the game.
   */
  private draw(): void {
    // For now we will just clear the screen with a color.
    this.gl.clearColor(0, 0, 0, 1);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    // Draw the game here.
  }

  /**
   * Get the WebGL2 rendering context from the canvas.
   * If WebGL2 is not supported, it falls back to WebGL.
   * @param canvas The canvas element to get the context from.
   * @returns The WebGL2 rendering context.
   */
  private getGLContext(canvas: HTMLCanvasElement): WebGL2RenderingContext {
    let gl = canvas.getContext('webgl2') as WebGL2RenderingContext;

    // WebGL2 is not supported, try WebGL.
    if (!gl) {
      gl = canvas.getContext('webgl') as WebGL2RenderingContext;
      if (!gl) {
        throw new Error('Unable to initialize WebGL context.');
      }
    }

    return gl;
  }
}
```

The WebGL context will be separated out of the game class in the future. If you want you can look at the source [here](https://github.com/lunas-engine/lunas-core/tree/v0.0.1). This is the code at the point of when this post was written.

## Next Steps
Next I want to setup dependency injection with decorators, setup the callback system and maybe start on the renderer.