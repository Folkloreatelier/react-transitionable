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
                'main': './main'
            },

            output: {
                path: outputPath,
                filename: '[name].js',
                chunkFilename: '[name].chunk.js',
                jsonpFunction: 'flklrJsonp'
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
