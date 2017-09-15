'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _isClass = require('is-class');

var _isClass2 = _interopRequireDefault(_isClass);

var _webview = require('./webview');

var _webview2 = _interopRequireDefault(_webview);

var _vue = require('vue');

var _vue2 = _interopRequireDefault(_vue);

var _directives = require('./directives');

var _directives2 = _interopRequireDefault(_directives);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Vue2x 驱动引擎
 */
/**
 * Created by evio on 2017/3/20.
 */
var Engine = function () {
    function Engine(ctx) {
        (0, _classCallCheck3.default)(this, Engine);

        this.ctx = ctx;

        ctx.on('app:end', function () {
            if (ctx.env === 'server') return;
            var scripts = ctx.element.querySelectorAll('script');
            var i = scripts.length;

            while (i--) {
                var script = scripts[i];
                if (script && script.parentNode) {
                    script.parentNode.removeChild(script);
                }
            }
        });
        ctx.on('server:render:polyfill', function (context) {
            var store = ctx.get('vuex');
            if (store) {
                context.state = store.state;
            }
        });

        ctx.on('client:render:polyfill', function () {
            var store = ctx.get('vuex');
            if (global.__INITIAL_STATE__ && store) {
                store.replaceState(global.__INITIAL_STATE__);
            }
        });

        ctx.on('client:render:mount', function (viewModule) {
            if (!ctx.element) throw new Error('miss ctx.element');
            if (!viewModule) throw new Error('miss view module');

            var el = ctx.element.querySelector('[data-server-rendered=true]');
            if (!el) throw new Error('miss data-server-rendered element');

            viewModule.$mount(el);
        });
    }

    (0, _createClass3.default)(Engine, [{
        key: 'create',
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(webview, options) {
                var _this = this;

                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                webview = checkWebViewObject(webview);
                                _context.next = 3;
                                return new Promise(function (resolve, reject) {
                                    try {
                                        var Arguments = {};

                                        switch (_this.ctx.env) {
                                            case 'web':
                                                Arguments.el = _this.createWebViewRoot();
                                                break;
                                            case 'client':
                                                if (_this.ctx.installed) {
                                                    Arguments.el = _this.createWebViewRoot();
                                                }
                                                break;
                                        }

                                        Arguments.propsData = options || {};
                                        Arguments.extends = _webview2.default;

                                        new webview(Arguments).$on('webview:created', function () {
                                            resolve(this);
                                        });
                                    } catch (e) {
                                        reject(e);
                                    }
                                });

                            case 3:
                                return _context.abrupt('return', _context.sent);

                            case 4:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function create(_x, _x2) {
                return _ref.apply(this, arguments);
            }

            return create;
        }()
    }, {
        key: 'install',
        value: function install() {
            var _this2 = this;

            _vue2.default.prototype.$miox = this.ctx;
            (0, _directives2.default)(this.ctx);
            var element = this.ctx.get('container') || global.document.body;
            this.ctx.on('app:start', function () {
                var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(webView) {
                    var el;
                    return _regenerator2.default.wrap(function _callee2$(_context2) {
                        while (1) {
                            switch (_context2.prev = _context2.next) {
                                case 0:
                                    if (webView) {
                                        _context2.next = 2;
                                        break;
                                    }

                                    return _context2.abrupt('return');

                                case 2:
                                    webView = checkWebViewObject(webView);

                                    if (!element) {
                                        _context2.next = 10;
                                        break;
                                    }

                                    _context2.next = 6;
                                    return new Promise(function (resolve, reject) {
                                        var vm = new webView();
                                        if (typeof vm.MioxInjectDestroy !== 'function') {
                                            return reject(new Error('wrong webView container'));
                                        }
                                        vm.$mount(element);
                                        vm.$on('webview:mounted', function () {
                                            return resolve(vm.mioxContainerElement);
                                        });
                                    });

                                case 6:
                                    el = _context2.sent;

                                    if (el) {
                                        _context2.next = 9;
                                        break;
                                    }

                                    throw new Error('miss container element');

                                case 9:
                                    _this2.ctx.set('container', el);

                                case 10:
                                case 'end':
                                    return _context2.stop();
                            }
                        }
                    }, _callee2, _this2);
                }));

                return function (_x3) {
                    return _ref2.apply(this, arguments);
                };
            }());
        }
    }, {
        key: 'createWebViewRoot',
        value: function createWebViewRoot() {
            if (!global.document) return;
            var element = global.document.createElement('div');
            var wrapElement = global.document.createElement('div');

            this.ctx.element.appendChild(element);
            element.appendChild(wrapElement);
            element.classList.add('mx-webview');

            return wrapElement;
        }
    }]);
    return Engine;
}();

exports.default = Engine;


function checkWebViewObject(webview) {
    if (!(0, _isClass2.default)(webview) && typeof webview !== 'function') {
        try {
            webview = _vue2.default.extend(webview);
        } catch (e) {
            throw new Error('`webview` argument is not a class object or a function or an object.');
        }
    }
    return webview;
}
module.exports = exports['default'];