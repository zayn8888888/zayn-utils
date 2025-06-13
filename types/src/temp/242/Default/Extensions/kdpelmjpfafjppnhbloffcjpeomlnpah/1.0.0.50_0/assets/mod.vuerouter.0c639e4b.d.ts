declare function Fn(e: any): {
    location: string;
    base: any;
    go: (u: any, h?: boolean) => void;
    createHref: any;
} & {
    location: {
        value: any;
    };
    state: {
        value: any;
    };
    push: (c: any, d: any) => void;
    replace: (c: any, d: any) => void;
} & {
    pauseListeners: () => void;
    listen: (l: any) => () => void;
    destroy: () => void;
};
declare function Qn(e: any): {
    currentRoute: any;
    listening: boolean;
    addRoute: (a: any, g: any) => () => void;
    removeRoute: (a: any) => void;
    clearRoutes: () => void;
    hasRoute: (a: any) => boolean;
    getRoutes: () => any[];
    resolve: (a: any, g: any) => any;
    options: any;
    push: (a: any) => any;
    replace: (a: any) => any;
    go: (a: any) => any;
    back: () => any;
    forward: () => any;
    beforeEach: (r: any) => () => void;
    beforeResolve: (r: any) => () => void;
    afterEach: (r: any) => () => void;
    onError: (r: any) => () => void;
    isReady: () => Promise<any>;
    install(a: any): void;
};
export { Fn as a, Qn as c };
