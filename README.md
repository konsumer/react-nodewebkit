# react-nodewebkit starter

Download this skeleton if you want a no-nonsense react starter project for making standalone [node-webkit](https://github.com/rogerwang/node-webkit) apps.  It uses [skeleton.css](http://getskeleton.com/) and will get you started super-quick and look rad.

This project is [MIT licensed](http://opensource.org/licenses/MIT), but I think it'd be real sweet if you told people you started your awesome project using mine.


## development

Get started with `npm install`.

### nativeRequire

I like to make node-webkit apps in the browser. It's a lot faster than building a native app & re-running it when I make changes. Also, an issue that you will run into is that browserify overwrites `require()` to use a browser-context version.  I wanted to solve both things with minimal configuration. You will probably still want to use npm modules, natively (that is the whole point of using node-webkit, right?) I made `nativeRequire` and a non-native shim (in `app/shim.js`.) The idea is that when you really need a native module, you just run `nativeRequire('module')` instead of `require('module')` and make a shim in shim.js for browser-based testing. Pretty slick, eh?

#### example please

Here is an example that uses the `serial` npm module:

Lets imagine a world, just for a moment, where I need to get a list of serial ports.

```javascript
var serial = nativeRequire('serialport');
serial.list(function(err, ports){
    // do stuff with me arggh & ports on dee open sea
});
```

in `app/shim.js`, I make a fake module that does something similar to `serial.list`:

```javascript
/**
 * Browser-dev shim
 * shim all native modules here
 */

(function(){
    function shim(name){
        var fakePorts = [
        ];

        switch(name){
            case 'serialport': return {
                list: function(cb){
                    cb(null, fakePorts);
                }
            };
        }
    }

    window.nativeRequire = (typeof require !== 'undefined') ? require : shim;
})();
```

Pretty simple, eh?

You don't need to fake every native module completely, and not doing so can help you keep track of what exactly is needed from the native system, just in case you do native things differently in the future ([cordova](http://cordova.apache.org/), [atom-shell](https://github.com/atom/atom-shell), [CEF](https://code.google.com/p/chromiumembedded/), etc.)

#### more on browserify

If you hate this elegant simplicity, feel free to use [browserify options](https://github.com/substack/node-browserify) to do something clever. I put the build options in `package.json`. I imagine you could ignore `serialport` and do a try/catch in your application code to shim it, as needed.

### node run

Instead of using a [proper task-runner](http://gulpjs.com/), I just put tasks inside the `package.json` file to reduce the configuration/dependency overhead & keep things simple & light.

*  `npm start` - watch file for changes & rebuild
*  `npm test` - run mocha all tests in `test/`
*  `npm run app` - run node-webkit app
*  `npm run build` - Build the app as an executable for the current platform

I develop features, like this: `npm start && open app/index.html`

#### native modules

For compiled native modules (like `serialport` in the example above) you will need to compile them specifically for node-webkit:

```
npm install -g node-pre-gyp
npm install --save serialport
cd node_modules/serialport
node-pre-gyp rebuild --runtime=node-webkit --target=0.11.2
```

An easy way to do this for yourself and others is to put it in your `package.json` under `scripts.postinstall` & `devDependencies`:

```json
{
    "dependencies": {
        "serialport": ""
    },

    "devDependencies": {
        "browserify": "^7.0.0",
        "chai": "^1.10.0",
        "fs-extra": "^0.12.0",
        "mocha": "^2.0.1",
        "node-webkit-builder": "^0.4.0",
        "reactify": "^0.17.1",
        "watchify": "^2.1.1"
    },

    "scripts": {
        "start": "watchify app/jsx/index.jsx -o app/bundle.js",
        "test": "mocha",
        "app": "nwbuild --run .",
        "build": "./build/build",
        "postinstall": "cd node_modules/serialport && node-pre-gyp rebuild --runtime=node-webkit --target=0.11.2"
    }
}
```

Now, when you or your friends do a `npm install`,  all the good stuff happens.
