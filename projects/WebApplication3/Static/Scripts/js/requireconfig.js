var require = {
    baseUrl: "/Static/Scripts/dist/",
    bundles: {
        "shared.min": ["jquery", "knockout", "bootstrap", "knockoutvalidation", "toastr", "signalr"]
    },
    paths: {
        "signalrhubs": "../../../test/server"
    },
    "shim": {
        "signalrhubs": {
            deps: ["signalr"]
        }
    }
};
