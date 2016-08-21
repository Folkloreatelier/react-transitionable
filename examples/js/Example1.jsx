var React = require('react');
var ReactDOM = require('react-dom');
var _ = require('lodash');
require('gsap');

var ReactTransitionable = require('../../src/index');

var Example = React.createClass({
    
    propTypes: {
        
    },
    
    getInitialState: function()
    {
        return {
            index: 0
        };
    },
    
    render: function()
    {
        var key = 'item-'+this.state.index;
        
        var rgb = [
            Math.round(Math.random() * 255),
            Math.round(Math.random() * 255),
            Math.round(Math.random() * 255)
        ];
        
        var rgbInvert = _.map(rgb, function(value)
        {
            return 255-value;
        });
        
        var itemStyle = {
            background: 'rgb('+rgb.join(',')+')',
            color: 'rgb('+rgbInvert.join(',')+')'
        };
        
        return (
            <ReactTransitionable
                transitionIn={this.transitionIn}
                transitionOut={this.transitionOut}
            >
                <a key={key} onClick={this.onClick} className="fullscreen-item" style={itemStyle}>
                    <span className="middle">{ this.state.index }</span>
                </a>
            </ReactTransitionable>
        );
    },
    
    /**
     * Methods
     */
    transitionIn: function(transitionable, opts, done)
    {
        TweenMax.fromTo(transitionable.el, opts.mounting ? 0:0.4, {
            opacity: 0
        }, {
            opacity: 1,
            onComplete: done
        });
    },
    
    transitionOut: function(transitionable, opts, done)
    {
        TweenMax.to(transitionable.el, opts.mounting ? 0:0.4, {
            opacity: 0,
            onComplete: done
        });
    },
    
    /**
     * Events
     */
    onClick: function(e)
    {
        e.preventDefault();
        e.stopPropagation();
        
        this.setState({
            index: this.state.index + 1
        });
    }
});

module.exports = Example;
