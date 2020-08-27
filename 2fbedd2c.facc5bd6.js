(window.webpackJsonp=window.webpackJsonp||[]).push([[10],{64:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return r})),n.d(t,"metadata",(function(){return i})),n.d(t,"rightToc",(function(){return s})),n.d(t,"default",(function(){return b}));var a=n(2),o=n(6),c=(n(0),n(92)),r={id:"create-module",title:"createModule API",sidebar_label:"createModule"},i={unversionedId:"api/create-module",id:"api/create-module",isDocsHomePage:!1,title:"createModule API",description:"createModule ModuleOpts) => SagaSlice",source:"@site/docs/api/create-module.md",permalink:"/docs/api/create-module",editUrl:"https://github.com/facebook/docusaurus/edit/master/website/docs/api/create-module.md",sidebar_label:"createModule",sidebar:"docs",previous:{title:"Philosophy",permalink:"/docs/philosophy"},next:{title:"rootReducer and rootSaga API",permalink:"/docs/api/redux-wiring"}},s=[{value:"createModule: (opts: ModuleOpts) =&gt; SagaSlice",id:"createmodule-opts-moduleopts--sagaslice",children:[]},{value:"Sample Usage",id:"sample-usage",children:[]},{value:"How it works",id:"how-it-works",children:[]},{value:"Options",id:"options",children:[]},{value:"<strong>Actions Map</strong>",id:"actions-map",children:[]},{value:"Sagas",id:"sagas",children:[]},{value:"Takers",id:"takers",children:[]}],l={rightToc:s};function b(e){var t=e.components,n=Object(o.a)(e,["components"]);return Object(c.b)("wrapper",Object(a.a)({},l,n,{components:t,mdxType:"MDXLayout"}),Object(c.b)("h2",{id:"createmodule-opts-moduleopts--sagaslice"},"createModule: (opts: ModuleOpts) => SagaSlice"),Object(c.b)("p",null,"The secret sauce for saga-slice is the ",Object(c.b)("inlineCode",{parentName:"p"},"createModule")," helper. It brings together ",Object(c.b)("inlineCode",{parentName:"p"},"types"),", ",Object(c.b)("inlineCode",{parentName:"p"},"actions"),", ",Object(c.b)("inlineCode",{parentName:"p"},"reducers")," and ",Object(c.b)("inlineCode",{parentName:"p"},"sagas")," into 1 file, dramatically reducing the amount of boilerplate needed to create an object store. At the simplest level, this can be used to manage your redux state; but if you wanted to add asynchronous functionality and deal with side-effects, you can also add sagas to the same file."),Object(c.b)("h2",{id:"sample-usage"},"Sample Usage"),Object(c.b)("pre",null,Object(c.b)("code",Object(a.a)({parentName:"pre"},{className:"language-js"}),"import { createModule } from 'saga-slice';\n\nexport default createModule({\n    name: 'todos',\n    intialState: { /\\* ... \\*/ },\n    reducers: { /\\* ... \\*/ },\n    sagas: { /\\* ... \\*/ }, // optional\n    takers: { /\\* ... \\*/ }, // optional\n});\n\n// Returns:\n// {\n//     name: 'todos',\n//     actions: {/\\* ... \\*/},\n//     sagas: \\[/\\* ... \\*/\\]\n//     reducer: /\\* ... \\*/\n// }\n")),Object(c.b)("h2",{id:"how-it-works"},"How it works"),Object(c.b)("ul",null,Object(c.b)("li",{parentName:"ul"},Object(c.b)("p",{parentName:"li"},"When you create your saga slice, every reducer you create generates a subsequent ",Object(c.b)("inlineCode",{parentName:"p"},"type")," and ",Object(c.b)("inlineCode",{parentName:"p"},"action"),".")),Object(c.b)("li",{parentName:"ul"},Object(c.b)("p",{parentName:"li"},"Types are created in the format of",Object(c.b)("inlineCode",{parentName:"p"},"{name}/{key}")," where ",Object(c.b)("inlineCode",{parentName:"p"},"name")," is derived from ",Object(c.b)("inlineCode",{parentName:"p"},"opts.name")," and ",Object(c.b)("inlineCode",{parentName:"p"},"type")," is the key name defined in reducer object.")),Object(c.b)("li",{parentName:"ul"},Object(c.b)("p",{parentName:"li"},"Reducers is a map of key/value pairs where key is used to generate types, and value is a reducer function."),Object(c.b)("ul",{parentName:"li"},Object(c.b)("li",{parentName:"ul"},Object(c.b)("p",{parentName:"li"},"Reducer functions have the signature ",Object(c.b)("inlineCode",{parentName:"p"},"(state, payload) => {}")," , where ",Object(c.b)("inlineCode",{parentName:"p"},"state")," is clone of the current state, which can be directly manipulated, and ",Object(c.b)("inlineCode",{parentName:"p"},"payload")," is the data that was dispatched into the action.")),Object(c.b)("li",{parentName:"ul"},Object(c.b)("p",{parentName:"li"},"These functions are essentially ",Object(c.b)("a",Object(a.a)({parentName:"p"},{href:"https://immerjs.github.io/immer/docs/produce"}),"immer producers"),".")),Object(c.b)("li",{parentName:"ul"},Object(c.b)("p",{parentName:"li"},"The way that you manipulate the state is by hoisting to the object directly. There is no need to return anything. You can minimally pass an empty function to simply declare a type and action."))))),Object(c.b)("p",null,"Take this example:"),Object(c.b)("pre",null,Object(c.b)("code",Object(a.a)({parentName:"pre"},{className:"language-js"}),"const slice = createModule({\n    name: 'todos',\n    // ...\n    reducers: {\n        randomAction: () => {}\n    }\n});\n")),Object(c.b)("p",null,"This would generate ",Object(c.b)("inlineCode",{parentName:"p"},"slice.actions.randomAction")," and the ",Object(c.b)("inlineCode",{parentName:"p"},"todos/randomAction")," type, which would be dispatched using the action function:"),Object(c.b)("pre",null,Object(c.b)("code",Object(a.a)({parentName:"pre"},{className:"language-js"}),"const action = slice.actions.randomAction({ test: true });\n\n// Returns:\n// {\n//     type: 'todos/randomAction',\n//     payload: { test: true }\n// }\n\ndispatch(action)\n")),Object(c.b)("p",null,"Because we did not tell the reducer to manipulate the state in any way, this would do nothing but serve as a way to create types and actions; however, if we wanted to do something with what we passed into the action, we could do the following:"),Object(c.b)("pre",null,Object(c.b)("code",Object(a.a)({parentName:"pre"},{className:"language-js"}),"const slice = createModule({\n    name: 'todos',\n    initialState: {},\n    reducers: {\n    randomAction: (state, payload) => {\n        state.results = payload;\n        }\n    }\n});\n\nconsole.log(getState().todos);\n// Returns:\n// {}\n\ndispatch(slice.actions.randomAction({ test: true }));\n\nconsole.log(getState().todos);\n// Returns:\n// {\n//     results: {\n//         test: true\n//     }\n// }\n")),Object(c.b)("h2",{id:"options"},"Options"),Object(c.b)("table",null,Object(c.b)("thead",{parentName:"table"},Object(c.b)("tr",{parentName:"thead"},Object(c.b)("th",Object(a.a)({parentName:"tr"},{align:null}),"Option Name"),Object(c.b)("th",Object(a.a)({parentName:"tr"},{align:null}),"Required"),Object(c.b)("th",Object(a.a)({parentName:"tr"},{align:null}),"Data Type"),Object(c.b)("th",Object(a.a)({parentName:"tr"},{align:null}),"Description"))),Object(c.b)("tbody",{parentName:"table"},Object(c.b)("tr",{parentName:"tbody"},Object(c.b)("td",Object(a.a)({parentName:"tr"},{align:null}),"name"),Object(c.b)("td",Object(a.a)({parentName:"tr"},{align:null}),"yes"),Object(c.b)("td",Object(a.a)({parentName:"tr"},{align:null}),"string"),Object(c.b)("td",Object(a.a)({parentName:"tr"},{align:null}),"Name used to identify reducer in the global state and format redux types.")),Object(c.b)("tr",{parentName:"tbody"},Object(c.b)("td",Object(a.a)({parentName:"tr"},{align:null}),"initialState"),Object(c.b)("td",Object(a.a)({parentName:"tr"},{align:null}),"yes"),Object(c.b)("td",Object(a.a)({parentName:"tr"},{align:null}),"object"),Object(c.b)("td",Object(a.a)({parentName:"tr"},{align:null}),"The initial reducer state")),Object(c.b)("tr",{parentName:"tbody"},Object(c.b)("td",Object(a.a)({parentName:"tr"},{align:null}),"\u200breducers\u200b"),Object(c.b)("td",Object(a.a)({parentName:"tr"},{align:null}),"yes"),Object(c.b)("td",Object(a.a)({parentName:"tr"},{align:null}),"object"),Object(c.b)("td",Object(a.a)({parentName:"tr"},{align:null}),"Map of reducers. Object values must be functions.")),Object(c.b)("tr",{parentName:"tbody"},Object(c.b)("td",Object(a.a)({parentName:"tr"},{align:null}),"\u200bsagas\u200b"),Object(c.b)("td",Object(a.a)({parentName:"tr"},{align:null}),"no"),Object(c.b)("td",Object(a.a)({parentName:"tr"},{align:null}),"function"),Object(c.b)("td",Object(a.a)({parentName:"tr"},{align:null}),"Sagas function ",Object(c.b)("inlineCode",{parentName:"td"},"(actions: any) => { [key: string]: SagaObject }"))),Object(c.b)("tr",{parentName:"tbody"},Object(c.b)("td",Object(a.a)({parentName:"tr"},{align:null}),"\u200btakers\u200b"),Object(c.b)("td",Object(a.a)({parentName:"tr"},{align:null}),"no"),Object(c.b)("td",Object(a.a)({parentName:"tr"},{align:null}),"object","|","string","|","generator"),Object(c.b)("td",Object(a.a)({parentName:"tr"},{align:null}),"Takers to be used. Can be a string that names a redux saga taker such as ",Object(c.b)("inlineCode",{parentName:"td"},"takeLatest"),". Can also be a generator function or map of ",Object(c.b)("inlineCode",{parentName:"td"},"{ reducerName: takeLatest }")," or ",Object(c.b)("inlineCode",{parentName:"td"},"{ takeLatest: ['reducerName'] }"),".")))),Object(c.b)("h2",{id:"actions-map"},Object(c.b)("strong",{parentName:"h2"},"Actions Map")),Object(c.b)("p",null,"The resulting object from a ",Object(c.b)("inlineCode",{parentName:"p"},"createModule")," has an ",Object(c.b)("inlineCode",{parentName:"p"},"actions")," property which is a map of functions to dispatch redux actions. Action functions have a ",Object(c.b)("inlineCode",{parentName:"p"},"type")," property which returns the generated type. Take the following example:"),Object(c.b)("pre",null,Object(c.b)("code",Object(a.a)({parentName:"pre"},{className:"language-javascript"}),"const slice = createModule({\n    name: 'todos',\n    initialState: {},\n    reducers: {\n        create: () => {},\n        read: () => {},\n        update: () => {},\n        delete: () => {}\n    }\n});\n")),Object(c.b)("p",null,Object(c.b)("inlineCode",{parentName:"p"},"slice.actions")," would have the following:"),Object(c.b)("pre",null,Object(c.b)("code",Object(a.a)({parentName:"pre"},{className:"language-javascript"}),"slice.actions.create.type;\n// todos/create'\n\nslice.actions.create();\n// Returns:\n// {\n//     type: 'todos/create',\n//     payload: undefined\n// }\n\nslice.actions.read.type;\n// todos/read'\n\nslice.actions.read();\n// Returns:\n// {\n//     type: 'todos/read',\n//     payload: undefined\n// }\n\nslice.actions.update.type;\n// todos/update'\n\nslice.actions.update();\n// Returns:\n// {\n//     type: 'todos/update',\n//     payload: undefined\n// }\n\nslice.actions.delete.type;\n// todos/delete'\n\nslice.actions.delete();\n// Returns:\n// {\n//     type: 'todos/delete',\n//     payload: undefined\n// }\n")),Object(c.b)("h2",{id:"sagas"},"Sagas"),Object(c.b)("p",null,"Finally, we can define sagas. This entire section assumes that you have a basic understand of redux sagas. The sagas option is a function with the signature ",Object(c.b)("inlineCode",{parentName:"p"},"(actions) => ({})"),". The returned value should be an object of key value pairs where keys are action types to be passed into redux saga effects, and value is either a generator function or configuration object. This option is the only option not required for creating a saga-slice module."),Object(c.b)("div",{className:"admonition admonition-info alert alert--info"},Object(c.b)("div",Object(a.a)({parentName:"div"},{className:"admonition-heading"}),Object(c.b)("h5",{parentName:"div"},Object(c.b)("span",Object(a.a)({parentName:"h5"},{className:"admonition-icon"}),Object(c.b)("svg",Object(a.a)({parentName:"span"},{xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"}),Object(c.b)("path",Object(a.a)({parentName:"svg"},{fillRule:"evenodd",d:"M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 0 1 1.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"})))),"info")),Object(c.b)("div",Object(a.a)({parentName:"div"},{className:"admonition-content"}),Object(c.b)("h4",Object(a.a)({parentName:"div"},{id:"meta-programming-ahead"}),"Meta programming ahead:"),Object(c.b)("p",{parentName:"div"},"In the following example, you will notice a strange implementation that will not immediately make sense unless you understand the magic behind it."),Object(c.b)("p",{parentName:"div"},"Javascript is quirky and allows us to do weird things. Sometimes that's a good thing and we can do things like:"),Object(c.b)("pre",{parentName:"div"},Object(c.b)("code",Object(a.a)({parentName:"pre"},{className:"language-javascript"}),"function xyz () {}\n\nconst x = { [xyz]: true };\n\nconsole.log(x);\n// > { 'function xyz () {}': true }\n")),Object(c.b)("p",{parentName:"div"},"This happens because ",Object(c.b)("inlineCode",{parentName:"p"},"xyz.toString()")," generates the string ",Object(c.b)("inlineCode",{parentName:"p"},"'function xyz () {}'"),", and javascript coerces types into string in order to successfully create an object. We leverage this behavior for the creation of our saga configuration object."))),Object(c.b)("pre",null,Object(c.b)("code",Object(a.a)({parentName:"pre"},{className:"language-javascript"}),"const slice = createModule({\n    name: 'todos',\n    initialState: {},\n    reducers: {\n        fetch: (state) => {\n            state.isLoading = true;\n        },\n        fetchSuccess: (state, payload) => {\n            state.isLoading = false;\n            state.data = payload;\n        },\n        fetchFail: () => {\n            state.isLoading = false;\n        },\n        fetchDone: () => {}\n    },\n    sagas: (actions) => {\n        return {\n            [actions.fetch]: {\n                saga: function* () {\n                    try {\n                        const { data } = yield axios.get('/todos');\n                        yield put(actions.fetchSuccess(data));\n                    }\n                    catch (e) {\n                        yield put(actions.fetchFail(e));\n                    }\n\n                    yield put(actions.fetchDone());\n                },\n                taker: takeEvery\n            },\n            [actions.fetchSuccess]: function* ({ payload: data }) {\n                alert('successfully fetched ' + data.length + 'todos');\n                yield;\n            },\n            [actions.fetchFail]: function* ({ payload: error }) {\n                alert('oh no! failed to fetch todos!');\n                console.log(error);\n                yield;\n            },\n            [actions.fetchDone]: function* () {\n                alert('fetching todos is completed!');\n                yield;\n            }\n        }\n    }\n});\n")),Object(c.b)("p",null,Object(c.b)("em",{parentName:"p"},Object(c.b)("strong",{parentName:"em"},".... wait... what?"))),Object(c.b)("p",null,"Let's take it step by step by addressing the meta programming:"),Object(c.b)("p",null,"Under the hood, when actions are created, certain builtins are overwritten. In particular, the default ",Object(c.b)("inlineCode",{parentName:"p"},"Function.prototype.toString")," is overwritten for actions to always return its type. Essentially, ",Object(c.b)("inlineCode",{parentName:"p"},"actions.fetch.type")," is the same as ",Object(c.b)("inlineCode",{parentName:"p"},"actions.fetch.toString()"),". The latter is added for the convenience of using our actions as both keys and functions."),Object(c.b)("p",null,"Theoretical example:"),Object(c.b)("pre",null,Object(c.b)("code",Object(a.a)({parentName:"pre"},{className:"language-javascript"}),"const hypothesis = (actions) => ({\n    [actions.fetch]: true,\n    [actions.fetchSuccess]: true,\n    [actions.fetchFail]: true,\n    [actions.fetchDone]:   true\n})\n\nconsole.log(hypothesis(sagaSlice.actions));\n// > {\n//     'todos/create': true,\n//     'todos/read': true,\n//     'todos/update': true,\n//     'todos/delete': true\n// }\n")),Object(c.b)("p",null,"You could technically also do:"),Object(c.b)("pre",null,Object(c.b)("code",Object(a.a)({parentName:"pre"},{className:"language-javascript"}),"(actions) => {\n    [actions.fetch.type]: function* () {},\n}\n\n// OR\n\n(actions) => {\n    'todos/create': function* () {},\n}\n")),Object(c.b)("p",null,"Really, whatever you feel comfortable with. The convenience of passing the action function is there so that you don't have to guess or potentially misspell the action types while you're writing sagas."),Object(c.b)("p",null,"Next, let's address the saga configuration object. A saga config can either be a generator function, or a config with a generator function and/or a taker. If the value is a generator function, the saga will be ran using the ",Object(c.b)("inlineCode",{parentName:"p"},"takeEvery")," effect."),Object(c.b)("p",null,Object(c.b)("em",{parentName:"p"},Object(c.b)("strong",{parentName:"em"},"Option A: Generator function"))),Object(c.b)("pre",null,Object(c.b)("code",Object(a.a)({parentName:"pre"},{className:"language-javascript"}),"const slice = createModule({\n    // ...\n    sagas: (actions) => ({\n        // The value for this action is a generator function\n        // `takeEvery` will be the default taker\n        [actions.fetch]: function* () {}\n    })\n});\n")),Object(c.b)("p",null,Object(c.b)("em",{parentName:"p"},Object(c.b)("strong",{parentName:"em"},"Option B: Config object"))),Object(c.b)("pre",null,Object(c.b)("code",Object(a.a)({parentName:"pre"},{className:"language-javascript"}),"const slice = createModule({\n    // ...\n    sagas: (actions) => ({\n\n        // The value for this action is a config object\n        [actions.fetch]: {\n\n            // Define the generator function\n            saga: function* () {},\n            // Specify the taker\n            taker: takeLatest\n        }\n    })\n});\n")),Object(c.b)("p",null,"For option B, essentially, any taker that can follow the signature ",Object(c.b)("inlineCode",{parentName:"p"},"function (type, saga)")," can be used to run the saga. In the cases where a taker doesn't exactly match that signature, such as ",Object(c.b)("inlineCode",{parentName:"p"},"debounce"),", you can always bind it to fulfill that effect's required arity."),Object(c.b)("pre",null,Object(c.b)("code",Object(a.a)({parentName:"pre"},{className:"language-text"}),"// ...\n[actions.fetch]: {\n    saga: function* () {},\n    taker: debounce.bind(debounce, 2000)\n}\n")),Object(c.b)("p",null,"See ",Object(c.b)("a",Object(a.a)({parentName:"p"},{href:"https://redux-saga.js.org/docs/api/"}),"redux sagas API reference")," for more details on what you can use."),Object(c.b)("h2",{id:"takers"},"Takers"),Object(c.b)("p",null,"Takers can be declared as part of configuration options in a multitude of ways. This is good for setting the default taker for all you sagas, or setting a taker for one or many of your sagas. You can use it as follows:"),Object(c.b)("pre",null,Object(c.b)("code",Object(a.a)({parentName:"pre"},{className:"language-javascript"}),"const slice = createModule({\n    reducers: { ... },\n    sagas: (actions) => ({\n        [actions.fetch]: function* () {},\n        [actions.fetchSuccess]: function* () {},\n        [actions.fetchFail]: function* () {},\n        ...\n    }),\n\n    // Apply takeLatest to all sagas\n    takers: 'takeLatest',\n\n    // OR\n    // Apply takeLatest to some sagas\n    takers: {\n        takeLatest: ['fetch', 'fetchSuccess']\n    },\n\n    // OR\n    // Apply custom takers\n    takers: {\n        fetch: throttle.bind(throttle, 1000),\n        fetchSuccess: debounce.bind(debounce, 1000)\n    }\n});\n")),Object(c.b)("h4",{id:"allowed-non-custom-takers"},"Allowed non-custom takers"),Object(c.b)("p",null,"When ",Object(c.b)("inlineCode",{parentName:"p"},"takers")," option is a string, or when a value in ",Object(c.b)("inlineCode",{parentName:"p"},"takers")," is an array, you can only apply the following effects:"),Object(c.b)("ul",null,Object(c.b)("li",{parentName:"ul"},Object(c.b)("inlineCode",{parentName:"li"},"takeEvery")),Object(c.b)("li",{parentName:"ul"},Object(c.b)("inlineCode",{parentName:"li"},"takeLatest")),Object(c.b)("li",{parentName:"ul"},Object(c.b)("inlineCode",{parentName:"li"},"takeMaybe")),Object(c.b)("li",{parentName:"ul"},Object(c.b)("inlineCode",{parentName:"li"},"takeLeading")),Object(c.b)("li",{parentName:"ul"},Object(c.b)("inlineCode",{parentName:"li"},"debounce")),Object(c.b)("li",{parentName:"ul"},Object(c.b)("inlineCode",{parentName:"li"},"throttle"))),Object(c.b)("p",null,"The following are acceptable configuration options"),Object(c.b)("pre",null,Object(c.b)("code",Object(a.a)({parentName:"pre"},{className:"language-javascript"}),"// string configs\ntakers: 'takeEvery'\ntakers: 'takeLeading'\n\n// map with effects as keys\ntakers: {\n    takeMaybe: ['fetch', 'success', 'fail'],\n    takeLeading: ['add', 'remove', 'delete'],\n}\n\n// generator function config\ntakers: takeLatest\ntakers: takeLeading\n\n// custom function config\ntakers: function* (...args) { /* ... do stuff */ }\n\n// map of actions as keys\ntakers: {\n    fetch: takeLatest,\n    success: debounce.bind(debounce, 100),\n    add: takeLeading\n}\n")))}b.isMDXComponent=!0},92:function(e,t,n){"use strict";n.d(t,"a",(function(){return d})),n.d(t,"b",(function(){return m}));var a=n(0),o=n.n(a);function c(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function r(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?r(Object(n),!0).forEach((function(t){c(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):r(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,a,o=function(e,t){if(null==e)return{};var n,a,o={},c=Object.keys(e);for(a=0;a<c.length;a++)n=c[a],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var c=Object.getOwnPropertySymbols(e);for(a=0;a<c.length;a++)n=c[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var l=o.a.createContext({}),b=function(e){var t=o.a.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},d=function(e){var t=b(e.components);return o.a.createElement(l.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return o.a.createElement(o.a.Fragment,{},t)}},u=o.a.forwardRef((function(e,t){var n=e.components,a=e.mdxType,c=e.originalType,r=e.parentName,l=s(e,["components","mdxType","originalType","parentName"]),d=b(n),u=a,m=d["".concat(r,".").concat(u)]||d[u]||p[u]||c;return n?o.a.createElement(m,i(i({ref:t},l),{},{components:n})):o.a.createElement(m,i({ref:t},l))}));function m(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var c=n.length,r=new Array(c);r[0]=u;var i={};for(var s in t)hasOwnProperty.call(t,s)&&(i[s]=t[s]);i.originalType=e,i.mdxType="string"==typeof e?e:a,r[1]=i;for(var l=2;l<c;l++)r[l]=n[l];return o.a.createElement.apply(null,r)}return o.a.createElement.apply(null,n)}u.displayName="MDXCreateElement"}}]);