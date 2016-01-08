/// <reference path="../../../../../typings/tsd.d.ts" />

interface SignalR {
    chatHub: HubProxy;
}

interface HubProxy {
    client: any;
    server: any;
}

declare module "knockoutvalidation" {
    export = validation;
}

