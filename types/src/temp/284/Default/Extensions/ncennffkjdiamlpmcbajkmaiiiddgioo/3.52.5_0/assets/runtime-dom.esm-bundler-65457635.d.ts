declare function Rs(e: any): any;
declare function Cs(e: any, t: any, n: any, s: any, o: any): any;
declare const ds: unique symbol;
declare function et(e: any): any;
declare function yn(t: any, n?: any): any;
declare function Qs(e: any, t: any): yt;
/*! #__NO_SIDE_EFFECTS__ */ declare function on(e: any, t: any): any;
declare function Ts(e: any, t?: any, n?: any, s?: number, o?: any, r?: boolean): any;
declare function kn(e: any): any;
declare function ys(e?: boolean): void;
declare function Ss(e: any, t: any, n: any, s: any, o: any, r: any): any;
declare function Ps(e: any, t?: any, n?: any, s?: number, o?: any, r?: number, l?: boolean, i?: boolean): {
    __v_isVNode: boolean;
    __v_skip: boolean;
    type: any;
    props: any;
    key: any;
    ref: any;
    scopeId: any;
    slotScopeIds: any;
    children: any;
    component: any;
    suspense: any;
    ssContent: any;
    ssFallback: any;
    dirs: any;
    transition: any;
    el: any;
    anchor: any;
    target: any;
    targetAnchor: any;
    staticCount: number;
    shapeFlag: number;
    patchFlag: number;
    dynamicProps: any;
    dynamicChildren: any;
    appContext: any;
    ctx: any;
};
declare function js(e?: string, t?: number): any;
declare function D(e: any): string;
declare function So(e: any, t: any): (n: any, ...s: any[]) => any;
declare function En(e: any, t: any, n: any, s: any): any[];
declare function At(e: any): any;
declare function vn(t: any, n?: any): any;
declare function Vs(e?: string, t?: boolean): any;
declare function $(e: any): any;
declare function ht(e: any): any;
declare function nn(e: any, n: any): any;
declare function q(e: any): string;
declare function gt(e: any): any;
declare function Oo(...e: any[]): any;
declare function Zt(e: any, t: any, n: any): () => void;
declare function Ms(e: any, t: any): any;
declare namespace io {
    function beforeMount(e: any, { value: t }: {
        value: any;
    }, { transition: n }: {
        transition: any;
    }): void;
    function mounted(e: any, { value: t }: {
        value: any;
    }, { transition: n }: {
        transition: any;
    }): void;
    function updated(e: any, { value: t, oldValue: n }: {
        value: any;
        oldValue: any;
    }, { transition: s }: {
        transition: any;
    }): void;
    function beforeUnmount(e: any, { value: t }: {
        value: any;
    }): void;
}
export function z(e: any): any;
declare class yt {
    constructor(e: any, t: any, n: any, s: any);
    _setter: any;
    __v_isRef: boolean;
    __v_isReadonly: any;
    _dirty: boolean;
    effect: le;
    _cacheable: boolean;
    set value(e: any);
    get value(): any;
}
declare class le {
    constructor(e: any, t: any, n: any);
    fn: any;
    scheduler: any;
    active: boolean;
    deps: any[];
    run(): any;
    parent: any;
    stop(): void;
    deferStop: boolean;
}
export { Rs as A, Cs as B, ds as F, et as a, yn as b, Qs as c, on as d, Ts as e, kn as f, ys as g, Ss as h, Ps as i, js as j, D as k, So as l, En as m, At as n, vn as o, Vs as p, $ as q, ht as r, nn as s, q as t, gt as u, Oo as v, Zt as w, Ms as x, io as y };
