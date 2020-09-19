const path = require('path');

module.exports = {
    entry: './src/js/mounter.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    }
}