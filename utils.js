import axios from "axios";
import { SocksProxyAgent } from "socks-proxy-agent";
import { HttpsProxyAgent } from "https-proxy-agent";
import fs from "fs";
import { fileURLToPath } from "url";
import { isMainThread } from "worker_threads";
import path from "path";
import readline from "readline";

const checkProxys = async (proxies) => {
  const validProxies = [];
  const invalidProxies = [];
  await Promise.all(
    proxies.map(async (proxy) => {
      try {
        const data = await checkProxy(proxy);
        if (!data) throw new Error("代理不可用");
        validProxies.push(proxy);
      } catch (e) {
        invalidProxies.push(proxy);
      }
    })
  );
  return { validProxies, invalidProxies };
};
const loadProxies = (path = "proxies.txt") => {
  // 检查文件是否存在
  if (!fs.existsSync(path)) {
    throw new Error("proxies.txt not found");
  }
  const data = fs.readFileSync(path);
  const proxys = data
    .toString()
    .split("\n")
    .filter((item) => item)
    .map((item) => item.trim());
  return proxys;
};
const loadUser = (path = "wallet.txt") => {
  // 检查文件是否存在
  if (!fs.existsSync(path)) {
    throw new Error("wallet.txt not found");
  }
  const data = fs.readFileSync(path);
  const wallet = data
    .toString()
    .split("\n")
    .map((item) => item.trim())
    .filter((item) => item);
  return wallet;
};
const sleep = (time = 3000) => {
  if (time < 10) {
    time = time * 1000;
  }
  log.yellow(`等待${time / 1000}s`);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
};

const checkProxy = fnCanRetry(async (agent, proxyString) => {
  if (typeof agent === "string") {
    return await createProxyAgent(agent);
  }
  try {
    await axios({
      method: "HEAD",
      url: "https://ipinfo.io/json",
      httpsAgent: agent,
      timeout: 3000,
      httpsAgent: agent,
      timeout: 3000,
    });
  } catch (e) {
    console.log("检查代理失败", e.message || e, proxyString);
    return Promise.reject("检查代理失败");
  }
}, 4);

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
async function createProxyAgent(proxyString, proxies = []) {
  try {
    let protocol, host, port, auth;

    if (proxyString.includes("://")) {
      const url = new URL(proxyString);
      protocol = url.protocol.replace(":", "");
      host = url.hostname;
      port = url.port;
      auth =
        url.username && url.password ? `${url.username}:${url.password}` : null;
    } else {
      const parts = proxyString.split(":");
      if (parts.length >= 2) {
        if (parts.length === 2) {
          [host, port] = parts;
          protocol = "http";
        } else if (parts.length === 4) {
          [host, port, ...auth] = parts;
          auth = auth.join(":");
          protocol = "http";
        } else if (proxyString.includes("@")) {
          const [credentials, server] = proxyString.split("@");
          auth = credentials;
          [host, port] = server.split(":");
          protocol = "http";
        }
      }
    }

    if (!host || !port) {
      throw new Error(`Invalid proxy format: ${proxyString}`);
    }

    let proxyType = protocol?.toLowerCase() || "http";

    let httpAgent, httpsAgent;

    if (proxyType.startsWith("http")) {
      const httpProxyUrl = `http://${auth ? auth + "@" : ""}${host}:${port}`;
      httpAgent = new HttpsProxyAgent(httpProxyUrl, {
        rejectUnauthorized: false,
        keepAlive: true,
        timeout: 15000, // 总超时时间增加到15秒
        freeSocketTimeout: 30000, // 空闲连接超时
        connectTimeout: 5000, // 单独设置连接建立超时
        maxSockets: 50,
      });
      httpsAgent = new HttpsProxyAgent(httpProxyUrl, {
        rejectUnauthorized: false,
        keepAlive: true,
        timeout: 15000, // 总超时时间增加到15秒
        freeSocketTimeout: 30000, // 空闲连接超时
        connectTimeout: 5000, // 单独设置连接建立超时
        maxSockets: 50,
      });
    } else {
      const socksUrl = `socks${proxyType.endsWith("4") ? "4" : "5"}://${
        auth ? auth + "@" : ""
      }${host}:${port}`;
      httpAgent = new SocksProxyAgent(socksUrl, {
        rejectUnauthorized: false,
        keepAlive: true,
        timeout: 15000, // 总超时时间增加到15秒
        freeSocketTimeout: 30000, // 空闲连接超时
        connectTimeout: 5000, // 单独设置连接建立超时
        maxSockets: 50,
      });
      httpsAgent = new SocksProxyAgent(socksUrl, {
        rejectUnauthorized: false,
        keepAlive: true,
        timeout: 15000, // 总超时时间增加到15秒
        freeSocketTimeout: 30000, // 空闲连接超时
        connectTimeout: 5000, // 单独设置连接建立超时
        maxSockets: 50,
      });
    }
    // 验证代理
    try {
      await checkProxy(httpsAgent, proxyString);
    } catch (error) {
      throw error;
      /* if (proxies.length > 0) {
        console.log("使用下一个代理");
        let index = proxies.findIndex((p) => p === proxyString);
        if (!index && index !== 0) {
          // 随机一个
          index = Math.floor(Math.random() * proxies.length);
        }
        const newProxy = index + (1 % proxies.length);
        const res = await createProxyAgent(
          proxies[newProxy],
          proxies.filter((p) => p !== proxyString)
        );
        return res;
      } else {
        throw "代理不可用";
      } */
    }
    return {
      port,
      host,
      username: auth ? auth.split(":")[0] : null,
      password: auth ? auth.split(":")[1] : null,
      httpAgent,
      httpsAgent,
      proxyString,
    };
  } catch (error) {
    console.error(`[ERROR] Failed to create proxy agent: ${error.message}`);
    return null;
  }
}

let chalk;
(async () => {
  chalk = (await import("chalk")).default;
  chalk.level = 3; // 3表示支持16百万种颜色
})();
const curTime = () => {
  return new Date().toLocaleString();
};
const logWithTime = (msg) => {
  console.log(curTime() + " " + msg);
};
const logObj = {
  success: (msg) => {
    msg = typeof msg === "string" ? msg : JSON.stringify(msg, null, 2);
    logWithTime(chalk.green.bold(msg));
  },
  error: (msg) => {
    msg = typeof msg === "string" ? msg : JSON.stringify(msg, null, 2);
    logWithTime(chalk.red.bold(msg));
  },
  warn: (msg) => {
    msg = typeof msg === "string" ? msg : JSON.stringify(msg, null, 2);
    logWithTime(chalk.yellow.bold(msg));
  },
  info: (msg) => {
    msg = typeof msg === "string" ? msg : JSON.stringify(msg, null, 2);
    logWithTime(chalk.white(msg));
  },
  white: (msg) => {
    msg = typeof msg === "string" ? msg : JSON.stringify(msg, null, 2);
    logWithTime(chalk.white(msg));
  },
  whiteBold: (msg) => {
    logWithTime(chalk.white.bold(msg));
  },
  green: (msg) => {
    logWithTime(chalk.green(msg));
  },
  greenBold: (msg) => {
    logWithTime(chalk.green.bold(msg));
  },
  yellow: (msg) => {
    logWithTime(chalk.yellow(msg));
  },
  yellowBold: (msg) => {
    logWithTime(chalk.yellow.bold(msg));
  },
  red: (msg) => {
    logWithTime(chalk.red(msg));
  },
  redBold: (msg) => {
    logWithTime(chalk.red.bold(msg));
  },
  blue: (msg) => {
    logWithTime(chalk.blue(msg));
  },
  blueBold: (msg) => {
    logWithTime(chalk.blue.bold(msg));
  },
  custom: (fn) => {
    return logWithTime(fn(chalk));
  },
};

const log = new Proxy(logObj, {
  get: (target, property) => {
    if (!chalk || !target[property]) {
      return console.log;
    }
    return target[property];
  },
});

/**
 * 重试函数
 * @param fn {Function} 函数
 * @param maxCount {Number=3?} 最大重试次数
 * @returns {Promise<*>}
 * */
function fnCanRetry(fn, maxCount = 3) {
  return async function (...args) {
    let count = 0;
    while (count < maxCount) {
      try {
        return await fn(...args);
      } catch (error) {
        if (count === maxCount - 1) {
          throw error;
        }
        await sleep(3000);
        console.log(`Retry ${count + 1} times`);
        count++;
      }
    }
  };
}

/**
 * 提示用户输入信息
 * @param {string} prompt - 提示信息
 * @returns {Promise<string>} 用户输入的值
 */
function askQuestion(prompt) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => {
    rl.question("\x1b[33m" + prompt + ": \x1b[0m", (answer) => {
      // 释放资源
      rl.close();
      if (!answer.trim()) {
        log.red("❌ 输入不能为空，请重新输入");
        resolve(askQuestion(prompt));
      } else {
        resolve(answer.trim());
      }
    });
  });
}
/**
 * 随机等待时间
 * @param {number} min - 最小等待时间（秒）
 * @param {number} max - 最大等待时间（秒）
 * @returns {Promise<void>}
 */
const randomWait = async (min, max) => {
  const waitTime = Math.floor(Math.random() * (max - min + 1)) + min;
  await sleep(waitTime * 1000);
};

/**
 * 创建任务
 * @param {Array} tasks - 任务列表
 * @param {Function} fn - 任务函数 fn(task, proxy, index, switchProxyFn)
 * @param {Array} proxies - 代理列表
 * @param {number} concurrence - 并发数
 * @returns {Promise<Array>} 返回所有任务结果
 */
const createProcess = async (tasks, fn, proxies = [], concurrence = null) => {
  // 无代理模式直接执行
  if (!proxies.length) {
    log.info("无代理模式，直接执行任务");
    for (let i = 0; i < tasks.length; i++) {
      const task = tasks[i];
      try {
        await fn(task, {}, i);
      } catch (e) {
        log.error(`任务执行失败: ${e.message}`);
      }
    }
    return Promise.all(tasks.map((task, index) => fn(task, {}, index)));
  }

  // 保持顺序
  const proxyMap = new Map();
  proxies.forEach((proxy) => {
    proxyMap.set(proxy, "");
  });

  await Promise.all(
    proxies.map(async (proxyStr, index) => {
      try {
        // if (index >= tasks.length) {
        //   return;
        // }
        const agent = await createProxyAgent(proxyStr);
        if (agent) {
          proxyMap.set(proxyStr, agent);
        }
      } catch (e) {
        log.error(`❌ 代理不可用: ${proxyStr} - ${e.message}`);
      }
    })
  );
  // proxyMap 值为空的不要
  // 代理预验证（新增代码）
  const validProxies = proxies
    .map((proxy) => proxyMap.get(proxy)) // <-- 按原始顺序遍历
    .filter(Boolean);

  // 全部代理失效时降级处理（新增代码）
  if (validProxies.length === 0) {
    log.error("⚠️ 无有效代理");
    throw new Error("无有效代理");
  }

  // 创建代理队列（新增代理过滤）
  const taskQueues = new Map();
  validProxies.forEach((proxy) => taskQueues.set(proxy, []));

  // 分配任务到有效代理队列（修改代码）
  tasks.forEach((task, index) => {
    const proxy = validProxies[index % validProxies.length];
    taskQueues
      .get(proxy)
      .push({ task, proxy, index, retries: 0, visitedProxies: [] });
  });

  const unfinishedTask = [];

  // ... 保持原有队列处理逻辑不变 ...
  const processQueue = async (queue) => {
    const results = [];
    while (queue.length > 0) {
      let { task, proxy, index, visitedProxies } = queue.shift();
      try {
        // 记录已使用的代理
        visitedProxies = [...visitedProxies, proxy];
        const result = await fn(task, proxy, index, () => {
          // 更换队列
          const availableProxies = validProxies.filter((p) => {
            return !visitedProxies.includes(p) && taskQueues.get(p).length;
          });
          if (!availableProxies.length) {
            log.yellow(
              `当前代理${proxy.proxyString} 可能不可用，无可用的代理，最后会再查询一次`
            );
            unfinishedTask.push({ task, index, visitedProxies });
            return;
          }
          const nextProxy =
            availableProxies[
              Math.floor(Math.random() * availableProxies.length)
            ];
          log.yellow(
            `当前代理${proxy.proxyString} 可能不可用，尝试新的代理  ${nextProxy.proxyString}`
          );
          visitedProxies = [...visitedProxies, nextProxy];
          taskQueues.get(nextProxy).push({
            task,
            proxy: nextProxy,
            index,
            visitedProxies,
          });

          while (queue.length > 0) {
            const { task, index, visitedProxies } = queue.shift();
            taskQueues
              .get(nextProxy)
              .push({ task, proxy: nextProxy, index, visitedProxies });
          }
          //
        }); // 修改参数传递代理对象
        results.push(result);
      } catch (e) {
        console.log(e);
        log.error(`任务执行失败: ${e.message}`);
        results.push(null);
      }
    }
    return results;
  };
  // 并发处理
  if (!concurrence) concurrence = validProxies.length;
  const queueProcessByConcurrence = createQueue(concurrence, (queue) =>
    processQueue(queue)
  );
  const allResults = await Promise.all(
    [...taskQueues.values()].map((queue) => queueProcessByConcurrence(queue))
  );

  const notValidProxies = [];
  while (unfinishedTask.length) {
    let { task, index, visitedProxies } = unfinishedTask.shift();
    const availableProxies = validProxies.filter(
      (p) => !visitedProxies.includes(p) && !notValidProxies.includes(p)
    );
    if (!availableProxies.length) {
      log.yellow(`当前代理无可用的代理`);
      return;
    }
    const nextProxy =
      availableProxies[Math.floor(Math.random() * availableProxies.length)];
    log.yellow(`尝试新的代理  ${nextProxy.proxyString}`);
    visitedProxies = [...visitedProxies, nextProxy];
    try {
      const result = await fn(task, nextProxy, index, () => {
        unfinishedTask.push({ task, index, visitedProxies });
        notValidProxies.push(nextProxy);
      });
      allResults.push(result);
    } catch (e) {
      log.error(`任务执行失败: ${e.message}`);
    }
  }

  return allResults.flat();
};

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
const createQueue = (concurrency, fn) => {
  const queue = [];
  const runningQueue = [];
  // 撤销排队中的某一个任务

  const removeQueue = (task) => {
    const index = queue.findIndex((item) => item === task);
    if (index !== -1) {
      console.log("取消排队");
      queue.splice(index, 1);
    }
  };
  const process = (dataItem, getRemoveQueueSource) => {
    return new Promise((resolve, reject) => {
      const run = async () => {
        if (runningQueue.length >= concurrency) {
          queue.push(run);
          getRemoveQueueSource && getRemoveQueueSource(() => removeQueue(run));
          return;
        }
        runningQueue.push(run);
        try {
          const result = await fn(dataItem);
          resolve(result);
        } catch (e) {
          reject(e);
        } finally {
          runningQueue.splice(runningQueue.indexOf(run), 1);
          if (queue.length) {
            queue.shift()();
          }
        }
      };
      run();
    });
  };
  return process;
};
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
const createQueueByTime = (interval, maxTasksPerInterval, task) => {
  let queue = [];
  let activeTasks = 0;
  let lastExecutionTime = Date.now();

  const removeTask = (task) => {
    const index = queue.findIndex((item) => item === task);
    if (index !== -1) {
      queue.splice(index, 1);
      console.log("removeTask", task);
    }
  };
  const processQueue = async () => {
    const now = Date.now();
    let timeSinceLastExecution = now - lastExecutionTime;
    if (timeSinceLastExecution >= interval) {
      activeTasks = 0;
      lastExecutionTime = now;
    }
    while (activeTasks < maxTasksPerInterval && queue.length > 0) {
      const { args, resolve, reject } = queue.shift();
      activeTasks++;
      try {
        const data = await task(args);
        resolve(data);
      } catch (e) {
        reject(e);
      }
    }
    timeSinceLastExecution = Date.now() - lastExecutionTime;
    if (queue.length > 0) {
      setTimeout(processQueue, interval - timeSinceLastExecution);
    } else {
      // 刷新activeTasks
      setTimeout(() => {
        activeTasks = 0;
        if (queue.length > 0) processQueue();
      }, interval - timeSinceLastExecution);
    }
  };

  return function (args, removeTaskSource) {
    return new Promise((resolve, reject) => {
      const task = { args, resolve, reject };
      queue.push(task);
      if (activeTasks < maxTasksPerInterval) {
        processQueue();
      } else {
        // 绑定removeTask
        removeTaskSource &&
          removeTaskSource(() => {
            removeTask(task);
          });
      }
    });
  };
};
const useGlobalTimeInterval = () => {
  const originalSetTimeout = global.setTimeout;
  const originalClearTimeout = global.clearTimeout;
  const originalSetInterval = global.setInterval;
  const originalClearInterval = global.clearInterval;

  let timeoutIds = new Set(); // 存储 setTimeout ID
  let intervalIds = new Set(); // 存储 setInterval ID

  // 代理 setTimeout
  global.setTimeout = function (callback, delay, ...args) {
    const id = originalSetTimeout(callback, delay, ...args);
    timeoutIds.add(id);
    return id;
  };
  // 代理 clearTimeout
  global.clearTimeout = function (id) {
    timeoutIds.delete(id);
    return originalClearTimeout(id);
  };
  // 代理 setInterval
  global.setInterval = function (callback, delay, ...args) {
    const id = originalSetInterval(callback, delay, ...args);
    intervalIds.add(id);
    return id;
  };
  // 代理 clearInterval
  global.clearInterval = function (id) {
    intervalIds.delete(id);
    return originalClearInterval(id);
  };
  // 统一清除所有定时器和间隔
  global.clearAllTimers = function () {
    timeoutIds.forEach((id) => originalClearTimeout(id));
    intervalIds.forEach((id) => originalClearInterval(id));
    timeoutIds.clear();
    intervalIds.clear();
  };
  return global.clearAllTimers;
};
useGlobalTimeInterval();

const useMainThread = (url, main = () => {}, run = () => {}) => {
  const __filename = fileURLToPath(url);
  const isEntry =
    __filename === process.argv[1] ||
    (process.env.pm_exec_path &&
      path.resolve(process.env.pm_exec_path) === __filename);
  if (isEntry) {
    if (isMainThread) {
      main();
    } else {
      run();
    }
  }
};
export {
  askQuestion,
  createProxyAgent,
  sleep,
  log,
  fnCanRetry,
  checkProxy,
  loadProxies,
  loadUser,
  randomWait,
  createProcess,
  createQueue,
  createQueueByTime,
  checkProxys,
  useGlobalTimeInterval,
  useMainThread,
};
