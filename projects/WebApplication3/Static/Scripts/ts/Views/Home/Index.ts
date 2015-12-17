/// <reference path="../../../typings/tsd.d.ts" />

require(["jquery", "bootstrap", "knockout"], (jquery: JQueryStatic, bootstrap, ko: KnockoutStatic) => {
    var createServiceVm = function () {

        var self = this;

        self.ProjectType = ko.observable("Api");
    };

    ko.applyBindings(new createServiceVm());
});