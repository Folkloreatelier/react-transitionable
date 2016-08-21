(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("react"), require("lodash"), require("immutable"), require("react-dom"));
	else if(typeof define === 'function' && define.amd)
		define(["react", "lodash", "immutable", "react-dom"], factory);
	else if(typeof exports === 'object')
		exports["ReactTransitionable"] = factory(require("react"), require("lodash"), require("immutable"), require("react-dom"));
	else
		root["ReactTransitionable"] = factory(root["React"], root["_"], root["Immutable"], root["ReactDOM"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_3__, __WEBPACK_EXTERNAL_MODULE_4__, __WEBPACK_EXTERNAL_MODULE_5__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	
	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var React = __webpack_require__(2);
	var _ = __webpack_require__(3);
	var Immutable = __webpack_require__(4);
	var ReactDOM = __webpack_require__(5);
	
	var debug = __webpack_require__(6)('app:transitionable');
	
	var Transitionable = React.createClass({
	    displayName: 'Transitionable',
	
	
	    propTypes: {
	        children: React.PropTypes.oneOfType([React.PropTypes.arrayOf(React.PropTypes.shape({
	            key: React.PropTypes.string
	        })), React.PropTypes.shape({
	            key: React.PropTypes.string
	        })]),
	
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
	
	    getDefaultProps: function () {
	        return {
	            className: null,
	            childClassName: null,
	            style: {},
	            childStyle: {},
	            transitionIn: function (transitionable, opts, done) {
	                done();
	            },
	            transitionOut: function (transitionable, opts, done) {
	                done();
	            },
	            transitionOther: function (transitionable, opts, done) {
	                done();
	            }
	        };
	    },
	
	    getInitialState: function () {
	        var children = this.getChildrenAsArray(this.props.children);
	        return {
	            children: children,
	            allChildren: children,
	            transitioningChildren: [],
	            transitioningIn: [],
	            transitioningOut: [],
	            transitioningOther: []
	        };
	    },
	
	    render: function () {
	        var wrappedChildren = this.state.allChildren.map(_.bind(this.renderChildren, this));
	
	        var className = ['transitionable-views'];
	        if (this.props.className && this.props.className.length) {
	            className.push(this.props.className);
	        }
	
	        return React.createElement(
	            'div',
	            { className: className.join(' '), style: this.props.style },
	            wrappedChildren
	        );
	    },
	
	    renderChildren: function (child, index) {
	        var key = 't-' + child.key;
	
	        var className = ['transitionable-view'];
	        if (this.props.childClassName && this.props.childClassName.length) {
	            className.push(this.props.childClassName);
	        }
	
	        if (_.indexOf(this.state.transitioningIn, child.key) > -1) {
	            className.push('transitioning transitioning-in');
	        } else if (_.indexOf(this.state.transitioningOut, child.key) > -1) {
	            className.push('transitioning transitioning-out');
	        } else if (_.indexOf(this.state.transitioningOther, child.key) > -1) {
	            className.push('transitioning transitioning-other');
	        }
	
	        return React.createElement(
	            'div',
	            { className: className.join(' '), key: key, ref: key, style: this.props.childStyle },
	            child
	        );
	    },
	
	    componentWillMount: function () {
	        this.transitionChildren({
	            mounting: true
	        });
	    },
	
	    componentWillReceiveProps: function (nextProps) {
	        var currentChildren = this.getChildrenAsArray(this.props.children);
	        var nextChildren = this.getChildrenAsArray(nextProps.children);
	        var currentChildrenKey = _.map(currentChildren, 'key').join('|');
	        var nextChildrenKey = _.map(nextChildren, 'key').join('|');
	
	        //Replace existing children
	        var newChildren = [];
	        _.each(this.state.children, function (child) {
	            var existingChild = _.find(nextChildren, ['key', child.key]);
	            newChildren.push(existingChild ? existingChild : child);
	        });
	
	        //Replace existing transitioning children
	        var newTransitioningChildren = [];
	        _.each(this.state.transitioningChildren, function (child) {
	            var existingChild = _.find(nextChildren, ['key', child.key]);
	            newTransitioningChildren.push(existingChild ? existingChild : child);
	        });
	
	        //Get all children
	        var allChildren = _.uniq(_.union(newChildren, newTransitioningChildren), function (child) {
	            return child.key;
	        });
	
	        //Add new children
	        if (currentChildrenKey !== nextChildrenKey) {
	            _.each(nextChildren, function (child) {
	                var existingIndex = _.findIndex(allChildren, ['key', child.key]);
	                if (existingIndex === -1) {
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
	
	    componentDidUpdate: function (prevProps, prevState) {
	        var currentChildrenKey = _.map(this.getChildrenAsArray(this.props.children), 'key').join('|');
	        var prevChildrenKey = _.map(this.getChildrenAsArray(prevProps.children), 'key').join('|');
	        if (currentChildrenKey !== prevChildrenKey) {
	            this.transitionChildren();
	        }
	    },
	
	    transitionChildren: function (opts) {
	        opts = _.extend({
	            mounting: false,
	            allChildrenKeys: _.map(this.state.allChildren, 'key')
	        }, opts);
	
	        var newChildren = this.getChildrenAsArray(this.props.children);
	        var currentChildren = _.uniq(_.union(this.state.children, this.state.transitioningChildren), function (child) {
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
	
	        if (keysToRemove.length) {
	            for (var i = 0, brl = keysToRemove.length; i < brl; i++) {
	                var key = keysToRemove[i];
	                transitions.push({
	                    direction: 'out',
	                    key: key
	                });
	            }
	        }
	        if (keysToAdd.length) {
	            for (var j = 0, bal = keysToAdd.length; j < bal; j++) {
	                var key = keysToAdd[j];
	
	                transitions.push({
	                    direction: 'in',
	                    key: key
	                });
	            }
	        }
	        if (keysOthers.length) {
	            for (var k = 0, bol = keysOthers.length; k < bol; k++) {
	                var key = keysOthers[k];
	
	                transitions.push({
	                    direction: 'other',
	                    key: key
	                });
	            }
	        }
	
	        //Merge new transitioning and old transitioning
	        var newTransitioningChildren = _.filter(this.state.allChildren, function (child) {
	            return _.indexOf(keysToAdd, child.key) !== -1 || _.indexOf(keysToRemove, child.key) !== -1;
	        });
	        var allTransitioningChildren = _.union(this.state.transitioningChildren, newTransitioningChildren);
	        var transitioningChildren = _.uniq(allTransitioningChildren, function (child) {
	            return child.key;
	        });
	
	        this.setState({
	            transitioningChildren: transitioningChildren
	        }, function () {
	            this.callTransitions(transitions, opts);
	
	            if (!opts.mounting && this.props.onTransitionsStart) {
	                this.props.onTransitionsStart();
	            }
	        });
	    },
	
	    callTransitions: function (transitions, opts) {
	        var keys = _.map(transitions, 'key');
	        var inKeys = _.map(_.filter(transitions, ['direction', 'in']), 'key');
	        var outKeys = _.map(_.filter(transitions, ['direction', 'out']), 'key');
	        var otherKeys = _.map(_.filter(transitions, ['direction', 'other']), 'key');
	        var transitioningIn = _.difference(_.union(this.state.transitioningIn, inKeys), outKeys, otherKeys);
	        var transitioningOut = _.difference(_.union(this.state.transitioningOut, outKeys), inKeys, otherKeys);
	        var transitioningOther = _.difference(_.union(this.state.transitioningOther, otherKeys), inKeys, outKeys);
	
	        var remainingTransitions = _.filter(transitions, _.bind(function (transition) {
	            if (transition.direction === 'in') {
	                return _.indexOf(this.state.transitioningIn, transition.key) === -1;
	            } else if (transition.direction === 'out') {
	                return _.indexOf(this.state.transitioningOut, transition.key) === -1;
	            } else if (transition.direction === 'other') {
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
	        }, function () {
	            var transitionDone = 0;
	            for (var i = 0, transitionCount = remainingTransitions.length; i < transitionCount; i++) {
	                var transition = remainingTransitions[i];
	                this.callTransition(transition.direction, transition.key, opts, function () {
	                    transitionDone++;
	                    if (transitionCount === transitionDone) {
	                        this.setState({
	                            transitioningIn: _.difference(this.state.transitioningIn, inKeys),
	                            transitioningOut: _.difference(this.state.transitioningOut, outKeys),
	                            transitioningOther: _.difference(this.state.transitioningOther, otherKeys)
	                        }, function () {
	                            this.onAllTransitionComplete(remainingTransitionsKeys);
	                        });
	                    }
	                });
	            }
	        });
	    },
	
	    callTransition: function (direction, key, opts, done) {
	        var el = ReactDOM.findDOMNode(this.refs['t-' + key]);
	        var directionName = direction.substr(0, 1).toUpperCase() + direction.substr(1);
	        var child = _.find(this.state.allChildren, ['key', key]);
	        var transitionable = {
	            el: el,
	            key: key,
	            props: child ? child.props : {}
	        };
	
	        var onTransitionDone = _.bind(function () {
	            this.onTransitionComplete(transitionable, direction);
	            this['onTransition' + directionName + 'Complete'](transitionable, child);
	            setTimeout(_.bind(done, this), 0);
	        }, this);
	
	        var transitionReturn = this.props['transition' + directionName].call(this, transitionable, opts, onTransitionDone);
	        if (transitionReturn && _.isFunction(transitionReturn.then)) {
	            transitionReturn.then(onTransitionDone);
	        }
	    },
	
	    getChildrenAsArray: function (children) {
	        var newChildren = children;
	        if (!_.isArray(newChildren)) {
	            newChildren = newChildren ? [newChildren] : [];
	        }
	        return newChildren;
	    },
	
	    onTransitionComplete: function (transitionable, direction) {
	        if (this.props.onTransitionComplete) {
	            this.props.onTransitionComplete(transitionable, direction);
	        }
	    },
	
	    onTransitionInComplete: function (transitionable) {
	        if (this.props.onTransitionInComplete) {
	            this.props.onTransitionInComplete(transitionable);
	        }
	    },
	
	    onTransitionOutComplete: function (transitionable) {
	        if (this.props.onTransitionOutComplete) {
	            this.props.onTransitionOutComplete(transitionable);
	        }
	    },
	
	    onTransitionOtherComplete: function (transitionable) {
	        if (this.props.onTransitionOtherComplete) {
	            this.props.onTransitionOtherComplete(transitionable);
	        }
	    },
	
	    onAllTransitionComplete: function (keys) {
	        debug('All transitionings completed', keys);
	
	        var transitioningChildren = _.filter(this.state.transitioningChildren, function (child) {
	            return _.indexOf(keys, child.key) === -1;
	        });
	
	        var newChildren = this.getChildrenAsArray(this.props.children);
	        var allChildren = _.union(newChildren, transitioningChildren);
	        var children = _.uniq(allChildren, function (child) {
	            return child.key;
	        });
	
	        this.setState({
	            allChildren: children,
	            children: newChildren,
	            transitioningChildren: transitioningChildren
	        }, function () {
	            /*debug('Transitioning children', this.state.transitioningChildren);
	            debug('Transitioning in', this.state.transitioningIn);
	            debug('Transitioning out', this.state.transitioningOut);
	            debug('Transitioning other', this.state.transitioningOther);*/
	            if (this.props.onTransitionsComplete) {
	                this.props.onTransitionsComplete();
	            }
	        });
	    }
	
	});
	
	module.exports = Transitionable;

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_4__;

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_5__;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * This is the web browser implementation of `debug()`.
	 *
	 * Expose `debug()` as the module.
	 */
	
	exports = module.exports = __webpack_require__(7);
	exports.log = log;
	exports.formatArgs = formatArgs;
	exports.save = save;
	exports.load = load;
	exports.useColors = useColors;
	exports.storage = 'undefined' != typeof chrome
	               && 'undefined' != typeof chrome.storage
	                  ? chrome.storage.local
	                  : localstorage();
	
	/**
	 * Colors.
	 */
	
	exports.colors = [
	  'lightseagreen',
	  'forestgreen',
	  'goldenrod',
	  'dodgerblue',
	  'darkorchid',
	  'crimson'
	];
	
	/**
	 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
	 * and the Firebug extension (any Firefox version) are known
	 * to support "%c" CSS customizations.
	 *
	 * TODO: add a `localStorage` variable to explicitly enable/disable colors
	 */
	
	function useColors() {
	  // is webkit? http://stackoverflow.com/a/16459606/376773
	  return ('WebkitAppearance' in document.documentElement.style) ||
	    // is firebug? http://stackoverflow.com/a/398120/376773
	    (window.console && (console.firebug || (console.exception && console.table))) ||
	    // is firefox >= v31?
	    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
	    (navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31);
	}
	
	/**
	 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
	 */
	
	exports.formatters.j = function(v) {
	  return JSON.stringify(v);
	};
	
	
	/**
	 * Colorize log arguments if enabled.
	 *
	 * @api public
	 */
	
	function formatArgs() {
	  var args = arguments;
	  var useColors = this.useColors;
	
	  args[0] = (useColors ? '%c' : '')
	    + this.namespace
	    + (useColors ? ' %c' : ' ')
	    + args[0]
	    + (useColors ? '%c ' : ' ')
	    + '+' + exports.humanize(this.diff);
	
	  if (!useColors) return args;
	
	  var c = 'color: ' + this.color;
	  args = [args[0], c, 'color: inherit'].concat(Array.prototype.slice.call(args, 1));
	
	  // the final "%c" is somewhat tricky, because there could be other
	  // arguments passed either before or after the %c, so we need to
	  // figure out the correct index to insert the CSS into
	  var index = 0;
	  var lastC = 0;
	  args[0].replace(/%[a-z%]/g, function(match) {
	    if ('%%' === match) return;
	    index++;
	    if ('%c' === match) {
	      // we only are interested in the *last* %c
	      // (the user may have provided their own)
	      lastC = index;
	    }
	  });
	
	  args.splice(lastC, 0, c);
	  return args;
	}
	
	/**
	 * Invokes `console.log()` when available.
	 * No-op when `console.log` is not a "function".
	 *
	 * @api public
	 */
	
	function log() {
	  // this hackery is required for IE8/9, where
	  // the `console.log` function doesn't have 'apply'
	  return 'object' === typeof console
	    && console.log
	    && Function.prototype.apply.call(console.log, console, arguments);
	}
	
	/**
	 * Save `namespaces`.
	 *
	 * @param {String} namespaces
	 * @api private
	 */
	
	function save(namespaces) {
	  try {
	    if (null == namespaces) {
	      exports.storage.removeItem('debug');
	    } else {
	      exports.storage.debug = namespaces;
	    }
	  } catch(e) {}
	}
	
	/**
	 * Load `namespaces`.
	 *
	 * @return {String} returns the previously persisted debug modes
	 * @api private
	 */
	
	function load() {
	  var r;
	  try {
	    r = exports.storage.debug;
	  } catch(e) {}
	  return r;
	}
	
	/**
	 * Enable namespaces listed in `localStorage.debug` initially.
	 */
	
	exports.enable(load());
	
	/**
	 * Localstorage attempts to return the localstorage.
	 *
	 * This is necessary because safari throws
	 * when a user disables cookies/localstorage
	 * and you attempt to access it.
	 *
	 * @return {LocalStorage}
	 * @api private
	 */
	
	function localstorage(){
	  try {
	    return window.localStorage;
	  } catch (e) {}
	}


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * This is the common logic for both the Node.js and web browser
	 * implementations of `debug()`.
	 *
	 * Expose `debug()` as the module.
	 */
	
	exports = module.exports = debug;
	exports.coerce = coerce;
	exports.disable = disable;
	exports.enable = enable;
	exports.enabled = enabled;
	exports.humanize = __webpack_require__(8);
	
	/**
	 * The currently active debug mode names, and names to skip.
	 */
	
	exports.names = [];
	exports.skips = [];
	
	/**
	 * Map of special "%n" handling functions, for the debug "format" argument.
	 *
	 * Valid key names are a single, lowercased letter, i.e. "n".
	 */
	
	exports.formatters = {};
	
	/**
	 * Previously assigned color.
	 */
	
	var prevColor = 0;
	
	/**
	 * Previous log timestamp.
	 */
	
	var prevTime;
	
	/**
	 * Select a color.
	 *
	 * @return {Number}
	 * @api private
	 */
	
	function selectColor() {
	  return exports.colors[prevColor++ % exports.colors.length];
	}
	
	/**
	 * Create a debugger with the given `namespace`.
	 *
	 * @param {String} namespace
	 * @return {Function}
	 * @api public
	 */
	
	function debug(namespace) {
	
	  // define the `disabled` version
	  function disabled() {
	  }
	  disabled.enabled = false;
	
	  // define the `enabled` version
	  function enabled() {
	
	    var self = enabled;
	
	    // set `diff` timestamp
	    var curr = +new Date();
	    var ms = curr - (prevTime || curr);
	    self.diff = ms;
	    self.prev = prevTime;
	    self.curr = curr;
	    prevTime = curr;
	
	    // add the `color` if not set
	    if (null == self.useColors) self.useColors = exports.useColors();
	    if (null == self.color && self.useColors) self.color = selectColor();
	
	    var args = Array.prototype.slice.call(arguments);
	
	    args[0] = exports.coerce(args[0]);
	
	    if ('string' !== typeof args[0]) {
	      // anything else let's inspect with %o
	      args = ['%o'].concat(args);
	    }
	
	    // apply any `formatters` transformations
	    var index = 0;
	    args[0] = args[0].replace(/%([a-z%])/g, function(match, format) {
	      // if we encounter an escaped % then don't increase the array index
	      if (match === '%%') return match;
	      index++;
	      var formatter = exports.formatters[format];
	      if ('function' === typeof formatter) {
	        var val = args[index];
	        match = formatter.call(self, val);
	
	        // now we need to remove `args[index]` since it's inlined in the `format`
	        args.splice(index, 1);
	        index--;
	      }
	      return match;
	    });
	
	    if ('function' === typeof exports.formatArgs) {
	      args = exports.formatArgs.apply(self, args);
	    }
	    var logFn = enabled.log || exports.log || console.log.bind(console);
	    logFn.apply(self, args);
	  }
	  enabled.enabled = true;
	
	  var fn = exports.enabled(namespace) ? enabled : disabled;
	
	  fn.namespace = namespace;
	
	  return fn;
	}
	
	/**
	 * Enables a debug mode by namespaces. This can include modes
	 * separated by a colon and wildcards.
	 *
	 * @param {String} namespaces
	 * @api public
	 */
	
	function enable(namespaces) {
	  exports.save(namespaces);
	
	  var split = (namespaces || '').split(/[\s,]+/);
	  var len = split.length;
	
	  for (var i = 0; i < len; i++) {
	    if (!split[i]) continue; // ignore empty strings
	    namespaces = split[i].replace(/\*/g, '.*?');
	    if (namespaces[0] === '-') {
	      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
	    } else {
	      exports.names.push(new RegExp('^' + namespaces + '$'));
	    }
	  }
	}
	
	/**
	 * Disable debug output.
	 *
	 * @api public
	 */
	
	function disable() {
	  exports.enable('');
	}
	
	/**
	 * Returns true if the given mode name is enabled, false otherwise.
	 *
	 * @param {String} name
	 * @return {Boolean}
	 * @api public
	 */
	
	function enabled(name) {
	  var i, len;
	  for (i = 0, len = exports.skips.length; i < len; i++) {
	    if (exports.skips[i].test(name)) {
	      return false;
	    }
	  }
	  for (i = 0, len = exports.names.length; i < len; i++) {
	    if (exports.names[i].test(name)) {
	      return true;
	    }
	  }
	  return false;
	}
	
	/**
	 * Coerce `val`.
	 *
	 * @param {Mixed} val
	 * @return {Mixed}
	 * @api private
	 */
	
	function coerce(val) {
	  if (val instanceof Error) return val.stack || val.message;
	  return val;
	}


/***/ },
/* 8 */
/***/ function(module, exports) {

	/**
	 * Helpers.
	 */
	
	var s = 1000;
	var m = s * 60;
	var h = m * 60;
	var d = h * 24;
	var y = d * 365.25;
	
	/**
	 * Parse or format the given `val`.
	 *
	 * Options:
	 *
	 *  - `long` verbose formatting [false]
	 *
	 * @param {String|Number} val
	 * @param {Object} options
	 * @return {String|Number}
	 * @api public
	 */
	
	module.exports = function(val, options){
	  options = options || {};
	  if ('string' == typeof val) return parse(val);
	  return options.long
	    ? long(val)
	    : short(val);
	};
	
	/**
	 * Parse the given `str` and return milliseconds.
	 *
	 * @param {String} str
	 * @return {Number}
	 * @api private
	 */
	
	function parse(str) {
	  str = '' + str;
	  if (str.length > 10000) return;
	  var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(str);
	  if (!match) return;
	  var n = parseFloat(match[1]);
	  var type = (match[2] || 'ms').toLowerCase();
	  switch (type) {
	    case 'years':
	    case 'year':
	    case 'yrs':
	    case 'yr':
	    case 'y':
	      return n * y;
	    case 'days':
	    case 'day':
	    case 'd':
	      return n * d;
	    case 'hours':
	    case 'hour':
	    case 'hrs':
	    case 'hr':
	    case 'h':
	      return n * h;
	    case 'minutes':
	    case 'minute':
	    case 'mins':
	    case 'min':
	    case 'm':
	      return n * m;
	    case 'seconds':
	    case 'second':
	    case 'secs':
	    case 'sec':
	    case 's':
	      return n * s;
	    case 'milliseconds':
	    case 'millisecond':
	    case 'msecs':
	    case 'msec':
	    case 'ms':
	      return n;
	  }
	}
	
	/**
	 * Short format for `ms`.
	 *
	 * @param {Number} ms
	 * @return {String}
	 * @api private
	 */
	
	function short(ms) {
	  if (ms >= d) return Math.round(ms / d) + 'd';
	  if (ms >= h) return Math.round(ms / h) + 'h';
	  if (ms >= m) return Math.round(ms / m) + 'm';
	  if (ms >= s) return Math.round(ms / s) + 's';
	  return ms + 'ms';
	}
	
	/**
	 * Long format for `ms`.
	 *
	 * @param {Number} ms
	 * @return {String}
	 * @api private
	 */
	
	function long(ms) {
	  return plural(ms, d, 'day')
	    || plural(ms, h, 'hour')
	    || plural(ms, m, 'minute')
	    || plural(ms, s, 'second')
	    || ms + ' ms';
	}
	
	/**
	 * Pluralization helper.
	 */
	
	function plural(ms, n, name) {
	  if (ms < n) return;
	  if (ms < n * 1.5) return Math.floor(ms / n) + ' ' + name;
	  return Math.ceil(ms / n) + ' ' + name + 's';
	}


/***/ }
/******/ ])
});
;
//# sourceMappingURL=react-transitionable.js.map