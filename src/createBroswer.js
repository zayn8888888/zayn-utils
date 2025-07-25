import { spawn, execSync } from "child_process";
import path, { resolve } from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import os from "os";
import { sleep, createProxyAgent } from "./utils.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import readline from "readline";

// 获取包的根目录
function getPackageRoot() {
  try {
    // 尝试解析包的package.json位置
    const packageJsonPath = require.resolve("zayn-utils/package.json");
    return path.dirname(packageJsonPath);
  } catch (error) {
    // 如果失败，使用相对路径（开发环境）
    return path.resolve(__dirname, "..");
  }
}

// 动态导入函数
const importBrowserDeps = async () => {
  try {
    const [puppeteer, { executablePath }, StealthPlugin] = await Promise.all([
      import("puppeteer-extra"),
      import("puppeteer"),
      import("puppeteer-extra-plugin-stealth"),
    ]);
    return {
      puppeteer: puppeteer.default,
      executablePath,
      StealthPlugin: StealthPlugin.default,
    };
  } catch (error) {
    throw new Error(
      `缺少浏览器自动化依赖，请安装: npm install puppeteer puppeteer-extra puppeteer-extra-plugin-stealth\n原始错误: ${error.message}`
    );
  }
};
// 动态导入函数
const importRealBrowserDeps = async () => {
  try {
    const [ws, puppeteer, StealthPlugin] = await Promise.all([
      import("windows-shortcuts"),
      import("puppeteer-extra"),
      import("puppeteer-extra-plugin-stealth"),
    ]);
    return {
      ws: ws.default,
      puppeteer: puppeteer.default,
      StealthPlugin: StealthPlugin.default,
    };
  } catch (error) {
    throw new Error(
      `缺少浏览器自动化依赖，请安装: npm install puppeteer-extra puppeteer-extra-plugin-stealth windows-shortcuts \n原始错误: ${error.message}`
    );
  }
};

const useRl = (browser) => {
  let rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  browser.on("disconnected", () => {
    // 删除 userDataDir及.lnk
    setTimeout(() => {
      rl && rl.close();
    }, 2000);
  });
  rl.on("line", async (input) => {
    const text = input.trim().toLowerCase();
    const [pwd, args] = text.split(" ");
    switch (pwd) {
      case "exit":
        {
          try {
            browser.close();
            rl.close();
            // const client = await browser.target().createCDPSession();
            // await client.send("Browser.close");
          } catch (e) {
            console.log(e);
          }
        }
        break;
      case "script":
        {
          // 加载script.js的代码执行
          const script = fs.readFileSync("./script.js", "utf-8");
          eval(script);
        }
        break;
    }
  });
  return rl;
};

const initData = async (chromePath, proxy, ws, hidden = false) => {
  const index = Math.floor(Math.random() * 1000);
  let proxyObj;
  if (proxy) {
    proxyObj = await createProxyAgent(proxy);
  }
  const tempDir = os.tmpdir();
  console.log(tempDir);
  const userDataDir = path.join(tempDir, `./autoC/${index}`);
  if (!fs.existsSync(userDataDir)) {
    fs.mkdirSync(userDataDir, { recursive: true });
  }
  const shortcutPath = path.join(tempDir, `./autoC/${index}.lnk`);
  let dcpPort = 30000 + index;
  // 移除headless相关参数，保持正常启动
  let chromeArgs = `--no-first-run --no-default-browser-check --user-data-dir="${userDataDir}" --remote-debugging-port=${dcpPort}`;
  if (proxyObj) {
    chromeArgs += ` --proxy-server="${proxyObj.host}:${proxyObj.port}"`;
  }
  // 添加一些反检测参数，但不使用headless
  chromeArgs += ` --ignore-certificate-errors --disable-web-security`;
  chromeArgs += ` --disable-blink-features=AutomationControlled`;

  if (!fs.existsSync(shortcutPath)) {
    await new Promise((resolve) => {
      ws.create(
        shortcutPath,
        {
          target: chromePath,
          args: chromeArgs,
          workingDir: userDataDir,
          desc: `Chrome for data ${index}`,
        },
        function (e) {
          if (JSON.stringify(e).includes("error")) {
            throw new Error(`创建快捷方式失败: ${e}`);
          }
          console.log(e);
          console.log(`已创建快捷方式: ${shortcutPath}`);
          resolve();
        }
      );
    });
  }
  return { userDataDir, proxy: proxyObj, index, dcpPort, shortcutPath };
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
const createBroswer = async ({
  proxy,
  real = false,
  chromePath = `C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe`,
  headless = true,
  captchaPlugins = [],
  needRl = false,
}) => {
  const parsedProxy = proxy ? new URL(proxy) : null;
  if (!real) {
    const { puppeteer, executablePath, StealthPlugin } =
      await importBrowserDeps();

    puppeteer.use(StealthPlugin());
    let pathToExtensions = [];
    const packageRoot = getPackageRoot();
    captchaPlugins.forEach((plugin) => {
      const { key, name, path: pathToExtension } = plugin;
      if (pathToExtension) {
        pathToExtensions.push(pathToExtension);
      } else if (name === "2captcha") {
        const pluginPath = path.join(
          packageRoot,
          "src/plugins/2captcha-solver"
        );
        pathToExtensions.push(pluginPath);
        const configPath = path.join(pluginPath, "/common/config.js");
        let configContent = fs.readFileSync(configPath, "utf8");
        // 替换apiKey
        configContent = configContent.replace(
          /apiKey:\s*"[^"]*"/,
          `apiKey: "${key}"`
        );
        fs.writeFileSync(configPath, configContent);
      } else if (name === "yesCaptcha") {
        const pluginPath = path.join(
          packageRoot,
          "src/plugins/yesCaptcha-solver"
        );
        pathToExtensions.push(pluginPath);
        const configPath = path.join(pluginPath, "config.js");
        let configContent = fs.readFileSync(configPath, "utf8");
        // 替换clientKey
        configContent = configContent.replace(
          /clientKey:\s*"[^"]*"/,
          `clientKey: "${key}"`
        );
        fs.writeFileSync(configPath, configContent);
      }
    });
    const extensionPaths = pathToExtensions.join(",");
    const browser = await puppeteer.launch({
      headless: headless,
      args: [
        !parsedProxy
          ? ""
          : `--proxy-server=${parsedProxy.hostname}:${parsedProxy.port}`,
        "--no-sandbox",
        "--disable-setuid-sandbox",
        // 优化内存使用的新参数
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--disable-web-security",
        "--disable-features=VizDisplayCompositor",
        "--memory-pressure-off",
        "--max_old_space_size=512", // 限制V8内存
        "--disable-background-timer-throttling",
        "--disable-backgrounding-occluded-windows",
        "--disable-renderer-backgrounding",
        "--ignore-certificate-errors",
        "--ignore-ssl-errors",
        "--ignore-certificate-errors-spki-list",
        "--ignore-certificate-errors-skip-list",
        `--disable-extensions-except=${extensionPaths}`,
        `--load-extension=${extensionPaths}`,
        "--window-size=1200,800", // 减小窗口尺寸
      ],
      // executablePath:
      //   "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
      executablePath: executablePath(),
      defaultViewport: {
        width: 1500, // 设置视口宽度
        height: 1000, // 可选高度设置
        deviceScaleFactor: 1,
      },
    });

    const page = await browser.newPage();
    // 代理认证
    if (parsedProxy) {
      await page.authenticate({
        username: parsedProxy.username,
        password: parsedProxy.password,
      });
    }
    if (!headless && needRl) useRl(browser);
    return { browser, page, parsedProxy };
  }
  const { puppeteer, ws, StealthPlugin } = await importRealBrowserDeps();

  puppeteer.use(StealthPlugin());
  const { userDataDir, dcpPort, shortcutPath } = await initData(
    chromePath,
    proxy,
    ws,
    headless
  );
  const { username = null, password = null } = parsedProxy;
  console.log(`启动浏览器窗口`);
  // 先通过 .lnk 启动 Chrome
  spawn("cmd", ["/c", "start", headless ? "/min" : "", shortcutPath], {
    detached: true,
    stdio: "ignore",
  });
  await sleep(2000);

  // 通过CDP方式连接
  // 增加重试机制和端口检测
  let browser;
  let retries = 5;
  const cdpUrl = `http://127.0.0.1:${dcpPort}`;
  while (retries-- > 0) {
    try {
      // 先检测端口是否开放
      execSync(`netstat -an | find "${dcpPort}" | find "LISTENING"`);
      browser = await puppeteer.connect({
        browserURL: cdpUrl,
        defaultViewport: null,
      });
      console.log(`Connected to browser via CDP at ${cdpUrl}`);
      break;
    } catch (e) {
      if (retries === 0) throw e;
      await sleep(2000 + (5 - retries) * 1000); // 渐进等待：2s, 3s, 4s...
      console.log(`重试连接端口 ${dcpPort} (剩余尝试次数: ${retries})`);
    }
  }

  let context = browser.browserContexts()[0];
  let page = await context.newPage();
  if (username && password) {
    await page.authenticate({
      username,
      password,
    });
  }

  await page.goto("https://icanhazip.com");
  if (needRl) useRl(browser);
  // 监听关闭事件
  browser.on("disconnected", () => {
    console.log("浏览器已关闭");
    // 删除 userDataDir及.lnk
    setTimeout(() => {
      fs.rmSync(userDataDir, { recursive: true, force: true });
      fs.rmSync(shortcutPath, { force: true });
    }, 2000);
  });

  return { browser, page, parsedProxy };
};

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
  waitForKeyRequestsOps = {};
  constructor() {
    this.waitForKeyRequestsOps = {
      timeout: 20000,
      patterns: [
        /\/api\//,
        /\/graphql/,
        /\/submit/,
        /\/action/,
        /\/v1\//, // 添加更多API模式
        /\/v2\//,
      ],
      excludePatterns: [
        /analytics/,
        /tracking/,
        /beacon/,
        /metrics/,
        /\/static\//, // 排除静态资源
        /\.js$/, // 排除JS文件
        /\.css$/, // 排除CSS文件
        /\.png$/, // 排除图片
        /\.jpg$/,
        /\.gif$/,
      ],
      fallbackDelay: 800,
      maxWaitForFirstRequest: 2000, // 等待第一个请求的最大时间
    };
  }
  /** 日志
   * @param {*} data 日志数据
   * @param {'log'|'warn'|'error'} type 日志类型
   */
  async log(data, type = "log") {
    // 检查type
    if (!["log", "warn", "error"].includes(type)) {
      console.error("log类型错误，已自动转换为log", type);
      type = "log";
    }
    let date = new Date().toLocaleString();
    console[type](`[${date}]-`, data);
  }
  /** 智能滚动
   * @param {*} targetElement 目标元素
   */
  async smartScroll(targetElement) {
    // 检测元素所在的滚动容器
    const scrollInfo = await targetElement.evaluate((el) => {
      let scrollParent = el.parentElement;

      // 向上查找可滚动的父元素
      while (scrollParent && scrollParent !== document.body) {
        const style = window.getComputedStyle(scrollParent);
        const hasScroll =
          style.overflow === "auto" ||
          style.overflow === "scroll" ||
          style.overflowY === "auto" ||
          style.overflowY === "scroll" ||
          style.overflowX === "auto" ||
          style.overflowX === "scroll";

        if (hasScroll) {
          const rect = scrollParent.getBoundingClientRect();

          // 使用元素的唯一标识而不是CSS选择器
          scrollParent.setAttribute("data-scroll-container", Date.now());
          const containerId = scrollParent.getAttribute(
            "data-scroll-container"
          );

          return {
            selector: `[data-scroll-container="${containerId}"]`,
            isHorizontal:
              style.overflowX === "auto" || style.overflowX === "scroll",
            isVertical:
              style.overflowY === "auto" || style.overflowY === "scroll",
            rect: {
              x: rect.x,
              y: rect.y,
              width: rect.width,
              height: rect.height,
            },
          };
        }
        scrollParent = scrollParent.parentElement;
      }

      // 如果没有找到可滚动的父元素，返回全局滚动信息
      return {
        selector: "html",
        isHorizontal: false,
        isVertical: true,
        rect: {
          x: 0,
          y: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        },
      };
    });

    return scrollInfo;
  }
  /** 随机睡眠
   * @param {*} min 最小值
   * @param {*} max 最大值
   */
  async randomSleep(min, max) {
    const sleepTime = Math.floor(Math.random() * (max - min + 1)) + min;
    await new Promise((resolve) => setTimeout(resolve, sleepTime));
    return sleepTime;
  }
  /** 智能滚动
   * @param {*} page 页面对象
   * @param {*} scrollInfo 滚动信息
   * @param {*} targetElement 目标元素
   */
  async humanLikeScroll(page, scrollInfo, targetElement) {
    const targetRect = await targetElement.boundingBox();

    if (!targetRect) {
      this.log("目标元素无法获取边界框，可能不可见或不在DOM中", "warn");
      return;
    }

    // 添加鼠标移动到目标区域附近
    const mouseX =
      targetRect.x + targetRect.width * (0.3 + Math.random() * 0.4);
    const mouseY =
      targetRect.y + targetRect.height * (0.3 + Math.random() * 0.4);

    // 模拟人类鼠标移动轨迹
    await page.mouse.move(mouseX, mouseY, {
      steps: 3 + Math.floor(Math.random() * 6),
    });
    await this.randomSleep(200, 500);

    if (scrollInfo.selector === "html") {
      // 全局页面滚动 - 使用鼠标滚轮
      const scrollData = await page.evaluate((targetY) => {
        return {
          currentY: window.pageYOffset,
          innerHeight: window.innerHeight,
          targetY: targetY,
        };
      }, targetRect.y);

      const targetY = scrollData.targetY - scrollData.innerHeight / 2;
      const scrollDistance = targetY - scrollData.currentY;

      // 更自然的分段滚动
      const baseSteps = Math.ceil(Math.abs(scrollDistance) / 120);
      const scrollSteps = baseSteps + Math.floor(Math.random() * 3) - 1; // 添加随机性

      for (let i = 0; i < scrollSteps; i++) {
        // 添加轻微的不精确性
        const stepSize =
          (scrollDistance / scrollSteps) * (0.9 + Math.random() * 0.2);
        await page.mouse.wheel({ deltaY: stepSize });

        // 更自然的延迟模式
        const baseDelay = 100 + Math.random() * 150;
        const extraDelay = Math.random() > 0.7 ? Math.random() * 300 : 0;
        await this.randomSleep(baseDelay, baseDelay + extraDelay);

        // 随机暂停，模拟阅读或犹豫
        if (Math.random() > 0.85) {
          await this.randomSleep(400, 1200);
        }

        // 偶尔反向微调（模拟滚动过头后的调整）
        if (Math.random() > 0.9 && i > 0) {
          await page.mouse.wheel({ deltaY: -stepSize * 0.1 });
          await this.randomSleep(100, 300);
        }
      }
    } else {
      // 局部容器滚动 - 先移动鼠标到容器内
      const scrollContainer = await page.$(scrollInfo.selector);
      const containerRect = await scrollContainer.boundingBox();

      // 鼠标移动到容器中心附近
      const containerMouseX =
        containerRect.x + containerRect.width * (0.4 + Math.random() * 0.2);
      const containerMouseY =
        containerRect.y + containerRect.height * (0.4 + Math.random() * 0.2);
      await page.mouse.move(containerMouseX, containerMouseY, {
        steps: 3 + Math.floor(Math.random() * 5),
      });
      await this.randomSleep(150, 400);

      if (scrollInfo.isVertical) {
        // 垂直滚动 - 改进版本
        await scrollContainer.evaluate((container, targetY) => {
          const containerRect = container.getBoundingClientRect();
          const scrollTop =
            targetY - containerRect.top - containerRect.height / 2;

          const startScroll = container.scrollTop;
          const distance = scrollTop - startScroll;

          // 添加更多随机性
          const baseSteps = Math.ceil(Math.abs(distance) / 40);
          const steps = Math.max(
            3,
            baseSteps + Math.floor(Math.random() * 5) - 2
          );

          let currentStep = 0;
          const smoothScroll = () => {
            if (currentStep < steps) {
              // 添加轻微的不精确性和变速
              const progress = currentStep / steps;
              const easing = 0.5 - 0.5 * Math.cos(progress * Math.PI); // 缓动函数
              const noise = (Math.random() - 0.5) * 0.05; // 噪声

              container.scrollTop = startScroll + distance * (easing + noise);
              currentStep++;

              // 更自然的时间间隔
              const baseInterval = 60 + Math.random() * 80;
              const extraInterval =
                Math.random() > 0.8 ? Math.random() * 200 : 0;
              setTimeout(smoothScroll, baseInterval + extraInterval);
            }
          };
          smoothScroll();
        }, targetRect.y);
      }

      if (scrollInfo.isHorizontal) {
        // 水平滚动 - 类似的改进
        await scrollContainer.evaluate((container, targetX) => {
          const containerRect = container.getBoundingClientRect();
          const scrollLeft =
            targetX - containerRect.left - containerRect.width / 2;

          const startScroll = container.scrollLeft;
          const distance = scrollLeft - startScroll;

          const baseSteps = Math.ceil(Math.abs(distance) / 40);
          const steps = Math.max(
            3,
            baseSteps + Math.floor(Math.random() * 5) - 2
          );

          let currentStep = 0;
          const smoothScroll = () => {
            if (currentStep < steps) {
              const progress = currentStep / steps;
              const easing = 0.5 - 0.5 * Math.cos(progress * Math.PI);
              const noise = (Math.random() - 0.5) * 0.05;

              container.scrollLeft = startScroll + distance * (easing + noise);
              currentStep++;

              const baseInterval = 60 + Math.random() * 80;
              const extraInterval =
                Math.random() > 0.8 ? Math.random() * 200 : 0;
              setTimeout(smoothScroll, baseInterval + extraInterval);
            }
          };
          smoothScroll();
        }, targetRect.x);
      }
    }

    // 滚动完成后的更自然行为
    await this.randomSleep(1000, 2000);

    // 增加微调概率和多样性
    if (Math.random() > 0.6) {
      const microAdjust = (Math.random() - 0.5) * 150;
      if (scrollInfo.selector === "html") {
        await page.mouse.wheel({ deltaY: microAdjust });
      }
      await this.randomSleep(200, 600);

      // 偶尔再次微调
      if (Math.random() > 0.8) {
        await page.mouse.wheel({ deltaY: -microAdjust * 0.3 });
        await this.randomSleep(100, 300);
      }
    }

    // 偶尔移动鼠标到其他位置（模拟用户查看其他内容）
    if (Math.random() > 0.7) {
      const randomX = Math.random() * 200 + targetRect.x;
      const randomY = Math.random() * 100 + targetRect.y;
      await page.mouse.move(randomX, randomY, {
        steps: 2 + Math.floor(Math.random() * 4),
      });
      await this.randomSleep(200, 500);
    }
  }
  /** 智能鼠标移动
   * @param {*} page 页面对象
   * @param {*} endX 目标X坐标
   * @param {*} endY 目标Y坐标
   */
  async humanLikeMouseMove(page, endX, endY) {
    // 获取当前鼠标位置
    const currentPosition = await page.evaluate(() => {
      return {
        // @ts-ignore
        x: window.lastMouseX || window.innerWidth / 2,
        // @ts-ignore
        y: window.lastMouseY || window.innerHeight / 2,
      };
    });

    const startX = currentPosition.x;
    const startY = currentPosition.y;

    // 如果起始位置和结束位置太近，直接移动
    const distance = Math.sqrt(
      Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2)
    );
    if (distance < 10) {
      await page.mouse.move(endX, endY);
      // 更新鼠标位置记录
      await page.evaluate(
        (x, y) => {
          // @ts-ignore
          window.lastMouseX = x;
          // @ts-ignore
          window.lastMouseY = y;
        },
        endX,
        endY
      );
      return;
    }

    // 生成2-5个中间点，模拟自然曲线
    const pointCount = Math.floor(Math.random() * 4) + 2;
    const points = [];

    for (let i = 0; i < pointCount; i++) {
      // 生成曲线上的随机点
      const ratio = (i + 1) / (pointCount + 1);
      // 根据距离调整偏移量，距离越远偏移越大
      const maxOffset = Math.min(distance * 0.1, 20);
      const xDelta = Math.random() * maxOffset * 2 - maxOffset;
      const yDelta = Math.random() * maxOffset * 2 - maxOffset;

      points.push({
        x: Math.floor(startX + (endX - startX) * ratio + xDelta),
        y: Math.floor(startY + (endY - startY) * ratio + yDelta),
      });
    }

    // 沿着生成的点移动
    for (const point of points) {
      await page.mouse.move(point.x, point.y);
      await this.randomSleep(20, 80);
    }

    // 移动到终点
    await page.mouse.move(endX, endY);
    await this.randomSleep(50, 150);

    // 更新鼠标位置记录
    await page.evaluate(
      (x, y) => {
        // @ts-ignore
        window.lastMouseX = x;
        // @ts-ignore
        window.lastMouseY = y;
      },
      endX,
      endY
    );
    await this.randomSleep(800, 1500);
  }
  /** 初始化鼠标位置跟踪
   * @param {*} page 页面对象
   */
  async initMouseTracking(page) {
    await page.evaluateOnNewDocument(() => {
      // 跟踪鼠标位置

      document.addEventListener("mousemove", (e) => {
        // @ts-ignore
        window.lastMouseX = e.clientX;
        // @ts-ignore
        window.lastMouseY = e.clientY;
      });

      // 初始化鼠标位置为页面中心
      // @ts-ignore
      window.lastMouseX = window.innerWidth / 2;
      // @ts-ignore
      window.lastMouseY = window.innerHeight / 2;
    });
  }
  /** 随机页面交互
   * @param {*} page 页面对象
   */
  async randomPageInteraction(page) {
    // 随机决定是否执行额外操作
    if (Math.random() > 0.7) {
      const actions = [
        // 随机滚动
        async () => {
          const scrollY = Math.floor(Math.random() * 100) - 50;
          await page.mouse.wheel({ deltaY: scrollY });
          await this.randomSleep(300, 800);
        },
        // 随机移动鼠标到页面某处
        async () => {
          let viewportSize = await page.viewport();
          if (!viewportSize) {
            // 获取document
            viewportSize = await page.evaluate(() => {
              return {
                width: document.documentElement.clientWidth,
                height: document.documentElement.clientHeight,
              };
            });
          }

          const x =
            Math.floor(Math.random() * viewportSize.width * 0.8) +
            viewportSize.width * 0.1;
          const y =
            Math.floor(Math.random() * viewportSize.height * 0.8) +
            viewportSize.height * 0.1;
          await this.humanLikeMouseMove(page, x, y);
        },
        // 随机聚焦到不相关元素
        async () => {
          const selectors = [".bn-header", ".bn-footer", ".bn-layout__main"];
          const randomSelector =
            selectors[Math.floor(Math.random() * selectors.length)];
          try {
            const element = await page.$(randomSelector);
            if (element) {
              await element.hover();
              await this.randomSleep(200, 500);
            }
          } catch (e) {}
        },
      ];

      // 随机选择1-2个操作执行
      const actionCount = Math.floor(Math.random() * 2) + 1;
      for (let i = 0; i < actionCount; i++) {
        const randomAction =
          actions[Math.floor(Math.random() * actions.length)];
        await randomAction();
      }
    }
  }
  /** 模拟人类输入
   * @param {*} page 页面对象
   * @param {*} selector 选择器
   * @param {*} text 文本
   */
  async humanType(page, selector, text) {
    try {
      await page.waitForSelector(selector);
    } catch (error) {}
    const el = await page.$(selector);
    await el.focus();
    await this.randomSleep(100, 300);
    await el.evaluate((el) => {
      el.select(); // 选中当前内容
    });
    await this.randomSleep(100, 300);

    // 模拟人类输入速度
    for (const char of text) {
      await page.keyboard.type(char, {
        delay: Math.floor(Math.random() * 100) + 50,
      });
      await this.randomSleep(10, 50);
    }
    await this.randomSleep(500, 1000);
  }
  /** 模拟人类拖动
   * @param {*} page 页面对象
   * @param {*} selector 选择器
   */
  async huamanSlide(page, selector) {
    try {
      await page.waitForSelector(selector);
    } catch (error) {}
    const slide = await page.$(selector);
    const slideBox = await slide.boundingBox();
    if (!slideBox) {
      throw `无法找到滑块: ${selector}`;
    }
    // 从滑块左边拖拽到右边，添加自然曲线和停顿
    const startX = slideBox.x + 10;
    const startY = slideBox.y + slideBox.height / 2;
    const endX = slideBox.x + slideBox.width - 5;
    const endY = startY + (Math.random() * 6 - 3); // 轻微上下偏移

    // 使用人类鼠标移动轨迹
    await this.humanLikeMouseMove(page, startX, startY);

    await this.randomSleep(100, 300);
    await page.mouse.down();

    // 生成3-5个中间点，模拟拖拽过程中的自然曲线
    const points = [];
    const pointCount = Math.floor(Math.random() * 3) + 3;

    for (let i = 0; i < pointCount; i++) {
      const ratio = (i + 1) / (pointCount + 1);
      // 在拖拽过程中可能有轻微的上下波动
      const yDelta = Math.random() * 6 - 3;
      // 拖拽速度可能不均匀，有时快有时慢
      const xProgress = Math.pow(ratio, 0.8 + Math.random() * 0.4);

      points.push({
        x: Math.floor(startX + (endX - startX) * xProgress),
        y: Math.floor(startY + yDelta),
      });
    }

    // 沿着生成的点移动
    for (const point of points) {
      await page.mouse.move(point.x, point.y);
      await this.randomSleep(30, 100);
    }

    // 移动到终点并释放
    await page.mouse.move(endX, endY);
    await this.randomSleep(50, 150);
    await page.mouse.up();
    this.log(`滑块拖动完成 ${selector}`);
    await this.randomSleep(600, 1000);
  }
  /** 检查元素是否可见
   * @param {*} element 元素对象
   */
  async isVisible(element) {
    return await element.evaluate((el) => {
      const rect = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);

      // 检查元素是否在视口内
      const inViewport =
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= window.innerHeight &&
        rect.right <= window.innerWidth;

      // 检查元素是否被遮挡
      const elementAtPoint = document.elementFromPoint(
        rect.left + rect.width / 2,
        rect.top + rect.height / 2
      );
      const notCovered = el.contains(elementAtPoint) || elementAtPoint === el;

      return (
        inViewport &&
        style.visibility !== "hidden" &&
        style.display !== "none" &&
        style.opacity !== "0" &&
        notCovered
      );
    });
  }
  /** 模拟人类点击
   * @param {*} page 页面对象
   * @param {*} selector 选择器
   * @param {Object} options 选项
   * @param {number} options.timeout 超时时间
   * @param {boolean} options.waitForNetwork 是否等待网络请求
   * @param {number} options.maxWaitForFirstRequest 网络等待超时
   * @param {number} options.fallbackDelay 无网络请求时的后备延迟
   */
  async humanClick(
    page,
    selector,
    options = {
      timeout: this.waitForKeyRequestsOps.timeout,
      waitForNetwork: true, // 是否等待网络请求
      maxWaitForFirstRequest: this.waitForKeyRequestsOps.maxWaitForFirstRequest, // 网络等待超时
      fallbackDelay: this.waitForKeyRequestsOps.fallbackDelay, // 无网络请求时的后备延迟
    }
  ) {
    const {
      timeout = this.waitForKeyRequestsOps.timeout,
      waitForNetwork = true, // 是否等待网络请求
      maxWaitForFirstRequest = this.waitForKeyRequestsOps
        .maxWaitForFirstRequest, // 网络等待超时
      fallbackDelay = this.waitForKeyRequestsOps.fallbackDelay, // 无网络请求时的后备延迟
    } = options;
    let btn;
    if (typeof selector === "string") {
      try {
        await page.waitForSelector(selector);
      } catch (error) {}
      btn = await page.$(selector);
    } else {
      // 如果传入的是DOM元素，直接使用
      btn = selector;
    }

    // 检查btn是否存在
    if (!btn) {
      this.log(
        `无法找到元素: ${typeof selector === "string" ? selector : "DOM元素"}`,
        "error"
      );
      throw `无法找到元素: ${
        typeof selector === "string" ? selector : "DOM元素"
      }`;
    }

    // 检查元素是否可见和可点击
    const isVisible = await this.isVisible(btn);

    if (!isVisible) {
      this.log("元素不可见或被遮挡，开始智能处理");

      // 缩放无效，尝试滚动
      const scrollInfo = await this.smartScroll(btn);
      if (scrollInfo && scrollInfo.selector) {
        await this.humanLikeScroll(page, scrollInfo, btn);
      } else {
        this.log("无法获取滚动信息，跳过滚动操作", "warn");
      }

      // 最终验证
      const finalCheck = await this.isVisible(btn);

      if (!finalCheck) {
        this.log("所有调整方法都无效，使用降级点击策略");
        // **关键改动：在点击前设置网络监听**
        let networkPromise = null;
        if (waitForNetwork) {
          // 设置网络监听
          networkPromise = this.waitForKeyRequestsWithFallback(page, {
            timeout: timeout,
            maxWaitForFirstRequest: maxWaitForFirstRequest,
            fallbackDelay: fallbackDelay,
            patterns: this.waitForKeyRequestsOps.patterns,
            excludePatterns: this.waitForKeyRequestsOps.excludePatterns,
          });
        }
        await btn.click({
          delay: Math.floor(Math.random() * 100) + 50,
        });
        if (waitForNetwork && networkPromise) {
          try {
            await networkPromise;
          } catch (error) {
            this.log("网络等待异常，继续执行", "warn");
          }
        } else {
          // 不等待网络请求时的固定延迟
          await this.randomSleep(fallbackDelay * 0.8, fallbackDelay * 1.2);
        }
        return;
        // 可以考虑使用 element.click() 作为最后手段
      } else {
        this.log("元素可见");
      }
    }
    // **关键改动：在点击前设置网络监听**
    let networkPromise = null;

    // // 获取按钮位置并模拟真实点击
    const btnBox = await btn.boundingBox();

    if (btnBox) {
      await this.humanLikeMouseMove(
        page,
        btnBox.x + btnBox.width / 2 + (Math.random() * 10 - 5),
        btnBox.y + btnBox.height / 2 + (Math.random() * 6 - 3)
      );
      if (waitForNetwork) {
        // 设置网络监听
        networkPromise = this.waitForKeyRequestsWithFallback(page, {
          timeout: timeout,
          maxWaitForFirstRequest: maxWaitForFirstRequest,
          fallbackDelay: fallbackDelay,
          patterns: this.waitForKeyRequestsOps.patterns,
          excludePatterns: this.waitForKeyRequestsOps.excludePatterns,
        });
      }
      await this.randomSleep(80, 200);
      await page.mouse.down();
      await this.randomSleep(50, 150);
      await page.mouse.up();
      this.log(
        `已点击${typeof selector === "string" ? selector : "自定义选择器"}`
      );
    } else {
      if (waitForNetwork) {
        // 设置网络监听
        networkPromise = this.waitForKeyRequestsWithFallback(page, {
          timeout: timeout,
          maxWaitForFirstRequest: maxWaitForFirstRequest,
          fallbackDelay: fallbackDelay,
          patterns: this.waitForKeyRequestsOps.patterns,
          excludePatterns: this.waitForKeyRequestsOps.excludePatterns,
        });
      }
      await btn.click({ delay: Math.floor(Math.random() * 100) + 50 });
    }
    await this.randomSleep(500, 1200);
    // 等待网络请求或使用后备延迟
    if (waitForNetwork && networkPromise) {
      try {
        await networkPromise;
      } catch (error) {
        this.log("网络等待异常，继续执行", "warn");
      }
    } else {
      // 不等待网络请求时的固定延迟
      await this.randomSleep(fallbackDelay * 0.8, fallbackDelay * 1.2);
    }
    await this.randomSleep(500, 1200);
  }

  async waitForKeyRequestsWithFallback(page, options = {}) {
    const {
      timeout = 20000,
      patterns = [],
      excludePatterns = [],
      fallbackDelay = 800,
      maxWaitForFirstRequest = 2000, // 等待第一个请求的最大时间
    } = options;

    return new Promise((resolve, reject) => {
      let pendingRequests = new Set();
      let hasAnyRequest = false;
      let timeoutId;

      // 总超时
      const totalTimeout = setTimeout(() => {
        cleanup();
        this.log("网络等待总超时，继续执行");
        reject("网络等待总超时，继续执行");
      }, timeout);

      // 如果在指定时间内没有任何关键请求，使用后备延迟
      const fallbackTimeout = setTimeout(() => {
        if (!hasAnyRequest) {
          cleanup();
          setTimeout(resolve, fallbackDelay);
          return;
        }
      }, maxWaitForFirstRequest);

      const onRequest = (request) => {
        const url = request.url();
        const isKeyRequest = patterns.some((pattern) => pattern.test(url));
        const isExcluded = excludePatterns.some((pattern) => pattern.test(url));

        if (isKeyRequest && !isExcluded) {
          hasAnyRequest = true;
          pendingRequests.add(request);
          console.log("发现关键请求:", url);
          // 清除后备超时，因为已经有关键请求了
          clearTimeout(fallbackTimeout);
        }
      };

      const onResponse = (response) => {
        const request = response.request();
        if (pendingRequests.has(request)) {
          console.log("关键请求完成:", request.url());
          pendingRequests.delete(request);
          checkIfCanResolve();
        }
      };

      const onRequestFailed = (request) => {
        if (pendingRequests.has(request)) {
          pendingRequests.delete(request);
          checkIfCanResolve();
        }
      };

      const checkIfCanResolve = () => {
        if (pendingRequests.size === 0 && hasAnyRequest) {
          clearTimeout(timeoutId);
          timeoutId = setTimeout(() => {
            cleanup();
            resolve();
          }, 300);
        }
      };

      const cleanup = () => {
        clearTimeout(totalTimeout);
        clearTimeout(fallbackTimeout);
        clearTimeout(timeoutId);
        page.off("request", onRequest);
        page.off("response", onResponse);
        page.off("requestfailed", onRequestFailed);
      };

      // 注册监听器
      page.on("request", onRequest);
      page.on("response", onResponse);
      page.on("requestfailed", onRequestFailed);
    });
  }
}

export { createBroswer };
