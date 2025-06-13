export function createBroswer({ proxy, real, headless, captchaPlugins, needRl, }: {
    proxy: string;
    real: boolean;
    headless: boolean;
    needRl: boolean;
    captchaPlugins: any[];
}): Promise<object>;
