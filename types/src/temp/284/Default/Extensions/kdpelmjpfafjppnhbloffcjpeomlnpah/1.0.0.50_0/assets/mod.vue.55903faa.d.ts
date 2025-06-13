declare function Ks(e: any, t: any, n: any): any;
declare function Aa(e: any, t: any): any;
declare function bi(e?: boolean): void;
declare function Na(e: any, t: any, n: any, o: any, r: any, s: any): any;
declare function Pa(e: any, t: any, n: {}, o: any, r: any): any;
declare function wi(e: any, t: any, n: any, o: any, r: any): any;
declare function ja(e?: string, t?: boolean): any;
declare function er(t: any, n?: any): void;
declare function xi(e: any, t?: any, n?: any, o?: number, r?: any, s?: number, i?: boolean, l?: boolean): {
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
    targetStart: any;
    targetAnchor: any;
    staticCount: number;
    shapeFlag: number;
    patchFlag: number;
    dynamicProps: any;
    dynamicChildren: any;
    appContext: any;
    ctx: any;
};
declare function ll(e: any): any;
declare function Ka(e: any, t: any): any;
declare function Bn(e: any): string;
declare const ye: unique symbol;
declare function Ct(n: any): any;
declare function Fe(e: any, ...t: any[]): void;
declare function Ee(n: any): any;
declare function de(...e: any[]): any;
declare function yf(...e: any[]): {
    class: string;
    style: any;
};
declare function As(e: any): any;
declare function xa(e: any): void;
declare function Sa(): void;
declare function Va(e: any, t: any): any;
declare const sn: unique symbol;
declare function ya(e: any): any;
declare function gf(e: any): any;
declare function Ta(e: any): typeof Ks;
declare function kn(e: any): any;
declare function Wa(e: any, t: any): any;
declare function Go(e: any): any;
declare function Ga(...e: any[]): any;
declare function Ai(e: any, { slots: t }: {
    slots: any;
}): any;
declare namespace Ai {
    let displayName: string;
    let props: {
        mode: StringConstructor;
        appear: BooleanConstructor;
        persisted: BooleanConstructor;
        onBeforeEnter: (FunctionConstructor | ArrayConstructor)[];
        onEnter: (FunctionConstructor | ArrayConstructor)[];
        onAfterEnter: (FunctionConstructor | ArrayConstructor)[];
        onEnterCancelled: (FunctionConstructor | ArrayConstructor)[];
        onBeforeLeave: (FunctionConstructor | ArrayConstructor)[];
        onLeave: (FunctionConstructor | ArrayConstructor)[];
        onAfterLeave: (FunctionConstructor | ArrayConstructor)[];
        onLeaveCancelled: (FunctionConstructor | ArrayConstructor)[];
        onBeforeAppear: (FunctionConstructor | ArrayConstructor)[];
        onAppear: (FunctionConstructor | ArrayConstructor)[];
        onAfterAppear: (FunctionConstructor | ArrayConstructor)[];
        onAppearCancelled: (FunctionConstructor | ArrayConstructor)[];
    } & {
        name: StringConstructor;
        type: StringConstructor;
        css: {
            type: BooleanConstructor;
            default: boolean;
        };
        duration: (ObjectConstructor | StringConstructor | NumberConstructor)[];
        enterFromClass: StringConstructor;
        enterActiveClass: StringConstructor;
        enterToClass: StringConstructor;
        appearFromClass: StringConstructor;
        appearActiveClass: StringConstructor;
        appearToClass: StringConstructor;
        leaveFromClass: StringConstructor;
        leaveActiveClass: StringConstructor;
        leaveToClass: StringConstructor;
    };
}
declare function $a(e: any): any;
declare function Ea(e: any, t: any): any;
declare function Ia(e: any): any;
declare namespace Ha {
    export let name: string;
    let props_1: {
        mode: StringConstructor;
        appear: BooleanConstructor;
        persisted: BooleanConstructor;
        onBeforeEnter: (FunctionConstructor | ArrayConstructor)[];
        onEnter: (FunctionConstructor | ArrayConstructor)[];
        onAfterEnter: (FunctionConstructor | ArrayConstructor)[];
        onEnterCancelled: (FunctionConstructor | ArrayConstructor)[];
        onBeforeLeave: (FunctionConstructor | ArrayConstructor)[];
        onLeave: (FunctionConstructor | ArrayConstructor)[];
        onAfterLeave: (FunctionConstructor | ArrayConstructor)[];
        onLeaveCancelled: (FunctionConstructor | ArrayConstructor)[];
        onBeforeAppear: (FunctionConstructor | ArrayConstructor)[];
        onAppear: (FunctionConstructor | ArrayConstructor)[];
        onAfterAppear: (FunctionConstructor | ArrayConstructor)[];
        onAppearCancelled: (FunctionConstructor | ArrayConstructor)[];
    } & {
        name: StringConstructor;
        type: StringConstructor;
        css: {
            type: BooleanConstructor;
            default: boolean;
        };
        duration: (ObjectConstructor | StringConstructor | NumberConstructor)[];
        enterFromClass: StringConstructor;
        enterActiveClass: StringConstructor;
        enterToClass: StringConstructor;
        appearFromClass: StringConstructor;
        appearActiveClass: StringConstructor;
        appearToClass: StringConstructor;
        leaveFromClass: StringConstructor;
        leaveActiveClass: StringConstructor;
        leaveToClass: StringConstructor;
    } & {
        tag: StringConstructor;
        moveClass: StringConstructor;
    };
    export { props_1 as props };
    export function setup(e: any, { slots: t }: {
        slots: any;
    }): () => any;
}
declare namespace Hf {
    let name_1: string;
    export { name_1 as name };
}
declare function hc(t: any, n?: any): void;
declare namespace Fa {
    let name_2: string;
    export { name_2 as name };
    export let __isTeleport: boolean;
    export function process(e: any, t: any, n: any, o: any, r: any, s: any, i: any, l: any, f: any, u: any): void;
    export function remove(e: any, t: any, n: any, { um: o, o: { remove: r } }: {
        um: any;
        o: {
            remove: any;
        };
    }, s: any): void;
    export { gn as move };
    export { qc as hydrate };
}
declare function mf(e?: string, t?: number): any;
declare function Ma(e: any, t: any, n: any, o: any): any[];
declare namespace ka {
    function created(e: any, { modifiers: { lazy: t, trim: n, number: o } }: {
        modifiers: {
            lazy: any;
            trim: any;
            number: any;
        };
    }, r: any): void;
    function mounted(e: any, { value: t }: {
        value: any;
    }): void;
    function beforeUpdate(e: any, { value: t, oldValue: n, modifiers: { lazy: o, trim: r, number: s } }: {
        value: any;
        oldValue: any;
        modifiers: {
            lazy: any;
            trim: any;
            number: any;
        };
    }, i: any): void;
}
declare function Da(e: any): void;
declare namespace Ba {
    export let deep: boolean;
    export function created(e: any, t: any, n: any): void;
    export { ss as mounted };
    export function beforeUpdate(e: any, t: any, n: any): void;
}
declare namespace Ua {
    function created(e: any, { value: t }: {
        value: any;
    }, n: any): void;
    function beforeUpdate(e: any, { value: t, oldValue: n }: {
        value: any;
        oldValue: any;
    }, o: any): void;
}
declare function ie(e: any): boolean;
declare function $t(e: any): any;
declare function Ca(e: any, t: any, n: any, ...args: any[]): any;
declare function _a(e: any): ps;
declare function If(e: any, t: any): $s;
declare function Xn(): any;
declare function Ra(): boolean;
declare function wn(e: any, t: any, n?: boolean, ...args: any[]): any;
declare function fl(): any;
declare function wa(e: any): {};
declare function Il(e: any): any;
declare function Ml(e: any): any;
declare function ql(e: any): any;
declare function ba(e: any): void;
declare function Oa(e: any, t: any): any;
declare function Mf(e: any, t: any, n: any, ...args: any[]): any;
declare function Fl(e: any): any;
declare function va(e: any): any;
declare function N(e: any): any;
declare function Nl(e: any): any;
declare function Pc(e: any, t: any): void;
declare function po(e: any, t: any, n: any): () => void;
declare function La(e: any, t: any): () => void;
declare function Qo(t: any, n?: any): void;
declare function Zs(t: any, n?: any): void;
declare function gn(e: any, t: any, n: any, { o: { insert: o }, m: r }: {
    o: {
        insert: any;
    };
    m: any;
}, s?: number): void;
declare function qc(e: any, t: any, n: any, o: any, r: any, s: any, { o: { nextSibling: i, parentNode: l, querySelector: f } }: {
    o: {
        nextSibling: any;
        parentNode: any;
        querySelector: any;
    };
}, u: any): any;
declare function ss(e: any, { value: t, oldValue: n }: {
    value: any;
    oldValue: any;
}, o: any): void;
declare class ps {
    constructor(t?: boolean);
    detached: boolean;
    _active: boolean;
    effects: any[];
    cleanups: any[];
    parent: any;
    index: number;
    get active(): boolean;
    run(t: any): any;
    on(): void;
    off(): void;
    stop(t: any): void;
}
declare class $s {
    constructor(t: any, n: any, o: any, r: any);
    getter: any;
    _setter: any;
    __v_isRef: boolean;
    __v_isReadonly: any;
    effect: Bo;
    _cacheable: boolean;
    set value(t: any);
    get value(): any;
    set _dirty(t: boolean);
    get _dirty(): boolean;
}
declare class Bo {
    constructor(t: any, n: any, o: any, r: any);
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
    set dirty(t: boolean);
    get dirty(): boolean;
    run(): any;
    stop(): void;
}
export { Ks as $, Aa as A, bi as B, Na as C, Pa as D, wi as E, ja as F, er as G, xi as H, ll as I, Ka as J, Bn as K, ye as L, Ct as M, Fe as N, Ee as O, de as P, yf as Q, As as R, xa as S, Sa as T, Va as U, sn as V, ya as W, gf as X, Ta as Y, kn as Z, Wa as _, Go as a, Ga as a0, Ai as a1, $a as a2, Ea as a3, Ia as a4, Ha as a5, Hf as a6, hc as a7, Fa as a8, mf as a9, Ma as aa, ka as ab, Da as ac, Ba as ad, Ua as ae, ie as b, $t as c, Ca as d, _a as e, If as f, Xn as g, Ra as h, wn as i, fl as j, wa as k, Il as l, Ml as m, ql as n, ba as o, Oa as p, Mf as q, Fl as r, va as s, N as t, Nl as u, Pc as v, po as w, La as x, Qo as y, Zs as z };
