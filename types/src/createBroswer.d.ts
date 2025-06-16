export type CaptchaPlugin = {
    /**
     * 自定义插件路径（与name互斥）
     */
    path?: string;
    /**
     * 内置插件名称（与path互斥）
     */
    name?: "2captcha" | "yesCaptcha";
    /**
     * 插件API密钥
     */
    key: string;
};
/**
 * @typedef {object} CaptchaPlugin
 * @property {string} [path] 自定义插件路径（与name互斥）
 * @property {"2captcha"|"yesCaptcha"} [name] 内置插件名称（与path互斥）
 * @property {string} key 插件API密钥
 */
/**
 * 创建自动化浏览器
 * @param {object} options
 * @param {string} options.proxy 代理地址
 * @param {boolean} options.real 是否真实浏览器
 * @param {boolean} options.headless 是否无头浏览器
 * @param {boolean} options.needRl 是否需要rl 支持exit 和script （运行./script.js 文件）
 * @param {string} options.chromePath 自定义chrome路径
 * @param {CaptchaPlugin[]} options.captchaPlugins 验证码插件配置数组
 * @example
 * // 使用内置2captcha插件
 * captchaPlugins: [{ name: "2captcha", key: "your-api-key" }]
 *
 * // 使用内置yesCaptcha插件
 * captchaPlugins: [{ name: "yesCaptcha", key: "your-client-key" }]
 *
 * // 使用自定义插件路径
 * captchaPlugins: [{ path: "/path/to/custom/plugin", key: "your-key" }]
 * @returns {Promise<object>} 返回浏览器相关对象
 * @property {import('puppeteer').Browser} browser - Puppeteer浏览器实例
 * @property {import('puppeteer').Page} page - 浏览器页面实例
 * @property {URL|null} parsedProxy - 解析后的代理配置对象，无代理时为null
 *
 */
export function createBroswer({ proxy, real, chromePath, headless, captchaPlugins, needRl, }: {
    proxy: string;
    real: boolean;
    headless: boolean;
    needRl: boolean;
    chromePath: string;
    captchaPlugins: CaptchaPlugin[];
}): Promise<object>;
