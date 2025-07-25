/**
 * 浏览器公共类
 * @class BaseBrowser
 * @description 浏览器公共类，提供基础的浏览器操作和功能
 * @property {Object} waitForKeyRequestsOps 等待请求配置 每次点击请求,会根据waitForKeyRequestsOps自动等待
 * @property {number} waitForKeyRequestsOps.timeout 超时时间
 * @property {RegExp[]} waitForKeyRequestsOps.patterns 匹配模式 每次点击请求,会根据patterns来判断是否需要等待
 * @property {RegExp[]} waitForKeyRequestsOps.excludePatterns 排除模式 每次点击请求,会根据excludePatterns来判断是否需要等待
 * @property {number} waitForKeyRequestsOps.fallbackDelay  无网络请求时的后备延迟 回退延迟(即使用humanClick 但没配置是否等待网络请求,会根据maxWaitForFirstRequest来判断是否需要等待)
 * @property {number} waitForKeyRequestsOps.maxWaitForFirstRequest 最大等待第一个请求时间 回退延迟(即使用humanClick 但没配置是否等待网络请求,会根据maxWaitForFirstRequest来判断是否需要等待)
 */
export class BaseBrowser {
    waitForKeyRequestsOps: {};
    /** 日志
     * @param {*} data 日志数据
     * @param {'log'|'warn'|'error'} type 日志类型
     */
    log(data: any, type?: "log" | "warn" | "error"): Promise<void>;
    /** 智能滚动
     * @param {*} targetElement 目标元素
     */
    smartScroll(targetElement: any): Promise<any>;
    /** 随机睡眠
     * @param {*} min 最小值
     * @param {*} max 最大值
     */
    randomSleep(min: any, max: any): Promise<any>;
    /** 智能滚动
     * @param {*} page 页面对象
     * @param {*} scrollInfo 滚动信息
     * @param {*} targetElement 目标元素
     */
    humanLikeScroll(page: any, scrollInfo: any, targetElement: any): Promise<void>;
    /** 智能鼠标移动
     * @param {*} page 页面对象
     * @param {*} endX 目标X坐标
     * @param {*} endY 目标Y坐标
     */
    humanLikeMouseMove(page: any, endX: any, endY: any): Promise<void>;
    /** 初始化鼠标位置跟踪
     * @param {*} page 页面对象
     */
    initMouseTracking(page: any): Promise<void>;
    /** 随机页面交互
     * @param {*} page 页面对象
     */
    randomPageInteraction(page: any): Promise<void>;
    /** 模拟人类输入
     * @param {*} page 页面对象
     * @param {*} selector 选择器
     * @param {*} text 文本
     */
    humanType(page: any, selector: any, text: any): Promise<void>;
    /** 模拟人类拖动
     * @param {*} page 页面对象
     * @param {*} selector 选择器
     */
    huamanSlide(page: any, selector: any): Promise<void>;
    /** 检查元素是否可见
     * @param {*} element 元素对象
     */
    isVisible(element: any): Promise<any>;
    /** 模拟人类点击
     * @param {*} page 页面对象
     * @param {*} selector 选择器
     * @param {Object} options 选项
     * @param {number} options.timeout 超时时间
     * @param {boolean} options.waitForNetwork 是否等待网络请求
     * @param {number} options.maxWaitForFirstRequest 网络等待超时
     * @param {number} options.fallbackDelay 无网络请求时的后备延迟
     */
    humanClick(page: any, selector: any, options?: {
        timeout: number;
        waitForNetwork: boolean;
        maxWaitForFirstRequest: number;
        fallbackDelay: number;
    }): Promise<void>;
    waitForKeyRequestsWithFallback(page: any, options?: {}): Promise<any>;
}
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
