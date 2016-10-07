/* eslint-disable no-var, vars-on-top */
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const url = require('url');
const paths = require('./paths');
const env = require('./env');
const babelQuery = require('./babel.prod');

// PostCSS plugins
const cssnext = require('postcss-cssnext');
const postcssFocus = require('postcss-focus');

const modules = [
  'plant',
  'node_modules',
];

// Assert this just to be safe.
// Development builds of React are slow and not intended for production.
if (env['process.env'].NODE_ENV !== '"production"') {
  throw new Error('Production builds must have NODE_ENV=production.');
}

// We use "homepage" field to infer "public path" at which the app is served.
// Webpack needs to know it to put the right <script> hrefs into HTML even in
// single-page apps that may serve index.html for nested URLs like /todos/42.
// We can't use a relative path in HTML because we don't want to load something
// like /todos/42/static/js/bundle.7289d.js. We have to know the root.
const homepagePath = require(paths.appPackageJson).homepage;
var publicPath = homepagePath ? url.parse(homepagePath).pathname : '/';
if (!publicPath.endsWith('/')) {
  // If we don't do this, file assets will get incorrect paths.
  publicPath += '/';
}

// This is the production configuration.
// It compiles slowly and is focused on producing a fast and minimal bundle.
// The development configuration is different and lives in a separate file.
module.exports = {
  // Don't attempt to continue if there are any errors.
  bail: true,
  // We generate sourcemaps in production. This is slow but gives good results.
  // You can exclude the *.map files from the build during deployment.
  devtool: 'source-map',
  // In production, we only want to load the polyfills and the app code.
  entry: [
    require.resolve('./polyfills'),
    path.join(paths.appSrc, 'index'),
  ],
  output: {
    // The build folder.
    path: paths.appBuild,
    // Generated JS file names (with nested folders).
    // There will be one main bundle, and one file per asynchronous chunk.
    // We don't currently advertise code splitting but Webpack supports it.
    filename: 'static/js/[name].[chunkhash:8].js',
    chunkFilename: 'static/js/[name].[chunkhash:8].chunk.js',
    // We inferred the "public path" (such as / or /my-project) from homepage.
    publicPath,
  },
  resolve: {
    modulesDirectories: modules,
    modules,
    // These are the reasonable defaults supported by the Node ecosystem.
    extensions: [
      '',
      '.js',
      '.jsx',
      '.react.js',
    ],
    packageMains: [
      'jsnext:main',
      'main',
    ],
  },
  module: {
    // First, run the linter.
    // It's important to do this before Babel processes the JS.
    preLoaders: [
      {
        test: /\.js$/,
        loader: 'eslint',
        include: paths.appSrc,
      },
    ],
    loaders: [
      // Process JS with Babel.
      {
        test: /\.js$/,
        include: paths.appSrc,
        loader: 'babel',
        query: babelQuery,
      },
      // The notation here is somewhat confusing.
      // "postcss" loader applies autoprefixer to our CSS.
      // "css" loader resolves paths in CSS and adds assets as dependencies.
      // "style" loader normally turns CSS into JS modules injecting <style>,
      // but unlike in development configuration, we do something different.
      // `ExtractTextPlugin` first applies the "postcss" and "css" loaders
      // (second argument), then grabs the result CSS and puts it into a
      // separate file in our build process. This way we actually ship
      // a single CSS file in production instead of JS code injecting <style>
      // tags. If you use code splitting, however, any async bundles will still
      // use the "style" loader inside the async code so CSS from them won't be
      // in the main CSS file.
      {
        test: /\.s?css$/,
        include: [paths.appSrc],
        // "?-autoprefixer" disables autoprefixer in css-loader itself:
        // https://github.com/webpack/css-loader/issues/281
        // We already have it thanks to postcss. We only pass this flag in
        // production because "css" loader only enables autoprefixer-powered
        // removal of unnecessary prefixes when Uglify plugin is enabled.
        // Webpack 1.x uses Uglify plugin as a signal to minify *all* the assets
        // including CSS. This is confusing and will be removed in Webpack 2:
        // https://github.com/webpack/webpack/issues/283
        loader: ExtractTextPlugin.extract(
          'style-loader',
          'css-loader?modules&-autoprefixer&importLoaders=1!postcss-loader!sass-loader'
        ),
        // Note: this won't work without `new ExtractTextPlugin()` in `plugins`.
      },
      {
        // Do not transform vendor's CSS with CSS-modules
        // The point is that they remain in global scope.
        // Since we require these CSS files in our JS or CSS files,
        // they will be a part of our compilation either way.
        // So, no need for ExtractTextPlugin here.
        test: /\.css$/,
        include: paths.appNodeModules,
        loaders: ['style-loader', 'css-loader'],
      },
      // JSON is not enabled by default in Webpack but both Node and Browserify
      // allow it implicitly so we also enable it.
      {
        test: /\.json$/,
        include: [paths.appSrc, paths.appNodeModules],
        loader: 'json',
      },
      // "file" loader makes sure those assets end up in the `build` folder.
      // When you `import` an asset, you get its filename.
      {
        test: /\.(jpg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/,
        include: [paths.appSrc, paths.appNodeModules],
        loader: 'file',
        query: {
          name: 'static/media/[name].[hash:8].[ext]',
        },
      },
      // "url" loader works just like "file" loader but it also embeds
      // assets smaller than specified size as data URLs to avoid requests.
      {
        test: /\.(mp4|webm)(\?.*)?$/,
        include: [paths.appSrc, paths.appNodeModules],
        loader: 'url',
        query: {
          limit: 10000,
          name: 'static/media/[name].[hash:8].[ext]',
        },
      },
    ],
  },
  // Point ESLint to our predefined config.
  eslint: {
    // TODO: consider separate config for production,
    // e.g. to enable no-console and no-debugger only in production.
    configFile: path.join(__dirname, 'eslint.js'),
    useEslintrc: false,
  },
  // We use PostCSS for autoprefixing only.
  postcss: () => [
    postcssFocus(), // Add a :focus to every :hover
    cssnext({ // Allow future CSS features to be used, also auto-prefixes the CSS...
      browsers: ['last 2 versions', 'IE > 10'], // ...based on this browser list
    }),
  ],
  plugins: [
    // Generates an `index.html` file with the <script> injected.
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.appHtml,
      favicon: paths.appFavicon,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
    }),
    // Makes some environment variables available to the JS code, for example:
    // if (process.env.NODE_ENV === 'production') { ... }. See `env.js`.
    // It is absolutely essential that NODE_ENV was set to production here.
    // Otherwise React will be compiled in the very slow development mode.
    new webpack.DefinePlugin(env),
    // This helps ensure the builds are consistent if source hasn't changed:
    new webpack.optimize.OccurrenceOrderPlugin(),
    // Try to dedupe duplicated modules, if any:
    new webpack.optimize.DedupePlugin(),
    // Minify the code.
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        screw_ie8: true, // React doesn't support IE8
        warnings: false,
      },
      mangle: {
        screw_ie8: true,
      },
      output: {
        comments: false,
        screw_ie8: true,
      },
    }),
    // Note: this won't work without ExtractTextPlugin.extract(..) in `loaders`.
    new ExtractTextPlugin('static/css/[name].[contenthash:8].css'),
  ],
};