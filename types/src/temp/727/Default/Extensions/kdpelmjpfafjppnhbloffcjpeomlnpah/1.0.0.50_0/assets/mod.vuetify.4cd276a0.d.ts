declare function ds(e: any, t: any): any[];
declare function Or(e: any, ...args: any[]): {
    resizeRef: any;
    contentRect: any;
};
declare function ys(): {
    isRtl: any;
    rtlClasses: any;
};
declare function Gr(e: any, t: any): {
    side: any;
    align: any;
};
declare function zr(e: any, t: any): boolean;
declare const x: boolean;
declare function Ee(e: any): boolean;
declare const Lr: Readonly<{
    enter: 13;
    tab: 9;
    delete: 46;
    esc: 27;
    space: 32;
    up: 38;
    down: 40;
    left: 37;
    right: 39;
    end: 35;
    home: 36;
    del: 46;
    backspace: 8;
    insert: 45;
    pageup: 33;
    pagedown: 34;
    shift: 16;
}>;
declare function es(e: any, t: any, n: any): any;
declare const Sr: (ObjectConstructor | StringConstructor | FunctionConstructor | ArrayConstructor)[];
declare const cs: "cubic-bezier(0.0, 0, 0.2, 1)";
declare const us: "cubic-bezier(0.4, 0, 0.2, 1)";
declare const ls: "cubic-bezier(0.4, 0, 1, 1)";
declare function qr(e: any): any;
declare function Qr(e: any): re;
declare function J(e: any): any;
declare function os(e: any, ...args: any[]): any;
declare function jr(): (FunctionConstructor | ArrayConstructor)[];
declare function rs(e: any, t: any): void;
declare const Rr: boolean;
declare function cn(e: any, t: any): void;
declare function Nr(e: any, t: any, n: any): any;
declare function tn(e: any, t: any): any;
declare function Jt(e: any, t: any): void;
declare function ms(e: any): boolean;
declare function Zr(e: any): {
    side: any;
    align: any;
};
declare function _r(e: any): {
    side: any;
    align: any;
};
declare function Kr(e: any): {
    side: any;
    align: any;
};
declare namespace Dr {
    export let collapse: string;
    export let complete: string;
    export let cancel: string;
    export let close: string;
    let _delete: string;
    export { _delete as delete };
    export let clear: string;
    export let success: string;
    export let info: string;
    export let warning: string;
    export let error: string;
    export let prev: string;
    export let next: string;
    export let checkboxOn: string;
    export let checkboxOff: string;
    export let checkboxIndeterminate: string;
    export let delimiter: string;
    export let sortAsc: string;
    export let sortDesc: string;
    export let expand: string;
    export let menu: string;
    export let subgroup: string;
    export let dropdown: string;
    export let radioOn: string;
    export let radioOff: string;
    export let edit: string;
    export let ratingEmpty: string;
    export let ratingFull: string;
    export let ratingHalf: string;
    export let loading: string;
    export let first: string;
    export let last: string;
    export let unfold: string;
    export let file: string;
    export let plus: string;
    export let minus: string;
    export let calendar: string;
    export let eyeDropper: string;
}
declare class re {
    constructor(t: any);
    x: any;
    y: any;
    width: any;
    height: any;
    get top(): any;
    get bottom(): any;
    get left(): any;
    get right(): any;
}
declare function Ue(e: any): void;
declare function Xr(e: any): "y" | "x";
declare function Jr(e: any, t: any): {
    x: {
        before: number;
        after: number;
    };
    y: {
        before: number;
        after: number;
    };
};
declare function rn(e: any, ...args: any[]): number;
declare function xt(e: any): boolean;
declare function Pe(e: any): any;
declare function ts(e: any, t: any): void;
declare function ns(e: any, t: any): void;
declare function Ur(e: any, t: any): any;
declare function vs(...args: any[]): any;
declare function is(e: any): any;
declare function fs(e: any, ...args: any[]): any;
declare function on(e: any, ...args: any[]): any[];
declare function un(e: any, t: any, n: any): any;
declare function hs(): any;
declare function Vr(e: any): any[];
declare function Hr(e: any): number;
declare function lt(e: any, ...args: any[]): any[];
declare const Br: Readonly<{
    enter: "Enter";
    tab: "Tab";
    delete: "Delete";
    esc: "Escape";
    space: "Space";
    up: "ArrowUp";
    down: "ArrowDown";
    left: "ArrowLeft";
    right: "ArrowRight";
    end: "End";
    home: "Home";
    del: "Delete";
    backspace: "Backspace";
    insert: "Insert";
    pageup: "PageUp";
    pagedown: "PageDown";
    shift: "Shift";
}>;
declare function Ds(n: any): {};
declare function Ss(e: any): {
    layoutClasses: {
        getter: any;
        _setter: any;
        __v_isRef: boolean;
        __v_isReadonly: any;
        effect: {
            fn: any;
            trigger: any;
            scheduler: any;
            active: boolean;
            deps: any[];
            _dirtyLevel: number;
            _trackId: number;
            _runnings: number;
            _shouldSchedule: boolean;
            _depsLength: number;
            dirty: boolean;
            run(): any;
            stop(): void;
        };
        _cacheable: boolean;
        value: any;
        _dirty: boolean;
    };
    layoutStyles: {
        getter: any;
        _setter: any;
        __v_isRef: boolean;
        __v_isReadonly: any;
        effect: {
            fn: any;
            trigger: any;
            scheduler: any;
            active: boolean;
            deps: any[];
            _dirtyLevel: number;
            _trackId: number;
            _runnings: number;
            _shouldSchedule: boolean;
            _depsLength: number;
            dirty: boolean;
            run(): any;
            stop(): void;
        };
        _cacheable: boolean;
        value: any;
        _dirty: boolean;
    };
    getLayoutItem: (p: any) => any;
    items: {
        getter: any;
        _setter: any;
        __v_isRef: boolean;
        __v_isReadonly: any;
        effect: {
            fn: any;
            trigger: any;
            scheduler: any;
            active: boolean;
            deps: any[];
            _dirtyLevel: number;
            _trackId: number;
            _runnings: number;
            _shouldSchedule: boolean;
            _depsLength: number;
            dirty: boolean;
            run(): any;
            stop(): void;
        };
        _cacheable: boolean;
        value: any;
        _dirty: boolean;
    };
    layoutRect: any;
    layoutRef: any;
};
declare function xs(): {
    getLayoutItem: any;
    mainRect: any;
    mainStyles: any;
};
declare function ss(e: any): boolean;
declare function Er(...args: any[]): {
    install: (l: any) => void;
    defaults: any;
    display: {
        update: () => void;
        ssr: boolean;
    };
    theme: {
        install: (d: any) => void;
        isDisabled: any;
        name: any;
        themes: any;
        current: {
            getter: any;
            _setter: any;
            __v_isRef: boolean;
            __v_isReadonly: any;
            effect: {
                fn: any;
                trigger: any;
                scheduler: any;
                active: boolean;
                deps: any[];
                _dirtyLevel: number;
                _trackId: number;
                _runnings: number;
                _shouldSchedule: boolean;
                _depsLength: number;
                dirty: boolean;
                run(): any;
                stop(): void;
            };
            _cacheable: boolean;
            value: any;
            _dirty: boolean;
        };
        computedThemes: {
            getter: any;
            _setter: any;
            __v_isRef: boolean;
            __v_isReadonly: any;
            effect: {
                fn: any;
                trigger: any;
                scheduler: any;
                active: boolean;
                deps: any[];
                _dirtyLevel: number;
                _trackId: number;
                _runnings: number;
                _shouldSchedule: boolean;
                _depsLength: number;
                dirty: boolean;
                run(): any;
                stop(): void;
            };
            _cacheable: boolean;
            value: any;
            _dirty: boolean;
        };
        themeClasses: {
            getter: any;
            _setter: any;
            __v_isRef: boolean;
            __v_isReadonly: any;
            effect: {
                fn: any;
                trigger: any;
                scheduler: any;
                active: boolean;
                deps: any[];
                _dirtyLevel: number;
                _trackId: number;
                _runnings: number;
                _shouldSchedule: boolean;
                _depsLength: number;
                dirty: boolean;
                run(): any;
                stop(): void;
            };
            _cacheable: boolean;
            value: any;
            _dirty: boolean;
        };
        styles: {
            getter: any;
            _setter: any;
            __v_isRef: boolean;
            __v_isReadonly: any;
            effect: {
                fn: any;
                trigger: any;
                scheduler: any;
                active: boolean;
                deps: any[];
                _dirtyLevel: number;
                _trackId: number;
                _runnings: number;
                _shouldSchedule: boolean;
                _depsLength: number;
                dirty: boolean;
                run(): any;
                stop(): void;
            };
            _cacheable: boolean;
            value: any;
            _dirty: boolean;
        };
        global: {
            name: any;
            current: {
                getter: any;
                _setter: any;
                __v_isRef: boolean;
                __v_isReadonly: any;
                effect: {
                    fn: any;
                    trigger: any;
                    scheduler: any;
                    active: boolean;
                    deps: any[];
                    _dirtyLevel: number;
                    _trackId: number;
                    _runnings: number;
                    _shouldSchedule: boolean;
                    _depsLength: number;
                    dirty: boolean;
                    run(): any;
                    stop(): void;
                };
                _cacheable: boolean;
                value: any;
                _dirty: boolean;
            };
        };
    };
    icons: {};
    locale: any;
    date: {
        options: {};
        instance: any;
    };
};
declare namespace Er {
    export { Pr as version };
}
declare function Wr(e: any): {};
declare function k(e: any): any;
declare function Pn(e: any): "#fff" | "#000";
declare function Ln(...args: any[]): any;
declare function bs(n: any): {};
declare function Fn(e: any): boolean;
declare function bt(...args: any[]): (t: any) => any;
declare function ws(e: any): any;
declare function as(e: any, t: any): {
    getter: any;
    _setter: any;
    __v_isRef: boolean;
    __v_isReadonly: any;
    effect: {
        fn: any;
        trigger: any;
        scheduler: any;
        active: boolean;
        deps: any[];
        _dirtyLevel: number;
        _trackId: number;
        _runnings: number;
        _shouldSchedule: boolean;
        _depsLength: number;
        dirty: boolean;
        run(): any;
        stop(): void;
    };
    _cacheable: boolean;
    value: any;
    _dirty: boolean;
};
declare function $n(n: any): {};
declare function $(e: any, t: any): any;
declare function Dt(): any;
declare namespace Dt {
    function reset(): void;
}
declare function X(e: any, t: any): (n: any) => {};
declare function Yn(e: any, t: any, n: any, ...args: any[]): {
    getter: any;
    _setter: any;
    __v_isRef: boolean;
    __v_isReadonly: any;
    effect: {
        fn: any;
        trigger: any;
        scheduler: any;
        active: boolean;
        deps: any[];
        _dirtyLevel: number;
        _trackId: number;
        _runnings: number;
        _shouldSchedule: boolean;
        _depsLength: number;
        dirty: boolean;
        run(): any;
        stop(): void;
    };
    _cacheable: boolean;
    value: any;
    _dirty: boolean;
};
declare function Qt(e: any, t: any): any;
declare function ne(e: any, t: any): any;
declare function _(e: any): void;
declare function gs(e: any): void;
declare function pe(e: any, t: any): any;
declare function Yr(e: any): any[];
declare function q(e: any, ...args: any[]): string;
declare function ps(e: any): {
    iconData: {
        getter: any;
        _setter: any;
        __v_isRef: boolean;
        __v_isReadonly: any;
        effect: {
            fn: any;
            trigger: any;
            scheduler: any;
            active: boolean;
            deps: any[];
            _dirtyLevel: number;
            _trackId: number;
            _runnings: number;
            _shouldSchedule: boolean;
            _depsLength: number;
            dirty: boolean;
            run(): any;
            stop(): void;
        };
        _cacheable: boolean;
        value: any;
        _dirty: boolean;
    };
};
declare function an(e: any): any;
declare const Pr: "3.4.4";
export { ds as $, Or as A, ys as B, Gr as C, zr as D, x as E, Ee as F, Lr as G, es as H, Sr as I, cs as J, us as K, ls as L, qr as M, Qr as N, J as O, os as P, jr as Q, rs as R, Rr as S, cn as T, Nr as U, tn as V, Jt as W, ms as X, Zr as Y, _r as Z, Kr as _, Dr as a, re as a0, Ue as a1, Xr as a2, Jr as a3, rn as a4, xt as a5, Pe as a6, ts as a7, ns as a8, Ur as a9, vs as aa, is as ab, fs as ac, on as ad, un as ae, hs as af, Vr as ag, Hr as ah, lt as ai, Br as aj, Ds as ak, Ss as al, xs as am, ss as b, Er as c, Wr as d, k as e, Pn as f, Ln as g, bs as h, Fn as i, bt as j, ws as k, as as l, $n as m, $ as n, Dt as o, X as p, Yn as q, Qt as r, ne as s, _ as t, gs as u, pe as v, Yr as w, q as x, ps as y, an as z };
