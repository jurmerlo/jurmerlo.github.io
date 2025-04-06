---
title: Lunas Game Engine Introduction
date: 2025-04-06
prev: false
next: false
tags: [lunas]
excerpt: Introducing Lunas, a lightweight and flexible 2D game engine built with TypeScript and WebGL. Follow along as I document its development, from core features to plugin extensions. [read more](2025-04-06_lunas_start)
---

## A New Game Engine
I have been planning to create the next iteration of my game engine for a while. This time, I want to blog about its development, explaining how it works and why. I'm calling the engine "Lunas." Below are the requirements I have outlined for the engine.

### Requirements

- **2D**  
2D is easier to implement and maintain. Since I only make 2D games, there is no need for 3D support.

- **Flexible**  
I want a small, core engine that is easy to extend. Asset management, events, the update loop, rendering, and input will form the core. Everything else will be implemented as plugin libraries.

- **Easy to Use**  
The engine's structure should make it easy to get started with a game while allowing users to structure their games as they see fit.

- **Web-First**  
I create small games that I want to be easy to publish on a website. Tools like [Capacitor](https://capacitorjs.com) and [Electron](https://www.electronjs.org) can be used to publish native apps if needed.

- **TypeScript**  
For a web-based game engine, TypeScript makes sense to me. I prefer using types as they help catch bugs and make the code easier to read.

- **WebGL**  
I want to use shaders and good performance. Since WebGPU is not ready yet, WebGL is the best option for now.

### Plugins

Here are some plugins I plan to create for Lunas to extend the core functionality:

- **Scene System**  
A scene is a container for the current state of the game, such as a menu scene or a level scene. A scene will include cameras and entities to simplify displaying and updating elements on the screen.

- **Sprite Atlas and Animation**  
Support for loading and using sprite atlases and animations.

- **Collision**  
A simple AABB physics collision system.

- **Box2D**  
A wrapper around a TypeScript port of the Box2D physics engine.

- **Tweening**  
Support for value tweening over time.

- **Tilemap**  
Tilemap support for formats like Tiled and LDtk. This could involve multiple separate plugins.

There will likely be more plugins I think of during development of the engine.

## Next Steps
In the next post, I will cover setting up the project and laying the groundwork for the engine.