/**
 * 创建或者登录邮箱
 * @param {object}  [options]
 * @param {string }  [options.preEmail] 登录邮箱，没有则新建
 * @param {string }  [options.password]  邮箱密码
 * @returns {Promise<{email: string, password: string, token: string}>}
 */
export function createOrLoginEmail({ preEmail, password, }?: {
    preEmail?: string;
    password?: string;
}): Promise<{
    email: string;
    password: string;
    token: string;
}>;
/**
 * 等待邮件
 * @param {*} token
 * @param {*} maxWaitTime 最大等待时间，单位 3秒
 */
export function waitForMail(token: any, maxWaitTime?: any): Promise<any>;
