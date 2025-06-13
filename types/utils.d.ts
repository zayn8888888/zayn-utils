/**
 * 提示用户输入信息
 * @param {string} prompt - 提示信息
 * @returns {Promise<string>} 用户输入的值
 */
export function askQuestion(prompt: string): Promise<string>;
/**
 * 检查代理是否可用
 * @param proxyString {String} 代理字符串
 *
 */
/**
 * 生成代理
 * @param proxyString {String} 代理字符串
 * @param proxies {Array?} 其它代理列表，如果当前不可用，则会尝试使用其它代理
 * @returns {Object} proxyInfo 代理对象
 * @returns {String} proxyInfo.host 代理主机
 * @returns {Number} proxyInfo.port 代理端口
 * @returns {String} proxyInfo.username 代理用户名
 * @returns {String} proxyInfo.password 代理密码
 * @returns {Object} proxyInfo.httpAgent http代理
 * @returns {Object} proxyInfo.httpsAgent https代理
 *
 *  */
export function createProxyAgent(proxyString: string, proxies?: any[] | null): any;
export function sleep(time?: number): Promise<any>;
export namespace log {
    function success(msg: any): void;
    function error(msg: any): void;
    function warn(msg: any): void;
    function info(msg: any): void;
    function white(msg: any): void;
    function whiteBold(msg: any): void;
    function green(msg: any): void;
    function greenBold(msg: any): void;
    function yellow(msg: any): void;
    function yellowBold(msg: any): void;
    function red(msg: any): void;
    function redBold(msg: any): void;
    function blue(msg: any): void;
    function blueBold(msg: any): void;
    function custom(fn: any): void;
}
/**
 * 重试函数
 * @param fn {Function} 函数
 * @param maxCount {Number=3?} 最大重试次数
 * @returns {Promise<*>}
 * */
export function fnCanRetry(fn: Function, maxCount?: number | undefined): Promise<any>;
export const checkProxy: Promise<any>;
export function loadProxies(path?: string): string[];
export function loadUser(path?: string): string[];
/**
 * 随机等待时间
 * @param {number} min - 最小等待时间（秒）
 * @param {number} max - 最大等待时间（秒）
 * @returns {Promise<void>}
 */
export function randomWait(min: number, max: number): Promise<void>;
/**
 * 创建任务
 * @param {Array} tasks - 任务列表
 * @param {Function} fn - 任务函数 fn(task, proxy, index, switchProxyFn)
 * @param {Array} proxies - 代理列表
 * @param {number} concurrence - 并发数
 * @returns {Promise<Array>} 返回所有任务结果
 */
export function createProcess(tasks: any[], fn: Function, proxies?: any[], concurrence?: number): Promise<any[]>;
/**
 * 队列操作
 * @param concurrency 同时执行的数量
 * @param fn {(arg) => Promise<any>} 操作函数 异步函数
 * @returns  {function(arg, getRemoveQueueSource?): Promise<any>}
 *
 * @desc
 * 使用方法
 *
 * let removeFn = null
 *
 * const getRemoveFn = fn => removeFn = fn
 *
 * const handleDataByQueue = createQueue(3, async (dataItem) => {
 *
 *  await sleep(1000)
 *
 *  console.log(dataItem)
 *
 *  return dataItem
 *
 *  })
 *
 *  handleDataByQueue(1, getRemoveFn)
 *
 *  // 取消排队
 *
 *  setTimeout(() => {
 *
 *  removeFn && removeFn()
 *
 *  }, 1000)
 *
 * */
export function createQueue(concurrency: any, fn: (arg: any) => Promise<any>): (arg0: arg, arg1: getRemoveQueueSource | null) => Promise<any>;
/**
 *
 * 任务队列 每多少ms执行多少次任务
 * @param interval  每多少ms
 * @param maxTasksPerInterval 每interval 秒执行多少次任务
 * @param task {(arg) => Promise<any>}  任务函数
 * @returns  {function(arg, getRemoveQueueSource?): Promise<any>}
 *
 * 使用方法
 *
 * const handleDataByTime = createQueueByTime(1000, 10, async (dataItem) => {
 *
 *  await sleep(1000)
 *
 *  console.log(dataItem)
 *
 *  return dataItem
 *
 *  })
 *
 *  let removeFn = null
 *
 *  handleDataByTime(data, (removeTask)=>{
 *
 *     removeFn=removeTask
 *
 *  })
 *
 *  // 取消排队
 *
 *  setTimeout(() => {removeFn()},100)
 *
 * */
export function createQueueByTime(interval: any, maxTasksPerInterval: any, task: (arg: any) => Promise<any>): (arg0: arg, arg1: getRemoveQueueSource | null) => Promise<any>;
export function checkProxys(proxies: any): Promise<{
    validProxies: any[];
    invalidProxies: any[];
}>;
export function useGlobalTimeInterval(): any;
export function useMainThread(url: any, main?: () => void, run?: () => void): void;
