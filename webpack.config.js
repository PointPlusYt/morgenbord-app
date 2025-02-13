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
    .setOutputPath('./public/build')
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
    .addEntry('app', './assets/bundles/core/app.js')
    .addEntry('board', './assets/bundles/core/board.js')
    .addStyleEntry('tailwind', './assets/bundles/core/css/tailwind.css')
    // .addStyleEntry('font-fira', './assets/bundles/core/fonts/fira-sans.css')
    .addStyleEntry('fonts', './assets/bundles/core/fonts.js')
    .enablePostCssLoader((options) => {
        options.postcssOptions = {
            // directory where the postcss.config.js file is stored
            config: './assets/bundles/core/postcss.config.js',
        };
    })
    // .addEntries(entries)
    // .copyFiles({
    //     from: './assets/bundles/core/fonts/FiraSans',
    //     to: 'fonts/[name].[ext]'
    // })
    .addRule({
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        loader: 'file-loader',
        options: {
            name: 'fonts/[name].[hash].[ext]',
            publicPath: '/build'
        }
    })
    // .addRule({
    //     test: /node_modules\/flowbite-svelte\/.*\.js$/,
    //     resolve: {
    //       fullySpecified: false,
    //     },
    // })
    // enables the Symfony UX Stimulus bridge (used in assets/bundles/core/bootstrap.js)
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

    // .configureBabel((config) => {
    //     config.plugins.push('@babel/plugin-proposal-class-properties');
    // })

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

// module.exports = Encore.getWebpackConfig();

const config = Encore.getWebpackConfig();

// 🎯 Définir Webpack en mode Node.js (si nécessaire)
config.target = 'node';

// 🚀 Exclure les modules Node.js de la compilation
config.externals = {
    fs: 'commonjs fs',
    path: 'commonjs path',
    os: 'commonjs os',
    child_process: 'commonjs child_process',
};

module.exports = config;

// config.resolve = config.resolve || {};
// config.resolve.fallback = {
//   fs: false,
//   path: false,
//   os: false,
//   child_process: false,
// };

// module.exports = config;
