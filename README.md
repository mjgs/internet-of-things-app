# drones-app

## Description

A company has a number of drones flying around the country. You have been tasked to build a system to track the location of every drone in real-time.

## Assumptions & System Explanations

## Installation

### Create env files

```
cp .env.sample .env.dev
cp .env.sample .env.prod
cp .env.sample .env.test
```

Update env variables as necessary.

### Running locally

```
npm install
NODE_ENV=production npm start
```

### Running containerized

```
NODE_ENV=production npm run docker
```

### Loading the dashboard and creating some fake devices

With the application running, load in a webrowser:

```
https://localhost:3000
```

You should see an empty dashboard table.

Open the browser devtools (alt-option-i), select the devtools console tab.

Copy & paste the following code into the console and hit enter:

```
const things = ['Rock', 'Paper', 'Scissor'];
function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
const socket = new WebSocket('ws://localhost:3000');
socket.addEventListener('message', function (event) {
  console.log('Message from server ', event.data);
});
socket.addEventListener('open', function (event) {
  socket.send(`uuid:${uuidv4()}:${things[Math.floor(Math.random()*things.length)]}`);
});
```

Reload the dashboard page, and you should see an entry in the table.
Every time you run the code snippet you will see an additional item added to the table.

The code snippet connects to the websokcets server, sends an update with some data, that data is then stored on the server, and when you load the dashboard it is rendered into the page.

## Debugging

The app uses the [debug](https://github.com/visionmedia/debug) module, with debug namespace set to file path.
To enable debug logging in all app files and all test files:

```
DEBUG=lb:*,test:*
```

To run the code in vscode debugger in the root of the project:

```
//.vcode/launch.json
{
  // Use IntelliSense to learn about possible attributes.
  // Hover to view descriptions of existing attributes.
  // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "npm run debug:start",
      "runtimeExecutable": "npm",
      "runtimeArgs": [
        "run-script",
        "debug:start"
      ],
      "port": 9229,
      "outputCapture": "std"
    }
  ]
}
```

Add configurations for the other debug npm-scripts in package.json, set a breakpoint somewhere near the start of the code (app.js is a good place) by clicking in the margin to the left of the line numbers (a red dot should appear).

Then in vscode:

- Click "Run And Debug" button
- Select a launch configuration from the dropdown list
- Click "Start Debugging" button

You should also be able to debug the tests, just make sure to set the breakpoint near the start of the test file.

## Testing

To run all the test suites:

```
npm test
```

There are also npm-scripts in package.json setup to run individual test suites.