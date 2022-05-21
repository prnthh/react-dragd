# react-dragd

A dynamic UI library that allows you to build pages using drag and drop components and configurations.

## To start

```
npm i
npm start
```

Edit `src/index.js` (your component)

## To view your component in isolation with a basic webpack dev server:
type:

```
npm run dev
```

Edit `/srctest/app.js` to change the parent environment, pass in props, etc.

## To test your component in another project (locally), before publishing to npm:

Build this project:

```
npm run build
```

In this project's root directory, type:

```
npm link
```

And then, in the project (root dir) you would like to use your component:

```
npm link my-awesome-component
```

For this example I've used the package name `my-awesome-component`.
This creates a symlink of your package in your project's node_modules/ dir.
Now, you may import the component in your test project, as if it was a normally installed dependancy:

```
import MyAwesomeComponent from 'my-awesome-component'
```

If you're using a hot-reload system, you should be able to observe any changes you make to your component (as long as you build them)

## To publish your component to npm

In the root directory, type:

```
npm publish
```

[npm docs on publishing packages](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)

## A note on webpack configs and the dev server:
There are two webpack configs.

- One for building the published component `webpack.publish.js`
- One for viewing the component in the dev server. `webpack.testServer.js`

Note that they are separate, so any additions you make will have to be mirrored in both files, if you want to use the dev server. If anyone knows a better way to do this, please let me know.
