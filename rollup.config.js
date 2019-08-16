import nodeResolve from "rollup-plugin-node-resolve";
import babel from "rollup-plugin-babel";
import replace from "rollup-plugin-replace";
import { terser } from "rollup-plugin-terser";

import pkg from "./package.json";

export default [
    // CommonJS
    {
        input: "index.js",
        output: { file: "dist/cjs.js", format: "cjs", indent: false },
        external: [
            ...Object.keys(pkg.dependencies || {}),
            ...Object.keys(pkg.peerDependencies || {})
        ],
        plugins: [babel()]
    },

    // ES
    {
        input: "index.js",
        output: { file: "dist/es.js", format: "es", indent: false },
        external: [
            ...Object.keys(pkg.dependencies || {}),
            ...Object.keys(pkg.peerDependencies || {})
        ],
        plugins: [babel()]
    },

    // ES for Browsers
    {
        input: "index.js",
        output: { file: "dist/es.mjs", format: "es", indent: false },
        plugins: [
            nodeResolve(),
            replace({
                "process.env.NODE_ENV": JSON.stringify("production")
            }),
            terser({
                compress: {
                    pure_getters: true,
                    unsafe: true,
                    unsafe_comps: true,
                    warnings: false
                }
            })
        ]
    },

    // UMD Development
    {
        input: "index.js",
        output: {
            file: "dist/umd.js",
            format: "umd",
            name: "SagaSliceTool",
            indent: false
        },
        plugins: [
            nodeResolve(),
            babel({
                exclude: "node_modules/**"
            }),
            replace({
                "process.env.NODE_ENV": JSON.stringify("development")
            })
        ]
    },

    // UMD Production
    {
        input: "index.js",
        output: {
            file: "dist/umd.min.js",
            format: "umd",
            name: "SagaSliceTool",
            indent: false
        },
        plugins: [
            nodeResolve(),
            babel({
                exclude: "node_modules/**"
            }),
            replace({
                "process.env.NODE_ENV": JSON.stringify("production")
            }),
            terser({
                compress: {
                    pure_getters: true,
                    unsafe: true,
                    unsafe_comps: true,
                    warnings: false
                }
            })
        ]
    }
];
