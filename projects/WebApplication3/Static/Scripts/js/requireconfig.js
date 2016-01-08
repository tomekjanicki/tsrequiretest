var require = {
    baseUrl: "/Static/Scripts/dist/",
    bundles: {
        "shared.min": ["jquery", "knockout", "bootstrap", "knockoutvalidation", "toastr", "signalr"]
    },
    paths: {
        "signalrhubs": "../../../signalr/hubs?"
    },
    shim: {
        "signalrhubs": {
            deps: ["signalr"]
        }
    },
    urlArgs: "v=" + document.querySelector("meta[name=version]").getAttribute("content")
};
