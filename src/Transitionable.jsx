var React = require('react');
var _ = require('lodash');
var Immutable = require('immutable');
var ReactDOM = require('react-dom');

var debug = require('debug')('app:transitionable');

var Transitionable = React.createClass({

    propTypes: {
        children: React.PropTypes.oneOfType([
            React.PropTypes.arrayOf(React.PropTypes.shape({
                key: React.PropTypes.string
            })),
            React.PropTypes.shape({
                key: React.PropTypes.string
            })
        ]),

        className: React.PropTypes.string,
        childClassName: React.PropTypes.string,
        style: React.PropTypes.object,
        childStyle: React.PropTypes.object,

        transitionIn: React.PropTypes.func,
        transitionOut: React.PropTypes.func,
        transitionOther: React.PropTypes.func,
        onTransitionsStart: React.PropTypes.func,
        onTransitionsComplete: React.PropTypes.func
    },

    getDefaultProps: function()
    {
        return {
            className: null,
            childClassName: null,
            style: {},
            childStyle: {},
            transitionIn: function(transitionable, opts, done)
            {
                done();
            },
            transitionOut: function(transitionable, opts, done)
            {
                done();
            },
            transitionOther: function(transitionable, opts, done)
            {
                done();
            }
        };
    },

    getInitialState: function()
    {
        var children = this.getChildrenAsArray(this.props.children);
        return {
            children: children,
            allChildren: children,
            transitioningChildren: [],
            transitioningIn: [],
            transitioningOut: [],
            transitioningOther: []
        }
    },

    render: function()
    {
        var wrappedChildren = this.state.allChildren.map(_.bind(this.renderChildren, this));

        var className = ['transitionable-views'];
        if(this.props.className && this.props.className.length)
        {
            className.push(this.props.className);
        }

        return (
            <div className={className.join(' ')} style={this.props.style}>
                { wrappedChildren }
            </div>
        )
    },

    renderChildren: function(child, index)
    {
        var key = 't-'+child.key;

        var className = ['transitionable-view'];
        if(this.props.childClassName && this.props.childClassName.length)
        {
            className.push(this.props.childClassName);
        }

        if (_.indexOf(this.state.transitioningIn, child.key) > -1)
        {
            className.push('transitioning transitioning-in');
        } else if (_.indexOf(this.state.transitioningOut, child.key) > -1)
        {
            className.push('transitioning transitioning-out');
        } else if (_.indexOf(this.state.transitioningOther, child.key) > -1)
        {
            className.push('transitioning transitioning-other');
        }

        return (
            <div className={className.join(' ')} key={key} ref={key} style={this.props.childStyle}>
                { child }
            </div>
        );
    },

    componentWillMount: function()
    {
        this.transitionChildren({
            mounting: true
        });
    },

    componentWillReceiveProps: function(nextProps)
    {
        var nextChildren = this.getChildrenAsArray(nextProps.children);

        //Replace existing children
        var newChildren = [];
        _.each(this.state.children, function(child)
        {
            var existingChild = _.find(nextChildren, 'key', child.key);
            newChildren.push(existingChild ? existingChild:child)
        });

        //Replace existing transitioning children
        var newTransitioningChildren = [];
        _.each(this.state.transitioningChildren, function(child)
        {
            var existingChild = _.find(nextChildren, 'key', child.key);
            newTransitioningChildren.push(existingChild ? existingChild:child)
        });

        //Get all children
        var allChildren = _.uniq(_.union(newChildren, newTransitioningChildren), function(child)
        {
            return child.key;
        });
        
        if(this.props.children !== nextProps.children)
        {
            //Add new children
            _.each(nextChildren, function(child)
            {
                var existingIndex = _.findIndex(allChildren, 'key', child.key);
                if(existingIndex === -1)
                {
                    allChildren.push(child);
                }
            });
        }
        
        this.setState({
            children: newChildren,
            transitioningChildren: newTransitioningChildren,
            allChildren: allChildren
        });
    },

    componentDidUpdate: function(prevProps, prevState)
    {
        var currentChildrenKey = _.map(this.getChildrenAsArray(this.props.children),'key').join('|');
        var prevChildrenKey = _.map(this.getChildrenAsArray(prevProps.children),'key').join('|');
        if(currentChildrenKey !== prevChildrenKey)
        {
            this.transitionChildren();
        }
    },

    transitionChildren: function(opts)
    {
        opts = _.extend({
            mounting: false,
            allChildrenKeys: _.map(this.state.allChildren, 'key')
        }, opts);

        var newChildren = this.getChildrenAsArray(this.props.children);
        var currentChildren = _.uniq(_.union(this.state.children, this.state.transitioningChildren), function(child)
        {
            return child.key;
        });
        var allCurrentKeys = _.map(currentChildren, 'key');
        var currentKeys = _.map(this.state.children, 'key');
        var nextKeys = _.map(newChildren, 'key');
        var keysToRemove = _.difference(allCurrentKeys, nextKeys);
        var keysToAdd = _.difference(nextKeys, _.difference(currentKeys, this.state.transitioningOut));
        var keysOthers = _.difference(allCurrentKeys, keysToRemove, keysToAdd);

        var transitions = [];

        debug('Current keys', currentKeys);
        debug('Next keys', nextKeys);
        debug('Children to remove', keysToRemove);
        debug('Children to add', keysToAdd);
        debug('Children others', keysOthers);
        debug('---');

        if(keysToRemove.length)
        {
            for(var i = 0, brl = keysToRemove.length; i < brl; i++)
            {
                var key = keysToRemove[i];
                transitions.push({
                    direction: 'out',
                    key: key
                });
            }

        }
        if(keysToAdd.length)
        {
            for(var j = 0, bal = keysToAdd.length; j < bal; j++)
            {
                var key = keysToAdd[j];

                transitions.push({
                    direction: 'in',
                    key: key
                });
            }
        }
        if(keysOthers.length)
        {
            for(var k = 0, bol = keysOthers.length; k < bol; k++)
            {
                var key = keysOthers[k];

                transitions.push({
                    direction: 'other',
                    key: key
                });
            }
        }

        //Merge new transitioning and old transitioning
        var newTransitioningChildren = _.filter(this.state.allChildren, function(child)
        {
            return _.indexOf(keysToAdd, child.key) !== -1 || _.indexOf(keysToRemove, child.key) !== -1;
        })
        var allTransitioningChildren = _.union(this.state.transitioningChildren, newTransitioningChildren);
        var transitioningChildren = _.uniq(allTransitioningChildren, function(child)
        {
            return child.key;
        });

        this.setState({
            transitioningChildren: transitioningChildren
        }, function()
        {
            this.callTransitions(transitions, opts);

            if (!opts.mounting && this.props.onTransitionsStart)
            {
                this.props.onTransitionsStart();
            }
        })
    },

    callTransitions: function(transitions, opts)
    {
        var keys = _.map(transitions, 'key');
        var inKeys = _.map(_.filter(transitions, ['direction', 'in']) , 'key');
        var outKeys = _.map(_.filter(transitions, ['direction', 'out']) , 'key');
        var otherKeys = _.map(_.filter(transitions, ['direction', 'other']) , 'key');
        var transitioningIn = _.difference(_.union(this.state.transitioningIn, inKeys), outKeys, otherKeys);
        var transitioningOut = _.difference(_.union(this.state.transitioningOut, outKeys), inKeys, otherKeys);
        var transitioningOther = _.difference(_.union(this.state.transitioningOther, otherKeys), inKeys, outKeys);

        var remainingTransitions = _.filter(transitions, _.bind(function(transition)
        {
            if(transition.direction === 'in')
            {
                return _.indexOf(this.state.transitioningIn, transition.key) === -1;
            }
            else if(transition.direction === 'out')
            {
                return _.indexOf(this.state.transitioningOut, transition.key) === -1;
            }
            else if(transition.direction === 'other')
            {
                return _.indexOf(this.state.transitioningOther, transition.key) === -1;
            }
        }, this));

        //Remove others from transitioning keys or not
        var remainingTransitionsKeys = _.difference(_.map(remainingTransitions, 'key'), transitioningOther);
        //var remainingTransitionsKeys = _.map(remainingTransitions, 'key');

        /*debug('Should transitions', keys);
        debug('Will transitions', _.map(remainingTransitions, 'key'));
        debug('Transitioning in', transitioningIn);
        debug('Transitioning out', transitioningOut);
        debug('Transitioning other', transitioningOther);*/

        this.setState({
            transitioningIn: transitioningIn,
            transitioningOut: transitioningOut,
            transitioningOther: transitioningOther
        }, function()
        {
            var transitionDone = 0;
            for(var i = 0, transitionCount = remainingTransitions.length; i < transitionCount; i++)
            {
                var transition = remainingTransitions[i];
                this.callTransition(transition.direction, transition.key, opts, function()
                {
                    transitionDone++;
                    if(transitionCount === transitionDone)
                    {
                        this.setState({
                            transitioningIn: _.difference(this.state.transitioningIn, inKeys),
                            transitioningOut: _.difference(this.state.transitioningOut, outKeys),
                            transitioningOther: _.difference(this.state.transitioningOther, otherKeys)
                        }, function()
                        {
                            this.onAllTransitionComplete(remainingTransitionsKeys);
                        });
                    }
                });
            }
        });
    },

    callTransition: function(direction, key, opts, done)
    {
        var el = ReactDOM.findDOMNode(this.refs['t-'+key]);
        var directionName = direction.substr(0,1).toUpperCase()+direction.substr(1);
        var child = _.find(this.state.allChildren, ['key', key]);
        var transitionable = {
            el: el,
            key: key,
            props: child ? child.props:{}
        };
        
        var onTransitionDone = _.bind(function()
        {
            this.onTransitionComplete(transitionable, direction);
            this['onTransition'+directionName+'Complete'](transitionable, child);
            setTimeout(_.bind(done, this), 0);
        }, this)
        
        var transitionReturn = this.props['transition'+directionName].call(this, transitionable, opts, onTransitionDone);
        if(transitionReturn && _.isFunction(transitionReturn.then))
        {
            transitionReturn.then(onTransitionDone);
        }
    },

    getChildrenAsArray: function(children)
    {
        var newChildren = children;
        if(!_.isArray(newChildren))
        {
            newChildren = newChildren ? [newChildren]:[];
        }
        return newChildren;
    },

    onTransitionComplete: function(transitionable, direction)
    {
        if(this.props.onTransitionComplete)
        {
            this.props.onTransitionComplete(transitionable, direction);
        }
    },

    onTransitionInComplete: function(transitionable)
    {
        if(this.props.onTransitionInComplete)
        {
            this.props.onTransitionInComplete(transitionable);
        }
    },

    onTransitionOutComplete: function(transitionable)
    {
        if(this.props.onTransitionOutComplete)
        {
            this.props.onTransitionOutComplete(transitionable);
        }
    },

    onTransitionOtherComplete: function(transitionable)
    {
        if(this.props.onTransitionOtherComplete)
        {
            this.props.onTransitionOtherComplete(transitionable);
        }
    },

    onAllTransitionComplete: function(keys)
    {
        debug('All transitionings completed', keys);

        var transitioningChildren = _.filter(this.state.transitioningChildren, function(child)
        {
            return _.indexOf(keys, child.key) === -1;
        });

        var newChildren = this.getChildrenAsArray(this.props.children);
        var allChildren = _.union(newChildren, transitioningChildren);
        var children = _.uniq(allChildren, function(child)
        {
            return child.key;
        });

        this.setState({
            allChildren: children,
            children: newChildren,
            transitioningChildren: transitioningChildren
        }, function()
        {
            /*debug('Transitioning children', this.state.transitioningChildren);
            debug('Transitioning in', this.state.transitioningIn);
            debug('Transitioning out', this.state.transitioningOut);
            debug('Transitioning other', this.state.transitioningOther);*/
            if (this.props.onTransitionsComplete)
            {
                this.props.onTransitionsComplete();
            }
        });
    }

});

module.exports = Transitionable;
