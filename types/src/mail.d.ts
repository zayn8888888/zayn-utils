/**
 * 创建或者登录邮箱
 * @param {object}  [options]
 * @param {string }  [options.preEmail] 登录邮箱，没有则新建
 * @param {string }  [options.password]  邮箱密码
 * @param {string} [options.proxyStr] 代理字符串
 * @param {string} [options.proxyAgent] 代理
 * @returns {Promise<{email: string, password: string, token: string}>}
 */
export function createOrLoginEmail({ preEmail, password, proxyStr, proxyAgent, }?: {
    preEmail?: string;
    password?: string;
    proxyStr?: string;
    proxyAgent?: string;
}): Promise<{
    email: string;
    password: string;
    token: string;
}>;
/**
 * 等待邮件
 * @param {*} token
 * @param {object} options
 * @param {number} options.maxWaitTime 最大等待时间，单位 3秒
 * @param {string} options.proxyStr 代理字符串
 * @param {*}  options.proxyAgent 代理
 *
 *
 */
export function waitForMail(token: any, { maxWaitTime, proxyStr, proxyAgent }: {
    maxWaitTime: number;
    proxyStr: string;
    proxyAgent: any;
}): Promise<any>;
