﻿/// <reference path="../../../../../../../../typings/tsd.d.ts" />

import ko = require("knockout");

import next = require("../../../Utils/Next");

import toastr = require("toastr");

import kv = require("knockoutvalidation");

class TestVm {
    isApiProject = ko.pureComputed(() => (this.projectType() === "Api"), this);

    projectType = ko.observable("Api");

    name = ko.observable("").extend({
        minLength: 1,
        maxLength: 50,
        required: true,
        pattern: {
            message: "Invalid name",
            params: "^([a-zA-z0-9]+\.?)*[a-zA-z0-9]+$"
        }
    });

    databaseConnectionString = ko.observable("").extend({
        required: {
            onlyIf: (() => (this.isApiProject()))
        }
    });

    clickMe = (): void => {
        var n = new next();
        window.alert(n.getMessageFromNext());
        var knockoutValidationErrors = kv.group(this, { deep: true });
        if (knockoutValidationErrors().length > 0) {
            window.alert("Not valid");
            knockoutValidationErrors.showAllMessages();
        } else {
            toastr.success("No errors");
        }
    }
}

export = TestVm;