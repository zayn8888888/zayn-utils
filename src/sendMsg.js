import sdk from "matrix-js-sdk";
import { logger } from "matrix-js-sdk/lib/logger.js";
import axios from "axios";
import { Worker, isMainThread, workerData, parentPort } from "worker_threads";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
import { useMainThread } from "./utils.js";
import { marked } from "marked"; // 新增：引入
logger.setLevel("error");

/**
 * 重试函数
 * @param fn {Function} 函数
 * @param maxCount {Number=3?} 最大重试次数
 * @returns {Promise<*>}
 * */
function fnCanRetry(fn, maxCount = 5) {
  return async function (...args) {
    let count = 0;
    while (count < maxCount) {
      try {
        return await fn(...args);
      } catch (error) {
        if (count === maxCount - 1) {
          throw error;
        }
        await sleep(1000);
        console.log(`Retry ${count + 1} times`);
        count++;
      }
    }
  };
}

async function sendHTMLAsRichText(msg, sendMsgConfig) {
  try {
    const { userId, accessToken, deviceId, baseUrl, roomId } = sendMsgConfig;
    const client = sdk.createClient({
      baseUrl, // 或者你自己的 Matrix 服务器
      accessToken, // 使用你获取到的 access token
      userId, // 你的 Matrix 用户 ID
      deviceId,
    });
    client.on("error", (err) => {
      parentPort.postMessage("client error: " + err.message);
    });

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
      msgtype: "m.text",
      format: "org.matrix.custom.html",
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
    throw e;
  }
});
/**
 * 发送消息
 * @param msg {String|Object} 消息内容
 * @param err {Boolean=false} 是否为错误消息
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
export const initSendMsg = ({
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
    sendMsg("test");
  },
  () => {
    // worker
    const { content, sendMsgConfig } = workerData;

    processMsg(content, sendMsgConfig);
  }
);
