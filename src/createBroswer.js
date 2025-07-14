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

export { createBroswer };
