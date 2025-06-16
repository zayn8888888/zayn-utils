/**
 * 提示用户输入信息
 * @param {string} prompt - 提示信息
 * @returns {Promise<string>} 用户输入的值
 */
export function askQuestion(prompt: string): Promise<string>;
/**
 * 生成代理对象
 * @param {string} proxyString - 代理字符串，支持格式：host:port 或 protocol://username:password@host:port
 * @param {Array<string>} [proxies=[]] - 其它代理列表，如果当前代理不可用，则会尝试使用其它代理
 * @param {Array<string>} [proxies=[]] - 其它代理列表，如果当前代理不可用，则会尝试使用其它代理
 * @returns {Promise<{host: string, port: number|string, username?: string, password?: string, httpAgent: Object, httpsAgent: Object,proxyString:String}>} 代理对象，包含主机、端口、用户名、密码和代理Agent

 */
export function createProxyAgent(proxyString: string, proxies?: Array<string>): Promise<{
    host: string;
    port: number | string;
    username?: string;
    password?: string;
    httpAgent: any;
    httpsAgent: any;
    proxyString: string;
}>;
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
 * @param maxCount {Number?} 最大重试次数
 * */
export function fnCanRetry(fn: Function, maxCount?: number | null): (...args: any[]) => Promise<any>;
export function checkProxy(...args: any[]): Promise<any>;
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
 * @param {function(any): Promise<any>} fn - 操作函数，异步函数
 * @returns {function(any, function?): Promise<any>} 返回一个队列执行函数
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
export function createQueue(concurrency: any, fn: (arg0: any) => Promise<any>): (arg0: any, arg1: Function | null) => Promise<any>;
/**
 *
 * 任务队列 每多少ms执行多少次任务
 * @param interval  每多少ms
 * @param maxTasksPerInterval 每interval 秒执行多少次任务
 * @param task {(arg) => Promise<any>}  任务函数
 * @returns  {function(any, function): Promise<any>}
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
export function createQueueByTime(interval: any, maxTasksPerInterval: any, task: (arg: any) => Promise<any>): (arg0: any, arg1: Function) => Promise<any>;
export function checkProxys(proxies: any): Promise<{
    validProxies: any[];
    invalidProxies: any[];
}>;
export function useGlobalTimeInterval(): any;
/**
 * 主线程
 * @param url {String} 文件路径
 * @param main {function} 主线程执行函数
 * @param run {function} 子线程执行函数
 */
export function useMainThread(url: string, main?: Function, run?: Function): void;
