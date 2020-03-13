/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
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
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/style.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/css-loader/dist/cjs.js!./src/css/binnodes.css":
/*!********************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/css/binnodes.css ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// Imports\nvar ___CSS_LOADER_API_IMPORT___ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ \"./node_modules/css-loader/dist/runtime/api.js\");\nexports = ___CSS_LOADER_API_IMPORT___(false);\n// Module\nexports.push([module.i, \".binnode {\\r\\n    display: inline-block;\\r\\n    white-space: nowrap;\\r\\n    position: absolute;\\r\\n    min-width: var(--normal-outer-w);\\r\\n    height: var(--normal-outer-h);\\r\\n    line-height: var(--normal-inner-h);\\r\\n    padding: 7px;\\r\\n    border-width: var(--normal-bdwidth);\\r\\n    border-style: solid;\\r\\n    border-radius: 10px;\\r\\n    border-color: var(--normal-bdcolor);\\r\\n    /* 居中 */\\r\\n    transform: translate(-50%, -50%);\\r\\n    font-family: \\\"Arial\\\", \\\"Microsoft YaHei\\\", \\\"黑体\\\", \\\"宋体\\\", sans-serif;\\r\\n    font-size: var(--normal-font-size);\\r\\n    font-weight: bold;\\r\\n    text-align: center;\\r\\n    text-shadow: var(--normal-numcolor);\\r\\n    background-color: var(--normal-bgcolor);\\r\\n    color: var(--normal-numcolor);\\r\\n    z-index: 1;\\r\\n}\\r\\n\\r\\n.normal-color-node {\\r\\n    color: var(--normal-numcolor);\\r\\n}\\r\\n\\r\\n.red-node {\\r\\n    color: var(--red-color);\\r\\n}\\r\\n\\r\\n.black-node {\\r\\n    color: var(--black-color);\\r\\n}\\r\\n\\r\\n.extr-binnode {\\r\\n    z-index: 0;\\r\\n    opacity: 0.1;\\r\\n}\\r\\n\\r\\n.extr-binnode:hover {\\r\\n    opacity: 0.5;\\r\\n    z-index: 10;\\r\\n}\\r\\n\\r\\n.binnode-input {\\r\\n    min-width: var(--normal-inner-w);\\r\\n    height: var(--normal-inner-h);\\r\\n    border: none;\\r\\n    outline: none;\\r\\n    text-align: center;\\r\\n    line-height: var(--normal-inner-h);\\r\\n    font-size: var(--normal-font-size);\\r\\n}\\r\\n\\r\\n.active-node {\\r\\n    border-color: var(--active-color) !important;\\r\\n}\\r\\n\\r\\n.visited-node {\\r\\n    border-color: var(--visited-color) !important;\\r\\n}\\r\\n\\r\\n.deprecated-node {\\r\\n    color: var(--deprecated-color) !important;\\r\\n    border-color: var(--deprecated-color) !important;\\r\\n}\\r\\n\\r\\n.node-upper-btn, .node-left-btn {\\r\\n    position: absolute;\\r\\n    top: -20px;\\r\\n    font-size: 19px;\\r\\n    line-height: 20px;\\r\\n    width: 15px;\\r\\n    height: 20px;\\r\\n    text-align: center;\\r\\n    color: grey;\\r\\n    opacity: 0;\\r\\n    cursor: pointer;\\r\\n    z-index: 3;\\r\\n}\\r\\n\\r\\n.binnode:hover {\\r\\n    text-shadow: 0px 0px 1px;\\r\\n    box-shadow: 0 0 5px;\\r\\n}\\r\\n\\r\\n.binnode:hover .node-upper-btn, .binnode:hover .node-left-btn {\\r\\n    opacity: 0.5;\\r\\n}\\r\\n\\r\\n.subtree-delete-btn {\\r\\n    right: 0px;\\r\\n}\\r\\n\\r\\n.subtree-delete-btn:hover {\\r\\n    opacity: 1 !important;\\r\\n    color: red;\\r\\n}\\r\\n\\r\\n.node-delete-btn {\\r\\n    left: 0px;\\r\\n}\\r\\n\\r\\n.node-delete-btn:hover {\\r\\n    opacity: 1 !important;\\r\\n    color: blue;\\r\\n}\\r\\n\\r\\n.node-upper-btn:active, .node-left-btn:active {\\r\\n    text-shadow: 0 0 1px;\\r\\n}\\r\\n\\r\\n#top-function-node {\\r\\n    position: absolute;\\r\\n    top: -140px;\\r\\n    transform: translate(-50%, -50%);\\r\\n    color: gray;\\r\\n    border-color: gray;\\r\\n}\\r\\n\\r\\n.top-proper-btn {\\r\\n    left: -20px;\\r\\n}\\r\\n\\r\\n.top-proper-btn:hover {\\r\\n    opacity: 1 !important;\\r\\n}\\r\\n\\r\\n.top-build-btn {\\r\\n    left: 0;\\r\\n}\\r\\n\\r\\n.top-build-btn:hover {\\r\\n    color: red;\\r\\n    opacity: 1 !important;\\r\\n}\\r\\n\\r\\n.top-insert-btn {\\r\\n    left: 50%;\\r\\n    transform: translateX(-50%);\\r\\n}\\r\\n\\r\\n.top-insert-btn:hover {\\r\\n    color: blue;\\r\\n    opacity: 1 !important;\\r\\n}\\r\\n\\r\\n.top-search-btn {\\r\\n    right: 0;\\r\\n}\\r\\n\\r\\n.top-search-btn:hover {\\r\\n    color: black;\\r\\n    opacity: 1 !important;\\r\\n}\\r\\n\\r\\n.node-left-btn {\\r\\n    left: -20px;\\r\\n}\\r\\n\\r\\n.top-help-btn {\\r\\n    top: 10px;\\r\\n}\\r\\n\\r\\n.top-help-btn:hover {\\r\\n    color: blue;\\r\\n    opacity: 1 !important;\\r\\n}\", \"\"]);\n// Exports\nmodule.exports = exports;\n\n\n//# sourceURL=webpack:///./src/css/binnodes.css?./node_modules/css-loader/dist/cjs.js");

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/css/button.css":
/*!******************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/css/button.css ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// Imports\nvar ___CSS_LOADER_API_IMPORT___ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ \"./node_modules/css-loader/dist/runtime/api.js\");\nexports = ___CSS_LOADER_API_IMPORT___(false);\n// Module\nexports.push([module.i, \".btn {\\r\\n    border: none;\\r\\n    border-radius: 5px;\\r\\n    outline: none;\\r\\n    padding: 5px 10px;\\r\\n    height: 40px;\\r\\n    cursor: pointer;\\r\\n    font-size: 16px;\\r\\n}\\r\\n\\r\\n.btn:active {\\r\\n    transform: scale(0.99);\\r\\n    transform-origin: left;\\r\\n}\\r\\n\\r\\n.btn-default:hover {\\r\\n    box-shadow: 0 0 1px 1px gray;\\r\\n}\\r\\n\\r\\n.btn-trans {\\r\\n    background: none;\\r\\n    border: 1px solid snow;\\r\\n    color: snow;\\r\\n    transition: background-color 0.3s, color 0.3s;\\r\\n}\\r\\n\\r\\n.btn-trans:hover {\\r\\n    background-color: snow;\\r\\n    color: black;\\r\\n}\\r\\n\\r\\n.btn-primary {\\r\\n    background-color: #0984e3;\\r\\n    color: snow;\\r\\n}\\r\\n\\r\\n.btn-primary:hover {\\r\\n    background-color: #0652DD;\\r\\n    /* Dutch MERCHANT MARINE BLUE */\\r\\n    box-shadow: 0 0 5px 0 #0652DD;\\r\\n    text-shadow: 0 0 1px whitesmoke;\\r\\n}\\r\\n\\r\\n.btn-primary:active {\\r\\n    box-shadow: 0 0 2px 1px #0652DD;\\r\\n    color: #ecf0f1;\\r\\n}\", \"\"]);\n// Exports\nmodule.exports = exports;\n\n\n//# sourceURL=webpack:///./src/css/button.css?./node_modules/css-loader/dist/cjs.js");

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/css/edges.css":
/*!*****************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/css/edges.css ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// Imports\nvar ___CSS_LOADER_API_IMPORT___ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ \"./node_modules/css-loader/dist/runtime/api.js\");\nexports = ___CSS_LOADER_API_IMPORT___(false);\n// Module\nexports.push([module.i, \".left-edge {\\r\\n    position: absolute;\\r\\n    border-width: var(--normal-edgewidth) 0 0 var(--normal-edgewidth);\\r\\n    border-style: solid;\\r\\n    border-color: var(--normal-edgecolor);\\r\\n    border-radius: 3px;\\r\\n    z-index: -1;\\r\\n}\\r\\n\\r\\n.right-edge {\\r\\n    position: absolute;\\r\\n    border-width: var(--normal-edgewidth) var(--normal-edgewidth) 0 0;\\r\\n    border-style: solid;\\r\\n    border-color: var(--normal-edgecolor);\\r\\n    border-radius: 3px;\\r\\n    z-index: -1;\\r\\n}\\r\\n\\r\\n.extr-edge {\\r\\n    opacity: 0.1;\\r\\n}\", \"\"]);\n// Exports\nmodule.exports = exports;\n\n\n//# sourceURL=webpack:///./src/css/edges.css?./node_modules/css-loader/dist/cjs.js");

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/css/index.css":
/*!*****************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/css/index.css ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// Imports\nvar ___CSS_LOADER_API_IMPORT___ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ \"./node_modules/css-loader/dist/runtime/api.js\");\nexports = ___CSS_LOADER_API_IMPORT___(false);\n// Module\nexports.push([module.i, \"* {\\r\\n    padding: 0;\\r\\n    margin: 0;\\r\\n    box-sizing: border-box;\\r\\n    -webkit-touch-callout: none;\\r\\n    /*系统默认菜单被禁用*/\\r\\n    -webkit-user-select: none;\\r\\n    /*webkit浏览器*/\\r\\n    -khtml-user-select: none;\\r\\n    /*早期浏览器*/\\r\\n    -moz-user-select: none;\\r\\n    /*火狐*/\\r\\n    -ms-user-select: none;\\r\\n    /*IE10*/\\r\\n    user-select: none;\\r\\n}\\r\\n\\r\\nhtml, body {\\r\\n    width: 100%;\\r\\n    height: 100%;\\r\\n    min-width: 300px;\\r\\n    position: relative;\\r\\n}\\r\\n\\r\\n:root {\\r\\n    --normal-inner-h: 40px;\\r\\n    --normal-outer-h: 60px;\\r\\n    --normal-inner-w: 40px;\\r\\n    --normal-outer-w: 60px;\\r\\n    --normal-font-size: 25px;\\r\\n    --normal-bdwidth: 3px;\\r\\n    --normal-edgewidth: 3px;\\r\\n    --normal-numcolor: rgba(30, 144, 255, 1.0);\\r\\n    --normal-bdcolor: rgba(30, 144, 255, 1.0);\\r\\n    --normal-bgcolor: white;\\r\\n    --normal-edgecolor: rgba(87, 96, 111, 1.0);\\r\\n    --active-color: rgba(253, 121, 168, 1.0);\\r\\n    --visited-color: gray;\\r\\n    --deprecated-color: rgba(253, 203, 110, 1.0);\\r\\n    --red-color: red;\\r\\n    --black-color: black;\\r\\n}\\r\\n\\r\\n#TreePlayground {\\r\\n    position: relative;\\r\\n    width: 100%;\\r\\n    height: 100%;\\r\\n    z-index: 0;\\r\\n}\\r\\n\\r\\n.tree {\\r\\n    position: absolute;\\r\\n    width: 50px;\\r\\n    left: 50%;\\r\\n    top: 300px;\\r\\n    z-index: 10;\\r\\n}\\r\\n\\r\\n.tree-dragging-btn {\\r\\n    display: block;\\r\\n    width: 35px;\\r\\n    height: 35px;\\r\\n    border: 2px dashed black;\\r\\n    border-radius: 30%;\\r\\n    position: absolute;\\r\\n    top: -80px;\\r\\n    transform: translate(-50%, -50%);\\r\\n    transform-origin: 50% 80px;\\r\\n    cursor: move;\\r\\n    opacity: 0.5;\\r\\n}\\r\\n\\r\\n.tree-dragging-btn::after {\\r\\n    content: \\\"\\\";\\r\\n    display: block;\\r\\n    width: 0px;\\r\\n    height: 31px;\\r\\n    border: 2px solid black;\\r\\n    position: relative;\\r\\n    top: 100%;\\r\\n    left: 50%;\\r\\n    transform: translateX(-50%);\\r\\n    opacity: 0.5;\\r\\n}\\r\\n\\r\\n@keyframes shake {\\r\\n    10% {\\r\\n        transform: translate(-50%, -50%) rotate(-5deg);\\r\\n    }\\r\\n    20% {\\r\\n        transform: translate(-50%, -50%) rotate(5deg);\\r\\n    }\\r\\n    40% {\\r\\n        transform: translate(-50%, -50%) rotate(-3deg);\\r\\n    }\\r\\n    60% {\\r\\n        transform: translate(-50%, -50%) rotate(3deg);\\r\\n    }\\r\\n}\\r\\n\\r\\n.tree-dragging-btn:hover {\\r\\n    animation: shake 1s;\\r\\n    opacity: 1;\\r\\n}\\r\\n\\r\\n.left-message {\\r\\n    position: absolute;\\r\\n    right: 93px;\\r\\n    top: -95px;\\r\\n    font-size: 24px;\\r\\n    color: gray;\\r\\n    white-space: nowrap;\\r\\n}\\r\\n\\r\\n.right-message {\\r\\n    position: absolute;\\r\\n    left: 40px;\\r\\n    top: -95px;\\r\\n    font-size: 24px;\\r\\n    color: gray;\\r\\n    white-space: nowrap;\\r\\n}\\r\\n\\r\\n#footer {\\r\\n    font-size: 14px;\\r\\n    z-index: 1;\\r\\n    color: gray;\\r\\n}\\r\\n\\r\\n/* Pad */\\r\\n\\r\\n@media screen and (max-width: 768px) {\\r\\n    .tree {\\r\\n        top: 350px;\\r\\n    }\\r\\n    .tree-dragging-btn {\\r\\n        width: 50px;\\r\\n        height: 50px;\\r\\n    }\\r\\n    .tree-dragging-btn::after {\\r\\n        height: 25px;\\r\\n    }\\r\\n}\\r\\n\\r\\n@media screen and (max-width: 376px) {\\r\\n    #footer, #header {\\r\\n        font-size: 10px;\\r\\n    }\\r\\n}\\r\\n\\r\\n/* Horizontally */\\r\\n\\r\\n@media screen and (max-height: 500px) {\\r\\n    .tree {\\r\\n        top: 200px;\\r\\n    }\\r\\n    #footer, #header {\\r\\n        font-size: 10px;\\r\\n    }\\r\\n}\", \"\"]);\n// Exports\nmodule.exports = exports;\n\n\n//# sourceURL=webpack:///./src/css/index.css?./node_modules/css-loader/dist/cjs.js");

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/css/toolbars.css":
/*!********************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/css/toolbars.css ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// Imports\nvar ___CSS_LOADER_API_IMPORT___ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ \"./node_modules/css-loader/dist/runtime/api.js\");\nexports = ___CSS_LOADER_API_IMPORT___(false);\n// Module\nexports.push([module.i, \".top-toolbar {\\r\\n    position: fixed;\\r\\n    display: flex;\\r\\n    justify-content: center;\\r\\n    align-items: center;\\r\\n    margin-top: 25px;\\r\\n    height: 50px;\\r\\n    width: 100vw;\\r\\n}\\r\\n\\r\\n.top-toolbar-item {\\r\\n    margin: 1px 10px;\\r\\n}\\r\\n\\r\\n.top-toolbar button {\\r\\n    width: 85px;\\r\\n}\\r\\n\\r\\n#interval-ranger {\\r\\n    width: 120px;\\r\\n    display: inline-block;\\r\\n    vertical-align: baseline;\\r\\n}\\r\\n\\r\\n#interval-ranger span {\\r\\n    white-space: nowrap;\\r\\n    font-weight: bold;\\r\\n}\\r\\n\\r\\n#interval-ranger input {\\r\\n    width: 100%;\\r\\n}\\r\\n\\r\\n.left-toolbar {\\r\\n    position: fixed;\\r\\n    display: flex;\\r\\n    flex-direction: column;\\r\\n    justify-content: space-between;\\r\\n    align-items: center;\\r\\n    top: 150px;\\r\\n    left: 50px;\\r\\n    width: 100px;\\r\\n}\\r\\n\\r\\n.left-toolbar #tree-type-selector {\\r\\n    width: 100%;\\r\\n    height: 40px;\\r\\n    margin-top: 10px;\\r\\n    margin-bottom: 60px;\\r\\n    padding: 6px 4px;\\r\\n    font-size: 16px;\\r\\n    border-radius: 5px;\\r\\n    outline: none;\\r\\n}\\r\\n\\r\\n.left-toolbar button {\\r\\n    width: 100%;\\r\\n}\\r\\n\\r\\n.left-toolbar #tree-scale-ranger {\\r\\n    width: 100%;\\r\\n    align-self: center;\\r\\n}\\r\\n\\r\\n.left-toolbar #tree-scale-ranger input {\\r\\n    transform: rotate(-90deg);\\r\\n    transform-origin: bottom;\\r\\n    position: relative;\\r\\n    left: -15px;\\r\\n    width: 150px;\\r\\n    display: inline-block;\\r\\n}\\r\\n\\r\\n.left-toolbar #tree-scale-ranger h4 {\\r\\n    text-align: center;\\r\\n    display: block;\\r\\n    position: relative;\\r\\n    top: 130px;\\r\\n    white-space: nowrap;\\r\\n}\\r\\n\\r\\n/* Pad */\\r\\n@media screen and (max-width: 768px) {\\r\\n    .top-toolbar {\\r\\n        flex-wrap: wrap;\\r\\n        justify-content: left;\\r\\n        width: 350px;\\r\\n        left: 50%;\\r\\n        transform: translateX(-50%);\\r\\n        transform-origin: top;\\r\\n    }\\r\\n    #interval-ranger {\\r\\n        width: 110px;\\r\\n    }\\r\\n    .left-toolbar {\\r\\n        width: 350px;\\r\\n        padding: 0;\\r\\n        left: 50%;\\r\\n        top: 112px;\\r\\n        transform: translateX(-50%);\\r\\n        transform-origin: top;\\r\\n        height: 50px;\\r\\n        flex-direction: row;\\r\\n        justify-content: left;\\r\\n        align-items: center;\\r\\n    }\\r\\n    .left-toolbar-item {\\r\\n        margin: 5px 10px;\\r\\n    }\\r\\n    .left-toolbar button {\\r\\n        width: 85px;\\r\\n    }\\r\\n    .left-toolbar #tree-type-selector {\\r\\n        width: 85px;\\r\\n        height: 35px;\\r\\n        margin: 0 10px;\\r\\n    }\\r\\n    .left-toolbar #tree-scale-ranger {\\r\\n        width: 110px;\\r\\n    }\\r\\n    .left-toolbar #tree-scale-ranger input {\\r\\n        width: 100%;\\r\\n        left: 0;\\r\\n        transform: none;\\r\\n    }\\r\\n    .left-toolbar #tree-scale-ranger h4 {\\r\\n        top: 0;\\r\\n    }\\r\\n}\\r\\n\\r\\n/* Phone */\\r\\n@media screen and (max-width: 376px) {\\r\\n    .top-toolbar {\\r\\n        width: 300px;\\r\\n    }\\r\\n    .top-toolbar-item {\\r\\n        margin: 0px 5px;\\r\\n    }\\r\\n    #interval-ranger {\\r\\n        width: 100px;\\r\\n    }\\r\\n    .left-toolbar {\\r\\n        width: 300px;\\r\\n        top: 106px;\\r\\n    }\\r\\n    .left-toolbar-item {\\r\\n        margin: 5px 5px;\\r\\n    }\\r\\n    .left-toolbar #tree-scale-ranger {\\r\\n        width: 100px;\\r\\n    }\\r\\n}\\r\\n\\r\\n/* Horizontally */\\r\\n@media screen and (max-height: 500px) and (min-width: 768px) {\\r\\n    .left-toolbar {\\r\\n        left: 20px;\\r\\n        top: 100px;\\r\\n    }\\r\\n    .left-toolbar #tree-scale-ranger input {\\r\\n        width: 100px;\\r\\n        left: 5px;\\r\\n        top: -40px;\\r\\n    }\\r\\n    .left-toolbar #tree-scale-ranger h4 {\\r\\n        top: 60px;\\r\\n    }\\r\\n}\\r\\n\", \"\"]);\n// Exports\nmodule.exports = exports;\n\n\n//# sourceURL=webpack:///./src/css/toolbars.css?./node_modules/css-loader/dist/cjs.js");

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\n/*\n  MIT License http://www.opensource.org/licenses/mit-license.php\n  Author Tobias Koppers @sokra\n*/\n// css base code, injected by the css-loader\n// eslint-disable-next-line func-names\nmodule.exports = function (useSourceMap) {\n  var list = []; // return the list of modules as css string\n\n  list.toString = function toString() {\n    return this.map(function (item) {\n      var content = cssWithMappingToString(item, useSourceMap);\n\n      if (item[2]) {\n        return \"@media \".concat(item[2], \" {\").concat(content, \"}\");\n      }\n\n      return content;\n    }).join('');\n  }; // import a list of modules into the list\n  // eslint-disable-next-line func-names\n\n\n  list.i = function (modules, mediaQuery, dedupe) {\n    if (typeof modules === 'string') {\n      // eslint-disable-next-line no-param-reassign\n      modules = [[null, modules, '']];\n    }\n\n    var alreadyImportedModules = {};\n\n    if (dedupe) {\n      for (var i = 0; i < this.length; i++) {\n        // eslint-disable-next-line prefer-destructuring\n        var id = this[i][0];\n\n        if (id != null) {\n          alreadyImportedModules[id] = true;\n        }\n      }\n    }\n\n    for (var _i = 0; _i < modules.length; _i++) {\n      var item = [].concat(modules[_i]);\n\n      if (dedupe && alreadyImportedModules[item[0]]) {\n        // eslint-disable-next-line no-continue\n        continue;\n      }\n\n      if (mediaQuery) {\n        if (!item[2]) {\n          item[2] = mediaQuery;\n        } else {\n          item[2] = \"\".concat(mediaQuery, \" and \").concat(item[2]);\n        }\n      }\n\n      list.push(item);\n    }\n  };\n\n  return list;\n};\n\nfunction cssWithMappingToString(item, useSourceMap) {\n  var content = item[1] || ''; // eslint-disable-next-line prefer-destructuring\n\n  var cssMapping = item[3];\n\n  if (!cssMapping) {\n    return content;\n  }\n\n  if (useSourceMap && typeof btoa === 'function') {\n    var sourceMapping = toComment(cssMapping);\n    var sourceURLs = cssMapping.sources.map(function (source) {\n      return \"/*# sourceURL=\".concat(cssMapping.sourceRoot || '').concat(source, \" */\");\n    });\n    return [content].concat(sourceURLs).concat([sourceMapping]).join('\\n');\n  }\n\n  return [content].join('\\n');\n} // Adapted from convert-source-map (MIT)\n\n\nfunction toComment(sourceMap) {\n  // eslint-disable-next-line no-undef\n  var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));\n  var data = \"sourceMappingURL=data:application/json;charset=utf-8;base64,\".concat(base64);\n  return \"/*# \".concat(data, \" */\");\n}\n\n//# sourceURL=webpack:///./node_modules/css-loader/dist/runtime/api.js?");

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar isOldIE = function isOldIE() {\n  var memo;\n  return function memorize() {\n    if (typeof memo === 'undefined') {\n      // Test for IE <= 9 as proposed by Browserhacks\n      // @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805\n      // Tests for existence of standard globals is to allow style-loader\n      // to operate correctly into non-standard environments\n      // @see https://github.com/webpack-contrib/style-loader/issues/177\n      memo = Boolean(window && document && document.all && !window.atob);\n    }\n\n    return memo;\n  };\n}();\n\nvar getTarget = function getTarget() {\n  var memo = {};\n  return function memorize(target) {\n    if (typeof memo[target] === 'undefined') {\n      var styleTarget = document.querySelector(target); // Special case to return head of iframe instead of iframe itself\n\n      if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {\n        try {\n          // This will throw an exception if access to iframe is blocked\n          // due to cross-origin restrictions\n          styleTarget = styleTarget.contentDocument.head;\n        } catch (e) {\n          // istanbul ignore next\n          styleTarget = null;\n        }\n      }\n\n      memo[target] = styleTarget;\n    }\n\n    return memo[target];\n  };\n}();\n\nvar stylesInDom = [];\n\nfunction getIndexByIdentifier(identifier) {\n  var result = -1;\n\n  for (var i = 0; i < stylesInDom.length; i++) {\n    if (stylesInDom[i].identifier === identifier) {\n      result = i;\n      break;\n    }\n  }\n\n  return result;\n}\n\nfunction modulesToDom(list, options) {\n  var idCountMap = {};\n  var identifiers = [];\n\n  for (var i = 0; i < list.length; i++) {\n    var item = list[i];\n    var id = options.base ? item[0] + options.base : item[0];\n    var count = idCountMap[id] || 0;\n    var identifier = \"\".concat(id, \" \").concat(count);\n    idCountMap[id] = count + 1;\n    var index = getIndexByIdentifier(identifier);\n    var obj = {\n      css: item[1],\n      media: item[2],\n      sourceMap: item[3]\n    };\n\n    if (index !== -1) {\n      stylesInDom[index].references++;\n      stylesInDom[index].updater(obj);\n    } else {\n      stylesInDom.push({\n        identifier: identifier,\n        updater: addStyle(obj, options),\n        references: 1\n      });\n    }\n\n    identifiers.push(identifier);\n  }\n\n  return identifiers;\n}\n\nfunction insertStyleElement(options) {\n  var style = document.createElement('style');\n  var attributes = options.attributes || {};\n\n  if (typeof attributes.nonce === 'undefined') {\n    var nonce =  true ? __webpack_require__.nc : undefined;\n\n    if (nonce) {\n      attributes.nonce = nonce;\n    }\n  }\n\n  Object.keys(attributes).forEach(function (key) {\n    style.setAttribute(key, attributes[key]);\n  });\n\n  if (typeof options.insert === 'function') {\n    options.insert(style);\n  } else {\n    var target = getTarget(options.insert || 'head');\n\n    if (!target) {\n      throw new Error(\"Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.\");\n    }\n\n    target.appendChild(style);\n  }\n\n  return style;\n}\n\nfunction removeStyleElement(style) {\n  // istanbul ignore if\n  if (style.parentNode === null) {\n    return false;\n  }\n\n  style.parentNode.removeChild(style);\n}\n/* istanbul ignore next  */\n\n\nvar replaceText = function replaceText() {\n  var textStore = [];\n  return function replace(index, replacement) {\n    textStore[index] = replacement;\n    return textStore.filter(Boolean).join('\\n');\n  };\n}();\n\nfunction applyToSingletonTag(style, index, remove, obj) {\n  var css = remove ? '' : obj.media ? \"@media \".concat(obj.media, \" {\").concat(obj.css, \"}\") : obj.css; // For old IE\n\n  /* istanbul ignore if  */\n\n  if (style.styleSheet) {\n    style.styleSheet.cssText = replaceText(index, css);\n  } else {\n    var cssNode = document.createTextNode(css);\n    var childNodes = style.childNodes;\n\n    if (childNodes[index]) {\n      style.removeChild(childNodes[index]);\n    }\n\n    if (childNodes.length) {\n      style.insertBefore(cssNode, childNodes[index]);\n    } else {\n      style.appendChild(cssNode);\n    }\n  }\n}\n\nfunction applyToTag(style, options, obj) {\n  var css = obj.css;\n  var media = obj.media;\n  var sourceMap = obj.sourceMap;\n\n  if (media) {\n    style.setAttribute('media', media);\n  } else {\n    style.removeAttribute('media');\n  }\n\n  if (sourceMap && btoa) {\n    css += \"\\n/*# sourceMappingURL=data:application/json;base64,\".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), \" */\");\n  } // For old IE\n\n  /* istanbul ignore if  */\n\n\n  if (style.styleSheet) {\n    style.styleSheet.cssText = css;\n  } else {\n    while (style.firstChild) {\n      style.removeChild(style.firstChild);\n    }\n\n    style.appendChild(document.createTextNode(css));\n  }\n}\n\nvar singleton = null;\nvar singletonCounter = 0;\n\nfunction addStyle(obj, options) {\n  var style;\n  var update;\n  var remove;\n\n  if (options.singleton) {\n    var styleIndex = singletonCounter++;\n    style = singleton || (singleton = insertStyleElement(options));\n    update = applyToSingletonTag.bind(null, style, styleIndex, false);\n    remove = applyToSingletonTag.bind(null, style, styleIndex, true);\n  } else {\n    style = insertStyleElement(options);\n    update = applyToTag.bind(null, style, options);\n\n    remove = function remove() {\n      removeStyleElement(style);\n    };\n  }\n\n  update(obj);\n  return function updateStyle(newObj) {\n    if (newObj) {\n      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap) {\n        return;\n      }\n\n      update(obj = newObj);\n    } else {\n      remove();\n    }\n  };\n}\n\nmodule.exports = function (list, options) {\n  options = options || {}; // Force single-tag solution on IE6-9, which has a hard limit on the # of <style>\n  // tags it will allow on a page\n\n  if (!options.singleton && typeof options.singleton !== 'boolean') {\n    options.singleton = isOldIE();\n  }\n\n  list = list || [];\n  var lastIdentifiers = modulesToDom(list, options);\n  return function update(newList) {\n    newList = newList || [];\n\n    if (Object.prototype.toString.call(newList) !== '[object Array]') {\n      return;\n    }\n\n    for (var i = 0; i < lastIdentifiers.length; i++) {\n      var identifier = lastIdentifiers[i];\n      var index = getIndexByIdentifier(identifier);\n      stylesInDom[index].references--;\n    }\n\n    var newLastIdentifiers = modulesToDom(newList, options);\n\n    for (var _i = 0; _i < lastIdentifiers.length; _i++) {\n      var _identifier = lastIdentifiers[_i];\n\n      var _index = getIndexByIdentifier(_identifier);\n\n      if (stylesInDom[_index].references === 0) {\n        stylesInDom[_index].updater();\n\n        stylesInDom.splice(_index, 1);\n      }\n    }\n\n    lastIdentifiers = newLastIdentifiers;\n  };\n};\n\n//# sourceURL=webpack:///./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js?");

/***/ }),

/***/ "./src/css/binnodes.css":
/*!******************************!*\
  !*** ./src/css/binnodes.css ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var api = __webpack_require__(/*! ../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ \"./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js\");\n            var content = __webpack_require__(/*! !../../node_modules/css-loader/dist/cjs.js!./binnodes.css */ \"./node_modules/css-loader/dist/cjs.js!./src/css/binnodes.css\");\n\n            content = content.__esModule ? content.default : content;\n\n            if (typeof content === 'string') {\n              content = [[module.i, content, '']];\n            }\n\nvar options = {};\n\noptions.insert = \"head\";\noptions.singleton = false;\n\nvar update = api(content, options);\n\nvar exported = content.locals ? content.locals : {};\n\n\n\nmodule.exports = exported;\n\n//# sourceURL=webpack:///./src/css/binnodes.css?");

/***/ }),

/***/ "./src/css/button.css":
/*!****************************!*\
  !*** ./src/css/button.css ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var api = __webpack_require__(/*! ../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ \"./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js\");\n            var content = __webpack_require__(/*! !../../node_modules/css-loader/dist/cjs.js!./button.css */ \"./node_modules/css-loader/dist/cjs.js!./src/css/button.css\");\n\n            content = content.__esModule ? content.default : content;\n\n            if (typeof content === 'string') {\n              content = [[module.i, content, '']];\n            }\n\nvar options = {};\n\noptions.insert = \"head\";\noptions.singleton = false;\n\nvar update = api(content, options);\n\nvar exported = content.locals ? content.locals : {};\n\n\n\nmodule.exports = exported;\n\n//# sourceURL=webpack:///./src/css/button.css?");

/***/ }),

/***/ "./src/css/edges.css":
/*!***************************!*\
  !*** ./src/css/edges.css ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var api = __webpack_require__(/*! ../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ \"./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js\");\n            var content = __webpack_require__(/*! !../../node_modules/css-loader/dist/cjs.js!./edges.css */ \"./node_modules/css-loader/dist/cjs.js!./src/css/edges.css\");\n\n            content = content.__esModule ? content.default : content;\n\n            if (typeof content === 'string') {\n              content = [[module.i, content, '']];\n            }\n\nvar options = {};\n\noptions.insert = \"head\";\noptions.singleton = false;\n\nvar update = api(content, options);\n\nvar exported = content.locals ? content.locals : {};\n\n\n\nmodule.exports = exported;\n\n//# sourceURL=webpack:///./src/css/edges.css?");

/***/ }),

/***/ "./src/css/index.css":
/*!***************************!*\
  !*** ./src/css/index.css ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var api = __webpack_require__(/*! ../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ \"./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js\");\n            var content = __webpack_require__(/*! !../../node_modules/css-loader/dist/cjs.js!./index.css */ \"./node_modules/css-loader/dist/cjs.js!./src/css/index.css\");\n\n            content = content.__esModule ? content.default : content;\n\n            if (typeof content === 'string') {\n              content = [[module.i, content, '']];\n            }\n\nvar options = {};\n\noptions.insert = \"head\";\noptions.singleton = false;\n\nvar update = api(content, options);\n\nvar exported = content.locals ? content.locals : {};\n\n\n\nmodule.exports = exported;\n\n//# sourceURL=webpack:///./src/css/index.css?");

/***/ }),

/***/ "./src/css/toolbars.css":
/*!******************************!*\
  !*** ./src/css/toolbars.css ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var api = __webpack_require__(/*! ../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ \"./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js\");\n            var content = __webpack_require__(/*! !../../node_modules/css-loader/dist/cjs.js!./toolbars.css */ \"./node_modules/css-loader/dist/cjs.js!./src/css/toolbars.css\");\n\n            content = content.__esModule ? content.default : content;\n\n            if (typeof content === 'string') {\n              content = [[module.i, content, '']];\n            }\n\nvar options = {};\n\noptions.insert = \"head\";\noptions.singleton = false;\n\nvar update = api(content, options);\n\nvar exported = content.locals ? content.locals : {};\n\n\n\nmodule.exports = exported;\n\n//# sourceURL=webpack:///./src/css/toolbars.css?");

/***/ }),

/***/ "./src/style.js":
/*!**********************!*\
  !*** ./src/style.js ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _css_index_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./css/index.css */ \"./src/css/index.css\");\n/* harmony import */ var _css_index_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_css_index_css__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _css_button_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./css/button.css */ \"./src/css/button.css\");\n/* harmony import */ var _css_button_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_css_button_css__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _css_toolbars_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./css/toolbars.css */ \"./src/css/toolbars.css\");\n/* harmony import */ var _css_toolbars_css__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_css_toolbars_css__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _css_binnodes_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./css/binnodes.css */ \"./src/css/binnodes.css\");\n/* harmony import */ var _css_binnodes_css__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_css_binnodes_css__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var _css_edges_css__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./css/edges.css */ \"./src/css/edges.css\");\n/* harmony import */ var _css_edges_css__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_css_edges_css__WEBPACK_IMPORTED_MODULE_4__);\n\r\n\r\n\r\n\r\n\n\n//# sourceURL=webpack:///./src/style.js?");

/***/ })

/******/ });