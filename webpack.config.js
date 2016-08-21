'use strict';

var path = require('path');
var webpack = require('webpack');

module.exports = function(config)
{
    var contextPath = path.resolve(config.jsSrcPath);
    var outputPath = path.resolve(config.jsTmpPath);

    return {

            context: contextPath,

            entry: {
                'react-transitionable': './index'
            },

            output: {
                path: outputPath,
                filename: '[name].js',
                chunkFilename: '[name].chunk.js',
                jsonpFunction: 'flklrJsonp',
                libraryTarget: 'umd',
                library: 'ReactTransitionable'
            },

            plugins: [
                
            ],

            module: {
                noParse: [

                ],
                preLoaders: [

                ],
                loaders: [
                    {
                        test: /\.(jsx)$/,
                        exclude: /(node_modules|bower_components|\.tmp)/,
                        loader: 'babel',
                        query: {
                            presets: ['react']
                        }
                    }
                ]
            },
            
            externals: {
                'react': {
                    'commonjs': 'react',
                    'commonjs2': 'react',
                    'amd': 'react',
                    'root': 'React'
                },
                'react-dom': {
                    'commonjs': 'react-dom',
                    'commonjs2': 'react-dom',
                    'amd': 'react-dom',
                    'root': 'ReactDOM'
                },
                'lodash': {
                    'commonjs': 'lodash',
                    'commonjs2': 'lodash',
                    'amd': 'lodash',
                    'root': '_'
                },
                'immutable': {
                    'commonjs': 'immutable',
                    'commonjs2': 'immutable',
                    'amd': 'immutable',
                    'root': 'Immutable'
                }
            },

            resolve: {
                extensions: ['', '.js', '.jsx'],
                alias: {
                    
                },
                modulesDirectories: [
                    './node_modules',
                    './web_modules',
                    './bower_components',
                    contextPath+'/vendor'
                ]
            },

            stats: {
                colors: true,
                modules: true,
                reasons: true
            },

            storeStatsTo: 'webpack',

            progress: true,

            failOnError: false,

            cache: true,
            watch: false,
            keepAlive: false
    };
};
