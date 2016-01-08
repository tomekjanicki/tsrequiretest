/// <reference path="../../../../../../../../typings/tsd.d.ts" />

import TestVm = require("./TestVm");
import $ = require("jquery");
import ko = require("knockout");
import toastr = require("toastr");

import kv = require("knockoutvalidation");

toastr.options.positionClass = "toast-top-center";

kv.init({
    registerExtenders: true,
    messagesOnModified: true,
    insertMessages: true,
    parseInputAttributes: true,
    messageTemplate: null
}, true);

kv.rules.pattern.message = "Invalid.";

$(() => {
    $("#jqueryButton").click(() => {
        window.alert("Alert from jquery");
    });
});

ko.applyBindings(new TestVm());

