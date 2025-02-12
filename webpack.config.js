const Encore = require('@symfony/webpack-encore');

// Manually configure the runtime environment if not already configured yet by the "encore" command.
// It's useful when you use tools that rely on webpack.config.js file.
if (!Encore.isRuntimeEnvironmentConfigured()) {
    Encore.configureRuntimeEnvironment(process.env.NODE_ENV || 'dev');
}

// const getJsFiles = async (source, Encore) =>
//   (await readdir(source, { withFileTypes: true }))
//      // find widgets' directories
//     .filter(dir => dir.isDirectory())
//     .forEach(dir => {
//         const widgetDir = source+'/'+dir.name;
//         readdir(widgetDir, { withFileTypes: true })
//         // .then((files) => console.log(files))
//         .then(files => {
//             files.forEach(file => {
                
//                 console.log(file.name.replace(/\.[^/.]+$/, ""));
//                 console.log(widgetDir+'/'+file.name);
//             })
//         })
//     })

Encore
    // directory where compiled assets will be stored
    .setOutputPath('public/build/')
    // public path used by the web server to access the output path
    .setPublicPath('/build')
    // only needed for CDN's or sub-directory deploy
    //.setManifestKeyPrefix('build/')
    .enableVueLoader(() => {}, {
        version: 3,
        runtimeCompilerBuild: false,
    })
    .configureDefinePlugin((options) => {
        options.__VUE_OPTIONS_API__ = true;
        options.__VUE_PROD_DEVTOOLS__ = false;
    })
    .addEntry('app', './assets/app.js')
    .addEntry('board', './assets/board.js')
    .addStyleEntry('tailwind', './assets/css/tailwind.css')
    // .addStyleEntry('font-fira', './assets/fonts/fira-sans.css')
    .addStyleEntry('fonts', './assets/fonts.js')
    .enablePostCssLoader((options) => {
        options.postcssOptions = {
         // directory where the postcss.config.js file is stored
                path: './assets/postcss.config.js'
        };
    })
    // .addEntries(entries)
    // .copyFiles({
    //     from: './assets/fonts/FiraSans',
    //     to: 'fonts/[name].[ext]'
    // })

    // enables the Symfony UX Stimulus bridge (used in assets/bootstrap.js)
    .enableStimulusBridge('./assets/controllers.json')

    // When enabled, Webpack "splits" your files into smaller pieces for greater optimization.
    .splitEntryChunks()

    // will require an extra script tag for runtime.js
    // but, you probably want this, unless you're building a single-page app
    .enableSingleRuntimeChunk()

    /*
     * FEATURE CONFIG
     *
     * Enable & configure other features below. For a full
     * list of features, see:
     * https://symfony.com/doc/current/frontend.html#adding-more-features
     */
    .cleanupOutputBeforeBuild()
    // .enableBuildNotifications()
    .enableSourceMaps(!Encore.isProduction())
    // enables hashed filenames (e.g. app.abc123.css)
    // .enableVersioning(Encore.isProduction())

    .configureBabel((config) => {
        config.plugins.push('@babel/plugin-proposal-class-properties');
    })

    // enables @babel/preset-env polyfills
    .configureBabelPresetEnv((config) => {
        config.useBuiltIns = 'usage';
        config.corejs = 3;
    })

    // enables Sass/SCSS support
    //.enableSassLoader()

    // uncomment if you use TypeScript
    //.enableTypeScriptLoader()

    // uncomment if you use React
    //.enableReactPreset()

    // uncomment to get integrity="..." attributes on your script & link tags
    // requires WebpackEncoreBundle 1.4 or higher
    //.enableIntegrityHashes(Encore.isProduction())

    // uncomment if you're having problems with a jQuery plugin
    //.autoProvidejQuery()
;

module.exports = Encore.getWebpackConfig();
