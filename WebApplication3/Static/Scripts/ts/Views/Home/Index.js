/// <reference path="../../../typings/tsd.d.ts" />
require(["jquery", "bootstrap", "knockout"], function (jquery, bootstrap, ko) {
    var createServiceVm = function () {
        var self = this;
        self.ProjectType = ko.observable("Api");
    };
    ko.applyBindings(new createServiceVm());
});
