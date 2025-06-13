declare namespace t {
    let startThunder: string;
    let addBlackListWebsite: string;
    let removeBlackListWebsite: string;
    let getWebsiteDomains: string;
    let trackEvent: string;
}
declare function d(e: any): string;
declare function r(e: any, t: any): RegExpExecArray;
declare const _: "v1";
declare namespace s {
    let _switch: boolean;
    export { _switch as switch };
    export let ban_type: any[];
    export let ban_protocol: any[];
}
declare namespace i {
    let _switch_1: boolean;
    export { _switch_1 as switch };
    let ban_type_1: string[];
    export { ban_type_1 as ban_type };
    let ban_protocol_1: any[];
    export { ban_protocol_1 as ban_protocol };
}
declare function u(e: any, t: any, n: any): any;
declare namespace a {
    let NOT_OPEN_SITE: string;
    let OPEN_NOT_CONTROL_SITE: string;
    let OPEN_CONTROL_SITE: string;
    let STOP_ALL_CONTROL: string;
}
declare function p(e: any, t: any): boolean;
declare function l(e: any): string;
declare namespace e {
    let xl_call_function: string;
    let CheckEnabled: string;
    let xl_download: string;
    let xl_video_show: string;
    let xl_sniff_video_info: string;
}
declare namespace c {
    export let MORE_CHOICE_DOWNLOAD: string;
    export let OPEN_XUNLEI: string;
    export let ADVANCED_SETTING: string;
    let STOP_ALL_CONTROL_1: string;
    export { STOP_ALL_CONTROL_1 as STOP_ALL_CONTROL };
    export let START_ALL_CONTROL: string;
    export let CANCEL_CONTROL_CURRENT_SITE: string;
    export let OPEN_CONTROL_CURRENT_SITE: string;
    export let DOWNLOAD_PICTURE_ENTRANCE_CLICK: string;
}
declare const o: "https://down.sandai.net/thunder11/XunLeiWebSetup_extrecall.exe";
declare function E(e: any, t: any, n?: boolean): {
    cancel: () => void;
};
declare namespace n {
    namespace ENABLE {
        let icon: string;
        let tips: string;
        let badgeText: string;
    }
    namespace EXCEPTION {
        let icon_1: string;
        export { icon_1 as icon };
        let tips_1: string;
        export { tips_1 as tips };
        let badgeText_1: string;
        export { badgeText_1 as badgeText };
    }
    namespace DISABLE {
        let icon_2: string;
        export { icon_2 as icon };
        let tips_2: string;
        export { tips_2 as tips };
        let badgeText_2: string;
        export { badgeText_2 as badgeText };
    }
    namespace PAGE_DISABLE {
        let icon_3: string;
        export { icon_3 as icon };
        let tips_3: string;
        export { tips_3 as tips };
        let badgeText_3: string;
        export { badgeText_3 as badgeText };
    }
}
export { t as a, d as b, r as c, _ as d, s as e, i as f, u as g, a as h, p as i, l as j, e as o, c as p, o as r, E as s, n as t };
