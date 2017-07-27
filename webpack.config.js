let path = require('path');
let nodeExternals = require('webpack-node-externals');

let serverConfig = {
  target: 'node',
    entry: './src/index-node.js',
    devServer: {
      contentBase: './dist'
    },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'single.node.js'
  },
  externals: [nodeExternals()], 
  node: {
    __dirname: true
  }
};

let clusterConfig = {
  target: 'node',
    entry: './src/index-node-cluster.js',
    devServer: {
      contentBase: './dist'
    },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'cluster.node.js'
  },

      externals: [nodeExternals()],
 
  node: {
    __dirname: true
  }
};

let clientConfig = {
  target: 'web', // <=== can be omitted as default is 'web'
    entry: './src/index.js',
    devServer: {
      contentBase: './dist'
    },
output: {
  filename: 'gd-browser.js',
  path: path.resolve(__dirname, 'dist')
}
  //…
};

module.exports = [ serverConfig, clientConfig, clusterConfig ];