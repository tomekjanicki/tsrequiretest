interface SignalR {
    chatHub: HubProxy;
}

interface HubProxy {
    client: any;
    server: any;
}
