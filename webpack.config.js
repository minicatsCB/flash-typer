const path = require('path');

module.exports = {
    mode: "development",
    entry: './src/app.js',
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
      rules: [
       {
         test: /\.(png)$/,
         use: [
           'file-loader'
         ]
       }
      ]
    }
};
