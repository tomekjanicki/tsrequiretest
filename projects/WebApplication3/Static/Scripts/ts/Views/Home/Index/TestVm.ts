/// <reference path="../../../../typings/tsd.d.ts" />

import ko = require("knockout");

import next = require("../../../Utils/Next");

class TestVm {
    projectType = ko.observable("New project type");

    clickMe = (): void => {
        var n = new next();
        this.projectType("Very new project type");
        window.alert("Alert from knockout");
        window.alert(n.getMessageFromNext());
    }
}

export = TestVm;