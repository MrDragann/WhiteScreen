/// <reference path="../typings/requirejs/require.d.ts" />

require.config({
    baseUrl: "/Scripts/",
    paths: {
        jquery: "jquery-1.10.2",
        bootstrap: "bootstrap.min",
        knockout: "knockout-3.4.2"
    },
    shim: {
        "bootstrap": ["jquery"]
    }
});