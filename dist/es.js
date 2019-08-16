import { takeEvery, all } from 'redux-saga/effects';
import produce from 'immer';
import { combineReducers } from 'redux';

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

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
      ownKeys(source, true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(source).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
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

var Generator =
/*#__PURE__*/
regeneratorRuntime.mark(function _callee() {
  return regeneratorRuntime.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
        case "end":
          return _context.stop();
      }
    }
  }, _callee);
}).constructor;
var isTrueObject = function isTrueObject(val) {
  return val.constructor === Object;
};
var isArray = function isArray(val) {
  return val.constructor === Array;
};
var isFunction = function isFunction(fn) {
  return fn instanceof Function;
};
var isGenerator = function isGenerator(fn) {
  return fn instanceof Generator;
};
var genName = function genName(name, key) {
  return "".concat(name, "/").concat(key);
};
var assert = function assert(cond, message) {
  if (!cond) throw Error(message);
};
var areGenerators = function areGenerators(arr) {
  assert(isArray(arr), 'modules must be an array');
  arr.forEach(function (i) {
    assert(isGenerator(i), "saga must be a generator function");
  });
};

var SagaSlice = function SagaSlice(props) {
  _classCallCheck(this, SagaSlice);

  assert(props.name, 'slice module must have a name');
  assert(props.actions, 'slice module must have actions');
  assert(isFunction(props.reducer), 'reducer must be a function');
  assert(isArray(props.sagas), 'sagas must be an array');
  Object.entries(props.actions).forEach(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        k = _ref2[0],
        a = _ref2[1];

    assert(typeof a === 'function', "".concat(k, " action must be a function"));
  });
  areGenerators(props.sagas);
  Object.assign(this, props);
};
var isSagaSlice = function isSagaSlice(item) {
  return item instanceof SagaSlice;
};
var areSagaSlices = function areSagaSlices(arr) {
  assert(isArray(arr), 'modules must be an array');
  arr.forEach(function (i) {
    assert(isSagaSlice(i), 'item should be a saga slice');
  });
};

/**
 * Redux module creator makes types out of name + reducer keys.
 * Abstracts away the need for types or the creation of actions.
 * Also supports the creation of sagas for async actions.
 *
 * @param {object} opts Module config object that contains `name`, `sagas`, `reducers`, and `initialState`
 *
 * @returns {object} The created module with `name`,`actions`,`sagas`,`reducer`
 *
 * @example
 *
 * import ReduxTool from '..';
 *
 * const initialState = {
 *     isFetching: false,
 *     data: null,
 *     error: null
 * };
 *
 * export default ReduxTool.createModule({
 *     name: 'todos', // required
 *     initialState, // required
 *     reducers: { // required
 *          // Uses Immer for immutable state
 *          fetchAll: (state) => {
 *
 *              state.isFetching = true;
 *          },
 *          fetchSuccess: (state, data) => {
 *
 *              state.isFetching = false;
 *              state.data = data;
 *          },
 *          fetchFail: (state, error) => {
 *
 *              state.isFetching = false;
 *              state.error = error;
 *          },
 *
 *          // create empty functions to use as types for sagas
 *          someOtherAction: () => {},
 *     },
 *     sagas: (A) => ({
 *         * [A.fetchAll]({ payload }) {
 *
 *             try {
 *
 *                 const { data } = yield axios.get('/todos');
 *                 yield put(A.fetchSuccess(data));
 *             }
 *             catch (e) {
 *
 *                 yield put(A.fetchFail(e));
 *             }
 *         }
 *     })
 * });
 */

var createModule = function createModule(opts) {
  assert(opts && isTrueObject(opts), 'options must be an object');
  var name = opts.name,
      initialState = opts.initialState;
  assert(opts.name, 'name is required');
  assert(opts.reducers, 'reducers is required');
  assert(opts.initialState !== undefined, 'initialState is required');
  assert(isTrueObject(opts.reducers), 'reducers must be an object');
  assert(opts.sagas === undefined || isFunction(opts.sagas), 'sagas must be a function'); // Iterate over reducer properties, extract types and actions

  var _Object$entries$reduc = Object.entries(opts.reducers).reduce(function (acc, _ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        key = _ref2[0],
        val = _ref2[1];

    // Create the type
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
    return acc;
  }, {
    actions: {},
    reducers: {}
  }),
      actions = _Object$entries$reduc.actions,
      reducers = _Object$entries$reduc.reducers; // Reducer for redux using Immer


  var moduleReducer = function moduleReducer() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;

    var _ref3 = arguments.length > 1 ? arguments[1] : undefined,
        type = _ref3.type,
        payload = _ref3.payload;

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
    sagas = Object.entries(opts.sagas(actions)).map(function (_ref4) {
      var _ref5 = _slicedToArray(_ref4, 2),
          type = _ref5[0],
          sagaObj = _ref5[1];

      // Saga object can be a generator function, or object
      // with `saga`, `taker`, `watcher`
      var saga = sagaObj.saga,
          taker = sagaObj.taker,
          watcher = sagaObj.watcher;

      if (watcher) {
        return watcher;
      }

      if (isGenerator(sagaObj)) {
        saga = sagaObj;
        taker = takeEvery;
      } else {
        taker = taker || takeEvery;
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

  return new SagaSlice({
    name: name,
    actions: actions,
    sagas: sagas,
    reducer: moduleReducer
  });
};

/**
 * Creates a root saga. Accepts an array of modules.
 *
 * @param {array} modules Array of modules created using `createModule`
 *
 * @returns {generator} Generator function for sagas
 *
 * @example
 *
 * const sagaMiddleware = createSagaMiddleware();
 * sagaMiddleware.run(rootSaga(reduxModules));
 */

var rootSaga = function rootSaga(modules) {
  areSagaSlices(modules);
  return (
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee() {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return all(modules.map(function (_ref) {
                var sagas = _ref.sagas;
                return sagas;
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

/**
 * Creates root reducer by combining reducers.
 * Accepts array of modules and and extra reducers object.
 *
 * @param {array} modules Array of modules created using `createModule`
 * @param {object} others Object of extra reducers not created by saga-slice
 *
 * @returns {object} Redux combined reducers
 *
 * @example
 *
 * const store = createStore(
 *     rootReducer(reduxModules, extraReducers),
 *     composeEnhancers(applyMiddleware(...middleware))
 * );
 */

var rootReducer = function rootReducer(modules) {
  var others = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  areSagaSlices(modules);
  assert(isTrueObject(others), 'other reducers must be an object');
  var reducers = modules.reduce(function (a, _ref) {
    var name = _ref.name,
        reducer = _ref.reducer;
    a[name] = reducer;
    return a;
  }, {});
  return combineReducers(_objectSpread2({}, reducers, {}, others));
};

export { createModule, rootReducer, rootSaga };
