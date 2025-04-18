---
title: Lunas Dependency Injection and Callback System
date: 2025-04-18
prev: false
next: false
tags: [lunas]
---

## Dependency Injection
In game engines, there are some systems that are used in many different places, such as the asset manager, audio system, and event system. To make these available, you can use different approaches:
- Passing them through the constructor.
- Using a singleton for each or all systems.
- Making them global static classes.
- Using dependency injection.

Many engines use singletons or globals. However, using them can make debugging more difficult because it is not always clear where in the game classes they are being used.  
Passing dependencies through the constructor is also not ideal, as it can lead to constructors with too many parameters.

I use a combination of these approaches with my version of dependency injection. I use a decorator called `@inject` to convert a class field into a getter that retrieves the dependency from a container. This way, I can see at the top of the class which dependencies are being used.  
Before TypeScript 5, constructor decorators were available, but now field decorators are the only option.

### The Dependency Container
The dependency container is a class with static methods that allow adding, getting, and removing services by a string name:
```ts title="src/lunas/di/service.ts"
export class Service {
  private static readonly CONTAINER: Record<string, any> = {};

  static get(name: string): any {
    const service = Service.CONTAINER[name];

    if (!service) {
      throw new Error(`Error: Service "${name}" does not exist.`);
    }

    return service;
  }

  static add(name: string, service: any): void {
    Service.CONTAINER[name] = service;
  }

  static remove(name: string): void {
    if (Service.CONTAINER[name]) {
      delete Service.CONTAINER[name];
    }
  }

  static clear(): void {
    for (const name in Service.CONTAINER) {
      delete Service.CONTAINER[name];
    }
  }
}
```
This is still global static access, but we won't use it directly in this way.

### The Inject Decorator
I use a simple decorator function that can use the field name or a specified name to retrieve the required service:
```ts title="src/lunas/di/inject.ts"
import { Service } from './service';

export function inject(name?: string) {
  return (_value: undefined, context: ClassMemberDecoratorContext): (() => any) | undefined => {
    if (context.kind === 'field') {
      // Use passed in name or else the field name.
      const serviceName = name || (context.name as string);

      // Return a getter function that returns the required service.
      return (): any => {
        return Service.get(serviceName);
      };
    }

    return;
  };
}
```

### Example
The following code demonstrates how to use this to inject services into a class:
```ts title="example.ts"
// Small service that returns the provided string.
class TestService {
  private testValue: string;

  constructor(testValue: string) {
    this.testValue = testValue;
  }

  testMethod(): string {
    return this.testValue;
  }
}

// Other service that returns the provided number.
class TestService2 {
  private value: number;

  constructor(value: number) {
    this.value = value;
  }

  testMethod2(): number {
    return this.value;
  }
}

// Add the services to the container.
Service.add('testService', new TestService('this is a test'));
Service.add('testService2', new TestService2(42));

class TestGame {
  @inject() // use the field name to inject the service.
  private testService!: TestService;

  @inject('testService2') // Pass the service name into the decorator so you can use a different field name.
  private otherName!: TestService2;

  constructor() {
    console.log(this.testService.testMethod());
    console.log(this.otherName.testMethod2());
  }
}

new TestGame();
```
One downside of using field injection like this is that you have to use the exclamation mark (`!`) after the fields to disable TypeScript's null checking. The fields are not set in the constructor; they are injected, but TypeScript does not recognize this.

## Engine Callbacks
In previous iterations of my game engine, I always included a scene or stage system to switch between different states in the game. This time, I want to make the core more lightweight and move these systems into a plugin. This requires a way to access the update and draw loops, as well as other events. I use callbacks where you can add one or more functions per type, and these will be called when the relevant event is triggered.

The callback type looks like this:
```ts title="src/lunas/game.ts"
type GameCallback = {
  update: (dt: number) => void;
  draw: () => void;
  onFocus: () => void;
  onBlur: () => void;
  onResize: (width: number, height: number) => void;
};
```
This allows for typed callbacks using the key together with the function. I added `addCallback` and `removeCallback` methods to the game class, which are called when the relevant events are triggered:
```ts title="src/lunas/game.ts"
addCallback<T extends keyof GameCallback>(type: T, callback: GameCallback[T]): void {
  this.callbacks[type].push(callback);
}

removeCallback<T extends keyof GameCallback>(type: T, callback: GameCallback[T]): void {
  const index = this.callbacks[type].indexOf(callback);
  if (index !== -1) {
    this.callbacks[type].splice(index, 1);
  }
}
```

### Example
Here is an example of how to use this:
```ts title="example.ts"
import { Game } from '../lunas';

const game = new Game();

// Creating the function to use for the callback.
const updateObjects = (dt: number): void => {
  console.log(dt);
};

const drawObjects = (): void => {
  console.log('drawing');
};

// Adding the typed callback functions. If you try to add drawObjects to the update callback you will see an error.
game.addCallback('update', updateObjects);
game.addCallback('draw', drawObjects);
```

Using callbacks allows different plugins to use the engine loop and events as needed. 

## The Source Code
 If you're interested, you can check out the source at [here](https://github.com/lunas-engine/lunas-core/tree/v0.0.2). This is the code as it was at the time of writing this post.

## Next Steps
Next, I plan add some math classes and start on the renderer.