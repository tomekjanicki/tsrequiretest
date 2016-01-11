/// <reference path="../../../../../../../../typings/tsd.d.ts" />
/// <amd-dependency path="signalrhubs" />

import TestVm = require("./TestVm");
import $ = require("jquery");
import ko = require("knockout");
import toastr = require("toastr");
import kv = require("knockoutvalidation");
import sh = require("signalrhubs");

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
    // Declare a proxy to reference the hub.
    var chat = $.connection.chatHub;
    // Create a function that the hub can call to broadcast messages.
    chat.client.broadcastMessage = (name, message) => {
        // Html encode display name and message.
        var encodedName = $("<div />").text(name).html();
        var encodedMsg = $("<div />").text(message).html();
        // Add the message to the page.
        $("#discussion").append(`<li><strong>${encodedName}</strong>:&nbsp;&nbsp;${encodedMsg}</li>`);
    };
    // Get the user name and store it to prepend to messages.
    $("#displayname").val(prompt("Enter your name:", ""));
    // Set initial focus to message input box.
    $("#message").focus();
    // Start the connection.
    $.connection.hub.start().done(() => {
        $("#sendmessage").click(() => {
            // Call the Send method on the hub.
            chat.server.send($("#displayname").val(), $("#message").val());
            // Clear text box and reset focus for next comment.
            $("#message").val("").focus();
        });
    });

});

ko.applyBindings(new TestVm());

