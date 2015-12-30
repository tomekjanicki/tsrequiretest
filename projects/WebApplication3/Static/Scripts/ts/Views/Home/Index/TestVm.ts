/// <reference path="../../../../typings/tsd.d.ts" />

import ko = require("knockout");

class TestVm {
    projectType = ko.observable("New project type");

    clickMe = (): void => {
        this.projectType("Very new project type");
        window.alert("Alert from knockout");
    }
}

export = TestVm;