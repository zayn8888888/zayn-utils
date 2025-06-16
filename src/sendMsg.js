import axios from "axios";
// @ts-ignore
import { Worker, isMainThread, workerData, parentPort } from "worker_threads";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
import { useMainThread, fnCanRetry } from "./utils.js";
import { marked } from "marked"; // 新增：引入

const importDeps = async () => {
  try {
    const [sdk, { logger }] = await Promise.all([
      import("matrix-js-sdk"),
      import("matrix-js-sdk/lib/logger.js"),
    ]);
    // @ts-ignore
    logger.setLevel("error");
    return {
      sdk: sdk.default,
    };
  } catch (error) {
    throw new Error(
      `加密信息时，缺少依赖，请安装:  npm install matrix-js-sdk   同时需注意仅支持esm环境   \n原始错误: ${error.message}`
    );
  }
};

async function sendHTMLAsRichText(msg, sendMsgConfig) {
  const { sdk } = await importDeps();
  try {
    const { userId, accessToken, deviceId, baseUrl, roomId } = sendMsgConfig;
    const client = sdk.createClient({
      baseUrl, // 或者你自己的 Matrix 服务器
      accessToken, // 使用你获取到的 access token
      userId, // 你的 Matrix 用户 ID
      deviceId,
    });

    // @ts-ignore
    client.on("error", (err) => {
      parentPort.postMessage("client error: " + err.message);
    });

    // @ts-ignore
    client.on("sync", (state, prevState, res) => {
      if (state === "ERROR") {
        parentPort.postMessage("sync error: " + res.error);
      }
    });

    // 连接到 Matrix 服务器

    // 加密
    await client.initRustCrypto({ useIndexedDB: false });

    await client.startClient();
    const richTextMessage = msg; // 纯文本（Markdown 原文）
    const htmlMessage = marked.parse(richTextMessage); // HTML 格式

    await client.sendMessage(roomId, {
      body: richTextMessage, // 纯文本（Markdown 原文）
      msgtype: sdk.MsgType.Text,
      format: "org.matrix.custom.html",
      // @ts-ignore
      formatted_body: htmlMessage, // HTML 格式
    });
    parentPort.postMessage("消息发送成功");
    // 断开与 Matrix 服务器的连接
    await client.stopClient();
  } catch (error) {
    parentPort.postMessage("发送消息失败" + error.message);
    throw error;
  }
}

async function sendHTMLAsRichTextByAxios(msg, sendMsgConfig) {
  const { accessToken, roomId, baseUrl } = sendMsgConfig;
  try {
    const txnId = Date.now();
    const url = `${baseUrl}/_matrix/client/v3/rooms/${encodeURIComponent(
      roomId
    )}/send/m.room.message/${txnId}?access_token=${accessToken}`;
    const headers = {
      "Content-Type": "application/json",
    };
    const richTextMessage = msg; // 纯文本（Markdown 原文）
    const htmlMessage = marked.parse(richTextMessage); // HTML 格式
    const data = {
      body: richTextMessage,
      msgtype: "m.text",
      format: "org.matrix.custom.html",
      formatted_body: htmlMessage,
    };
    await axios.put(url, data, { headers });
    console.log("消息发送成功");
  } catch (error) {
    console.error("发送消息失败:", error);
  }
}

const processMsg = fnCanRetry(async (content, sendMsgConfig) => {
  try {
    // @ts-ignore
    process.on("unhandledRejection", (reason, promise) => {
      parentPort.postMessage("未处理的Promise拒绝" + JSON.stringify(reason));
      process.exit(1);
    });
    process.on("uncaughtException", (err) => {
      parentPort.postMessage("未捕获异常" + JSON.stringify(err));
      process.exit(1);
    });
    await sendHTMLAsRichText(content, sendMsgConfig);
    parentPort.postMessage("done");
  } catch (e) {
    if (e.message.includes("缺少依赖")) {
      parentPort.postMessage(e.message);
      return;
    }
    throw e;
  }
});
/**
 * 发送消息
 * @param {Object} msgOptions 消息选项
 * @param {String|Object} msgOptions.msg 消息内容
 * @param {Boolean=}  msgOptions.err 是否为错误消息 默认false
 * @param {Boolean=} msgOptions.encrypt 是否加密  默认false
 */
const sendMsg = async (
  { msg, err = false, encrypt = false },
  sendMsgConfig
) => {
  try {
    let content = typeof msg === "string" ? msg : JSON.stringify(msg);
    if (err) {
      content = `${sendMsgConfig.title} ## **❌错误❌** \n` + content;
    } else {
      content = `${sendMsgConfig.title} \n` + content;
    }
    if (encrypt)
      await new Promise((resolve, reject) => {
        const worker = new Worker(__filename, {
          workerData: { content, sendMsgConfig },
        });
        worker.on("error", reject);
        worker.on("exit", () => {
          console.log("exit");
          resolve();
        });
        worker.on("message", (msg) => {
          console.log(msg);
          if (msg === "done") {
            worker.terminate();
            resolve();
          }
        });
      });
    else {
      await sendHTMLAsRichTextByAxios(content, sendMsgConfig);
    }
  } catch (e) {
    console.error("信息发送失败");
    throw e;
  }
};

/**
 * 初始化发送消息
 * @param {Object} sendMsgConfig 发送消息配置
 * @param {String} sendMsgConfig.userId 用户id
 * @param {String} sendMsgConfig.accessToken 访问令牌
 * @param {String} sendMsgConfig.roomId 房间id
 * @param {String} sendMsgConfig.baseUrl 基础url
 * @param {String} sendMsgConfig.deviceId 设备id
 * @param {String} sendMsgConfig.title 标题
 * @return {sendMsg} sendMsg 发送消息函数
 */
const initSendMsg = ({
  userId,
  accessToken,
  roomId,
  baseUrl,
  deviceId,
  title,
}) => {
  const sendMsgConfig = {
    userId,
    accessToken,
    roomId,
    baseUrl,
    deviceId,
    title,
  };
  return (msgOptions) => sendMsg(msgOptions, sendMsgConfig);
};
useMainThread(
  import.meta.url,
  () => {
    sendMsg({ msg: "test" });
  },
  () => {
    // worker
    const { content, sendMsgConfig } = workerData;
    processMsg(content, sendMsgConfig);
  }
);

export { initSendMsg };
