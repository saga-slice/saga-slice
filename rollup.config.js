
import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import babel from "rollup-plugin-babel";

import pkg from "./package.json";

export default [
    // CommonJS
    {
        input: "tmp/lib/index.js",
        output: { file: pkg.main, format: "cjs", indent: false },
        external: [
            ...Object.keys(pkg.dependencies || {}),
            ...Object.keys(pkg.peerDependencies || {}),
            'redux-saga/effects'
        ],
        plugins: [
            nodeResolve(),
            commonjs(),
            babel()
        ]
    },

    // ES
    {
        input: "tmp/lib/index.js",
        output: { file: pkg.module, format: "es", indent: false },
        external: [
            ...Object.keys(pkg.dependencies || {}),
            ...Object.keys(pkg.peerDependencies || {}),
            'redux-saga/effects'
        ],
        plugins: [
            nodeResolve(),
            commonjs(),
            // babel()
        ]
    }
];
