import axios from "axios";
import { createProxyAgent } from "./utils.js";

/**
 * 创建或者登录邮箱
 * @param {object}  [options]
 * @param {string }  [options.preEmail] 登录邮箱，没有则新建
 * @param {string }  [options.password]  邮箱密码
 * @param {string} [options.proxyStr] 代理字符串
 * @param {string} [options.proxyAgent] 代理
 * @returns {Promise<{email: string, password: string, token: string}>}
 */
async function createOrLoginEmail({
  preEmail = "",
  password = "myPassword123",
  proxyStr = "",
  proxyAgent = undefined,
} = {}) {
  const domainRes = await axios.get("https://api.mail.tm/domains");
  const domain = domainRes.data["hydra:member"][0].domain;
  const username = Math.random().toString(36).slice(2, 10);
  let proxyAgentRes;
  if (proxyAgent) proxyAgentRes = proxyAgent;
  else if (proxyStr)
    proxyAgentRes = (await createProxyAgent(proxyStr)).httpsAgent;

  let email = `${username}@${domain}`;
  if (preEmail) {
    email = preEmail;
  } else {
    await axios.post(
      "https://api.mail.tm/accounts",
      {
        address: email,
        password,
      },
      {
        httpsAgent: proxyAgentRes,
      }
    );
  }

  const tokenRes = await axios.post(
    "https://api.mail.tm/token",
    {
      address: email,
      password,
    },
    {
      httpsAgent: proxyAgentRes,
    }
  );

  return {
    email,
    password,
    token: tokenRes.data.token,
  };
}

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
async function waitForMail(
  token,
  { maxWaitTime = 240, proxyStr = "", proxyAgent = undefined }
) {
  let proxyAgentRes;
  if (proxyAgent) proxyAgentRes = proxyAgent;
  else if (proxyStr)
    proxyAgentRes = (await createProxyAgent(proxyStr)).httpsAgent;
  const headers = { Authorization: `Bearer ${token}` };
  for (let i = 0; i < maxWaitTime; i++) {
    const res = await axios.get("https://api.mail.tm/messages", { headers });
    const msgs = res.data["hydra:member"];
    if (msgs.length > 0) {
      const msg = await axios.get(
        `https://api.mail.tm/messages/${msgs[0].id}`,
        { headers, httpsAgent: proxyAgentRes }
      );
      const updatedAt = new Date(msg.data.updatedAt);
      if (Date.now() - updatedAt.getTime() < 5 * 60 * 1000) {
        return msg.data.text;
      }
    }
    await new Promise((r) => setTimeout(r, 3000));
  }
  throw new Error("验证码未收到");
}
export { createOrLoginEmail, waitForMail };
