This repository and all the files within it are the property of Mark J. G. Smith. All rights reserved.
.
├── Dashboard.png
├── Dockerfile
├── LICENSE.md
├── README.md
├── TODO.md
├── bin
│   ├── npm-scripts
│   │   └── install-bootstrap.sh
│   └── www
├── lib
│   ├── app.js
│   ├── config
│   │   ├── index.js
│   │   └── server.js
│   ├── controllers
│   │   ├── dashboard.js
│   │   └── index.js
│   ├── middleware
│   │   ├── index.js
│   │   ├── logRequest.js
│   │   └── throwError.js
│   ├── routes
│   │   ├── dashboard.js
│   │   ├── index.js
│   │   └── throwError.js
│   ├── utils
│   │   ├── calculateSpeed.js
│   │   ├── createWebsocketsServer.js
│   │   ├── dataStore.js
│   │   ├── getRequestInfo.js
│   │   ├── highlightRow.js
│   │   ├── index.js
│   │   ├── validateUuidData.js
│   │   └── verifyMiddlewareParams.js
│   └── views
│       ├── error.ejs
│       └── index.ejs
├── package-lock.json
├── package.json
├── public
│   ├── images
│   ├── javascripts
│   │   ├── bootstrap.bundle.min.js
│   │   ├── bootstrap.bundle.min.js.map
│   │   ├── bootstrap.min.js
│   │   ├── bootstrap.min.js.map
│   │   └── jquery.min.js
│   └── stylesheets
│       ├── bootstrap-grid.min.css
│       ├── bootstrap-grid.min.css.map
│       ├── bootstrap-reboot.min.css
│       ├── bootstrap-reboot.min.css.map
│       ├── bootstrap.min.css
│       ├── bootstrap.min.css.map
│       └── style.css
└── test
    ├── integration
    │   ├── httpServer
    │   │   ├── dashboard.test.js
    │   │   └── index.test.js
    │   ├── index.test.js
    │   └── wsServer
    │       └── index.test.js
    └── unit
        ├── controllers
        │   └── dashboard.test.js
        ├── index.test.js
        ├── middleware
        │   ├── logRequest.test.js
        │   └── throwError.test.js
        └── utils
            ├── calculateSpeed.test.js
            ├── createWebsocketsServer.test.js
            ├── getRequestInfo.test.js
            ├── highlightRow.test.js
            ├── validateUuidData.test.js
            └── verifyMiddlewareParams.test.js