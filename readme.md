# Re-vision Device

## About

By interacting with this web application, users could re-vision *vertical farming*, based upon images from Instagram.

## Technical Implementation

The web application is written in JavaScript. The client-side code is based on the Vue.js framework and the Webpack module bundler. The server-side code uses the Mongoose and Express.js libraries.

### Local setup for development

How to run the web-application for development?

First, clone the repository:

```
cd SOME_PATH
git clone REPOSITORY_URL
```

Run the client-side / front-end application as follows. This will launch a development web-server which watches all files in =~/SOME_PATH/client/source/= for changes.

```
cd SOME_PATH/visioning-vertical-farming/application/client/
yarn
yarn run development
```

In another terminal, start the server-side / back-end application:

```
cd SOME_PATH/visioning-vertical-farming/application/server/
yarn
yarn run development
```

Visit [[http://localhost:8080]] with your web-browser.

### Deployment for Production Usage

How to set up and run the web-application for production usage?

First, clone the repository:

```
cd SOME_PATH
git clone REPOSITORY_URL
```

Build the client-side / front-end application:

```
cd SOME_PATH/client
yarn
yarn run build
```

Start the server-side / back-end application:

```
cd SOME_PATH/server
yarn
node source/main.js
```

Instead of running the server-side application manually using `node source/main.js`, you can use a *process manager*. One very simple process manager is [[https://github.com/foreverjs/forever][forever.js]]. You can use it like this:

```
forever start source/main.js
```
