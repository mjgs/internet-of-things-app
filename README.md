# internet-of-things-app

## Description

This project is minimal example of an Internet of Things (IOT) application. The scenario is one where there are devices that are geographically distributed and are moving, so could be delivery or perhaps passenger vehicles. The application receives data updates from devices, proceses the data and then displays the data. In this specific example the device speed is calculated. Generally speaking it is a way to collect and process realtime data.

![internet-of-things-app Dashboard](https://i.postimg.cc/rsKJp1SN/Dashboard.png)

## Assumptions

Some assumptions were made:

- The devices have tcp/ip connectivity to each other over a mobile network
- The devices are on a private network for security reasons
- The app is an ExpressJS server, which also run a websockets server
- The devices send updates every 10 seconds

## System Explanation

Since updates from the devices will happen over a mobile network and in realtime, it is expected that there will be many very small updates sent. Conventional REST/JSON apis need to negotiate the connection for each update and could result in much higher volumes of data being sent, which could be very expensive over time on mobile networks. For this reason the implementation uses a websockets api since this protocol only negotiates connection once at the start, which saves significantly on bandwidth over time.

The devices connect to the websockets server, get assigned a unique identifier, and send geo positioning updates to the server. The server receives the updates, validates the format is as expected, calculates the device speed based on current and previous data set, and saves all this data to a datastore.

When the dashboard page is loaded via the ExpressJS webserver, it fetches the data from the datastore and renders the page, highlighting any devices that have not moved more than 1 meter since the previous device update.

Code structure:

```
bin                     
  npm-scripts  - build scripts
  www          - main entry point that imports and runs app.js
lib
  config       - system configuration
  controllers  - express server controllers used in routes
  middleware   - express server middleware used in routes
  routes       - express routes loaded in app.js
  utils        - business logic used in controllers
  views        - ejs templates used by express to render html pages
  app.js       - main app
test 
  unit         - unit tests
  integration  - integration tests
```

The code base has unit and integration tests and code coverage pretty close to 100%. There are a few branch else conditions that are not exercised because the code flow does not require these branches.

```
=============================== Coverage summary ===============================
Statements   : 100% ( 201/201 )
Branches     : 93.33% ( 56/60 )
Functions    : 100% ( 17/17 )
Lines        : 100% ( 184/184 )
================================================================================
```

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

You should see an empty dashboard table. This is page 1.

Open another browser tab to the same address and load the page again. In this tab, open the browser devtools (alt-option-i), select the devtools console tab. This is page 2.

Copy & paste the following code into the console and hit enter:

```
function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
let lat = '50.1234';
let long = '55.1234';
const uuid = uuidv4();
const socket = new WebSocket('ws://localhost:3000');
socket.addEventListener('message', function (event) {
  console.log('Message from server ', event.data);
});
socket.addEventListener('open', function (event) {
  socket.send(`uuid:${uuid}:${lat}:${long}`);
});
```

Reload the dashboard page on Page 1, and you should see an entry in the table. The code snippet connects to the websokcets server, sends an update with some data, that data is then stored on the server, and when you load the dashboard it is rendered into the page. The speed is zero because there has only been one data point so far.

To send another data point from the device run this code in Page 2 devtools console:

```
lat = '51.1234';
long = '56.1234';
socket.send(`uuid:${uuid}:${lat}:${long}`);
```

Repeat this two step process in a new browser tab to add additional devices.

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

## Improvements

- Better device simulation - use a job scheduler rather than manually running code in browser console 

## Testing

To run all the test suites:

```
npm test
```

There are also npm-scripts in package.json setup to run individual test suites.