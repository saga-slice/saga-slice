'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var effects = _interopDefault(require('redux-saga/effects'));
var immer = _interopDefault(require('immer'));
var redux = _interopDefault(require('redux'));

function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) {
    return;
  }

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

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
}

var createModule = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var takeEvery = effects.takeEvery,
      takeLatest = effects.takeLatest;

  var genName = function genName(name, key) {
    return "".concat(name, "/").concat(key);
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
    var onlyTakeLatest = typeof opts.takers === 'string' && /latest/i.test(opts.takers); // Iterate over reducer properties, extract types and actions

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


      acc.reducers[type] = val;

      if (onlyTakeLatest) {
        acc.takers[type] = takeLatest;
      } else {
        acc.takers[type] = (opts.takers || {})[key];
      }

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
        return immer["default"](state, function (draft) {
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
          taker = onlyTakeLatest ? takeLatest : takeEvery;
        }

        if (typeof sagaObj === 'function') {
          saga = sagaObj;
        }

        return (
          /*#__PURE__*/
          regeneratorRuntime.mark(function _callee() {
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
          })
        );
      });
    }

    return {
      name: name,
      actions: actions,
      sagas: sagas,
      reducer: moduleReducer
    };
  };
});
unwrapExports(createModule);
var createModule_1 = createModule.createModule;

var rootSaga = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
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
    return (
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return effects.all(modules.map(function (slice) {
                  return slice.sagas;
                }).reduce(function (a, c) {
                  return a.concat(c);
                }, []).map(function (saga) {
                  return saga();
                }));

              case 2:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      })
    );
  };
});
unwrapExports(rootSaga);
var rootSaga_1 = rootSaga.rootSaga;

var rootReducer = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  /**
   * Creates root reducer by combining reducers.
   * Accepts array of modules and and extra reducers object.
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
    return redux.combineReducers(Object.assign(Object.assign({}, reducers), others));
  };
});
unwrapExports(rootReducer);
var rootReducer_1 = rootReducer.rootReducer;

var lib = createCommonjsModule(function (module, exports) {

  function __export(m) {
    for (var p in m) {
      if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
  }

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  __export(createModule);

  __export(rootSaga);

  __export(rootReducer);
});
var index = unwrapExports(lib);

module.exports = index;
