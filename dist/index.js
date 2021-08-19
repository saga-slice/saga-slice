'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var redux = _interopDefault(require('redux'));
var effects = _interopDefault(require('redux-saga/effects'));
var immer = _interopDefault(require('immer'));

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var lib = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.rootReducer = exports.rootSaga = exports.createModule = void 0;
  var produce = typeof immer === 'function' ? immer : immer.produce;
  var takeLatest = effects.takeLatest;

  var genName = function genName(name, key) {
    return "".concat(name, "/").concat(key);
  };

  var sagaTakers = ['takeEvery', 'takeLatest', 'takeMaybe', 'takeLeading', 'debounce', 'throttle'];

  var hasSagaTakers = function hasSagaTakers(keys) {
    return sagaTakers.reduce(function (a, val) {
      if (a) {
        return a;
      }

      return keys.includes(val);
    }, false);
  };
  /**
   * Redux module creator makes types out of name + reducer keys.
   * Abstracts away the need for types or the creation of actions.
   * Also supports the creation of sagas for async actions.
   *
   * @param {ModuleOpts} opts Module config object
   *
   * @returns {SagaSlice} The created module with `name`,`actions`,`sagas`,`reducer`
   *
   * @example
   *
   * export default createModule({
   *     name: 'todos', // required
   *     initialState, // required
   *     reducers: { // required
   *          // Uses Immer for immutable state
   *          fetchAll: (state) => {
   *              state.isFetching = true;
   *          },
   *          fetchSuccess: (state, data) => {
   *              state.isFetching = false;
   *              state.data = data;
   *          },
   *          fetchFail: (state, error) => {
   *              state.isFetching = false;
   *              state.error = error;
   *          },
   *          // create empty functions to use as types for sagas
   *          someOtherAction: () => {},
   *     },
   *     sagas: (A) => ({
   *         * [A.fetchAll]({ payload }) {
   *             try {
   *                 const { data } = yield axios.get('/todos');
   *                 yield put(A.fetchSuccess(data));
   *             }
   *             catch (e) {
   *                 yield put(A.fetchFail(e));
   *             }
   *         }
   *     })
   * });
   */

  exports.createModule = function (opts) {
    var name = opts.name,
        initialState = opts.initialState;
    var extractsInitial = {
      actions: {},
      reducers: {},
      takers: {}
    };
    var reducerEntries = Object.entries(opts.reducers);
    var defaultTaker = takeLatest;
    var takerOpts = opts.takers || {}; // if takers config is a string that is an existing effect
    // set it to that effect

    if (typeof takerOpts === 'string' && sagaTakers.includes(takerOpts)) {
      defaultTaker = effects[takerOpts];
    } else if (typeof takerOpts === 'function') {
      defaultTaker = takerOpts;
    } else {
      // if takers is configured to { [taker]: [...reduxTypes] }
      // we're going to reverse that config and set it to { [reduxType]: effects[taker] }
      if (hasSagaTakers(Object.keys(takerOpts))) {
        takerOpts = Object.entries(takerOpts).reduce(function (takers, optEntry) {
          var _optEntry = _slicedToArray(optEntry, 2),
              key = _optEntry[0],
              val = _optEntry[1]; // if key is a taker
          // iterate through its value and set taker


          if (sagaTakers.includes(key)) {
            val.forEach(function (t) {
              takers[t] = effects[key];
            });
          } else {
            // leave other configs alone as well
            takers[key] = val;
          }

          return takers;
        }, {});
      }
    } // Iterate over reducer properties, extract types and actions


    var extracted = reducerEntries.reduce(function (acc, entry) {
      var _entry = _slicedToArray(entry, 2),
          key = _entry[0],
          val = _entry[1]; // Create the type


      var type = genName(name, key); // Create action

      acc.actions[key] = function (payload) {
        return {
          type: type,
          payload: payload
        };
      };

      acc.actions[key].type = type;

      acc.actions[key].toString = function () {
        return type;
      }; // Bind reducer to type


      acc.reducers[type] = val; // Set takers either from options or defaultTaker

      acc.takers[type] = (takerOpts || {})[key] || defaultTaker;
      return acc;
    }, extractsInitial);
    var actions = extracted.actions,
        reducers = extracted.reducers,
        takers = extracted.takers; // Reducer for redux using Immer

    var moduleReducer = function moduleReducer() {
      var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
      var action = arguments.length > 1 ? arguments[1] : undefined;
      var type = action.type,
          payload = action.payload;
      var reducer = reducers[type];

      if (typeof reducer === 'function') {
        return produce(state, function (draft) {
          return reducer(draft, payload);
        });
      }

      return state;
    }; // Iterate over sagas and prepare them


    var sagas = [];

    if (opts.sagas) {
      var sagasEntries = Object.entries(opts.sagas(actions));
      sagas = sagasEntries.map(function (entry) {
        var _entry2 = _slicedToArray(entry, 2),
            type = _entry2[0],
            sagaObj = _entry2[1]; // Saga object can be a generator function, or object
        // with `saga`, `taker`, `watcher`


        var saga = sagaObj.saga;
        var taker = sagaObj.taker || takers[type];

        if (!taker) {
          taker = defaultTaker;
        }

        if (typeof sagaObj === 'function') {
          saga = sagaObj;
        }

        return /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.next = 2;
                  return taker(type, saga);

                case 2:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee);
        });
      });
    } // Returns actions in a camel case format based on name `[slice name][action]`
    // EG: `todoFetchAll` `todoFetchSuccess` etc


    var namedActions = Object.entries(actions).reduce(function (acc, entry) {
      var _entry3 = _slicedToArray(entry, 2),
          key = _entry3[0],
          action = _entry3[1];

      var namedKey = name + key[0].toUpperCase() + key.slice(1);
      acc[namedKey] = action;
      return acc;
    }, {}); // State selector

    var getState = function getState(state) {
      return state[name];
    };

    return {
      name: name,
      namedActions: namedActions,
      actions: actions,
      sagas: sagas,
      getState: getState,
      reducer: moduleReducer
    };
  };
  /**
   *
   * Creates a root saga. Accepts an array of modules.
   *
   * @param {SagaSlice[]} modules Array of modules created using `createModule`
   *
   * @returns {Generator} Generator function for sagas
   *
   * @example
   *
   * const sagaMiddleware = createSagaMiddleware();
   * sagaMiddleware.run(rootSaga(sagaSliceModules));
   */


  exports.rootSaga = function (modules) {
    return /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return effects.all(modules.map(function (slice) {
                return slice.sagas;
              }).reduce(function (a, c) {
                return a.concat(c);
              }, []).map(function (saga) {
                return saga();
              }));

            case 2:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    });
  };
  /**
   * Creates root reducer by combining reducers.
   * Accepts array of modules and extra reducers object.
   *
   * @arg {Array.<SagaSlice>} modules Array of modules created using `createModule`
   * @arg {Object.<String, Function>} others Object of extra reducers not created by `saga-slice`
   *
   * @returns {Function} Root redux reducer using `combineReducers()`
   *
   * @example
   *
   * const store = createStore(
   *     rootReducer(sagaSliceModules, extraReducers),
   *     composeEnhancers(applyMiddleware(...middleware))
   * );
   */


  exports.rootReducer = function (modules) {
    var others = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var reducers = modules.reduce(function (a, slice) {
      var name = slice.name,
          reducer = slice.reducer;
      a[name] = reducer;
      return a;
    }, {});
    return redux.combineReducers(_objectSpread2(_objectSpread2({}, reducers), others));
  };
});
var index = unwrapExports(lib);
var lib_1 = lib.rootReducer;
var lib_2 = lib.rootSaga;
var lib_3 = lib.createModule;

exports.createModule = lib_3;
exports.default = index;
exports.rootReducer = lib_1;
exports.rootSaga = lib_2;
