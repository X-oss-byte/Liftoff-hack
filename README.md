# liftoff [![Build Status](https://secure.travis-ci.org/tkellen/node-liftoff.png)](http://travis-ci.org/tkellen/node-liftoff)
> Launch your command line tool with ease.

[![NPM](https://nodei.co/npm/liftoff.png)](https://nodei.co/npm/liftoff/)

## What?
Say you're writing a CLI tool.  Let's call it [hacker](http://github.com/tkellen/node-hacker).  You want to configure it using a `Hackerfile`.  This is node, so you install `hacker` locally for each project you use it in.  But, in order to get the `hacker` command in your PATH, you also install it globally.

Now, when you run the `hacker` command, you want it to use the `Hackerfile` in your current directory, and the local installation of `hacker` next to it.  It'd be nice if it traversed up your folders until it found a `Hackerfile`&mdash;for those times when you're not in the root directory of your project.  Heck, you might even want to launch it from a folder outside of your project by manually specifying a working directory.  Liftoff manages this for you.

So, everything is working great.  Now you can find your local `hacker` and `Hackerfile` with ease.  Unfortunately, it turns out you've authored your `Hackerfile` in coffee-script, or some other JS variant.  In order to support *that*, you have to load the compiler for it, and then register the extension for it with node.  Good news, Liftoff can do that too.

## API

### constructor(opts)

Create an instance of Liftoff to invoke your application.

An example utilizing all options:
```js
var Hacker = new Liftoff({
  processTitle: 'hacker',
  cwdOpt: 'cwd',
  preloadOpt: 'require',
  localDeps: ['hacker'],
  configName: 'hackerfile',
  name: 'hacker'
});
```

#### opts.processTitle

Sets what the [process title](http://nodejs.org/api/process.html#process_process_title) will be.

Type: `String`  
Default: `null`

#### opts.cwdOpt

Sets what flag to use for altering the current working directory.  For example, `myapp --cwd ../` would invoke your application as though you'd called it from the parent of your current directory.

Type: `String`  
Default: `cwd`

#### opts.preloadOpt

Sets what flag to use for pre-loading modules.  For example, `myapp --require coffee-script` would require a local version of coffee-script (if available) before attempting to find your configuration file.  If your required module registers a new
[require.extension](http://nodejs.org/api/globals.html#globals_require_extensions), it will be included as an option when looking for your `configFile`.

Type: `String`  
Default: `require`

#### opts.localDeps

Sets which module(s) your application expects to find locally when being run.

Type: `Array`  
Default: `[]`

#### opts.configName

Sets the name of the configuration file liftoff will attempt to find.  Case-insensitive.

Type: `String`  
Default: `null`

#### opts.name

Sugar for setting `processTitle`, `localDeps`, `configName` automatically.

Type: `String`  
Default: `null`

These are equivalent:
```js
new Liftoff({
  processTitle: 'hacker',
  localDeps: ['hacker'],
  configName: 'hackerfile',
  name: 'hacker'
});

new Liftoff({name:hacker});
```

### events

#### require(name, module)

Emitted when a module is pre-loaded.

```js
var Hacker = new Liftoff({name:'hacker'});
Hacker.on('require', function (name, module) {
  console.log('Requiring external module: '+name+'...');
  // automatically register coffee-script extensions
  if (name === 'coffee-script') {
    module.register();
  }
});
```

#### requireFail(name, err)

Emitted when a requested module cannot be preloaded.

```js
var Hacker = new Liftoff({name:'hacker'});
Hacker.on('requireFail', function (name, err) {
  console.log('Unable to load:', name, err);
});
```

### launch(fn, args)

#### fn

A function to start your application, invoked with the following context:

- `liftoff`: your instance of liftoff
- `args`: cli arguments, as parsed by optimist, or as passed in manually via `args`
- `cwd`: the current working directory
- `preload`: an array of modules that liftoff tried to pre-load
- `validExtensions`: an array of supported extensions for your config file
- `configNameRegex`: the regular expression used to find your config file
- `configPath`: the full path to your configuration file
- `configBase`: the base directory of your configuration file
- `localPackage`: the contents of package.json
- `depMap`: the full path to any modules listed in `localDeps` which were found

#### args
Manually specify command line options.

Type: `Object`  
Default: `null`  

## Examples
Check out [the hacker project](https://github.com/tkellen/node-hacker/blob/master/bin/hacker.js) to see a working example of this tool.

To try the example, do the following:

1. Install the sample project `hacker` with `npm install -g hacker`
2. Make a `Hackerfile.js` with some arbitrary javascript it.
3. Run `hacker` while in the same parent folder.

For extra credit, try writing your `Hackerfile` in coffeescript.  Then, run `hacker --require coffee-script`.  Make sure you install coffee-script locally, though!
