/// <reference path="../../../../../../../../typings/tsd.d.ts" />

import TestVm = require("./TestVm");
import $ = require("jquery");
import ko = require("knockout");

require(["knockoutvalidation"], (kv: KnockoutValidationStatic) => {

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
});

