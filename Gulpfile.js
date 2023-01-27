// Generated on 2017-02-09 using generator-mendix 2.0.1 :: git+https://github.com/mendix/generator-mendix.git
/*jshint -W069,-W097*/
// "use strict";

// In case you seem to have trouble starting Mendix through `gulp modeler`, you might have to set the path to the Mendix application, otherwise leave both values as they are
var MODELER_PATH = null;
var MODELER_ARGS = "/file:{path}";

/********************************************************************************
 * Do not edit anything below, unless you know what you are doing
 ********************************************************************************/
const { task, watch, dest, src } = require('gulp'),
        zip = require("gulp-zip"),
        del = require("del"),
        newer = require("gulp-newer"),
        gutil = require("gulp-util"),
        gulpif = require("gulp-if"),
        jsonTransform = require("gulp-json-transform"),
        intercept = require("gulp-intercept"),
        argv = require("yargs").argv,
        widgetBuilderHelper = require("widgetbuilder-gulp-helper");

const pkg = require("./package.json"),
    paths = widgetBuilderHelper.generatePaths(pkg),
    xmlversion = widgetBuilderHelper.xmlversion;

const defaultAll = function() {
    watch("./src/**/*", compress);
    watch("./src/**/*.js", copyJS);
};
// defaultAll.displayName = 'default';
task(defaultAll);

const clean = function () {
    return del([
        paths.WIDGET_TEST_DEST,
        paths.WIDGET_DIST_DEST
    ], { force: true });
};
// clean.displayName = 'clean';
task(clean);

const compress = function () {
    clean();
    return src("src/**/*")
        .pipe(zip(pkg.name + ".mpk"))
        .pipe(dest(paths.TEST_WIDGETS_FOLDER))
        .pipe(dest("dist"));
};
// compress.displayName = 'compress';
task(compress);

const copyJS = function () {
    return src(["./src/**/*.js"])
        .pipe(newer(paths.TEST_WIDGETS_DEPLOYMENT_FOLDER))
        .pipe(dest(paths.TEST_WIDGETS_DEPLOYMENT_FOLDER));
};
// copyJS.displayName = 'copy:js';
task(copyJS);

const versionXML = function () {
    return src(paths.PACKAGE_XML)
        .pipe(xmlversion(argv.n))
        .pipe(dest("./src/"));
};
// versionXML.displayName = 'version:xml';
task(versionXML);

const versionJSON = function () {
    return src("./package.json")
        .pipe(gulpif(typeof argv.n !== "undefined", jsonTransform(function(data) {
            data.version = argv.n;
            return data;
        }, 2)))
        .pipe(dest("./"));
};
// versionJSON.displayName = 'version:json';
task(versionJSON);

const version = function() {
    versionXML();
    versionJSON();
}
// version.displayName('version');
task(version);

const icon = function (cb) {
    var icon = (typeof argv.file !== "undefined") ? argv.file : "./icon.png";
    console.log("\nUsing this file to create a base64 string: " + gutil.colors.cyan(icon));
    src(icon)
        .pipe(intercept(function (file) {
            console.log("\nCopy the following to your " + pkg.name + ".xml (after description):\n\n" + gutil.colors.cyan("<icon>") + file.contents.toString("base64") + gutil.colors.cyan("<\\icon>") + "\n");
            cb();
        }));
};
// icon.displayName = 'icon';
task(icon);

const folders = function () {
    paths.showPaths(); return;
};
// folders.displayName = 'folders';
task(folders);

const modeler = function (cb) {
    widgetBuilderHelper.runmodeler(MODELER_PATH, MODELER_ARGS, paths.TEST_PATH, cb);
};
// modeler.displayName = 'modeler';
task(modeler);

const build = function() {
    return compress();
}
task(build);