export const sendDingTalkMsgDetaik: (...args: any[]) => Promise<any>;
/**
 * 初始化发送消息
 *
 * @param {Object} sendMsgConfig 发送消息配置
 * @param {'dingTalk'|'matrix'} sendMsgConfig.type 类型
 * @param {String?} sendMsgConfig.dingTalkUrl 钉钉url
 * @param {String?} sendMsgConfig.userId 用户id
 * @param {String?} sendMsgConfig.accessToken 访问令牌
 * @param {String?} sendMsgConfig.roomId 房间id
 * @param {String?} sendMsgConfig.baseUrl 基础url
 * @param {String?} sendMsgConfig.deviceId 设备id
 * @param {String?} sendMsgConfig.title 标题
 * @return {sendMsg | sendDingTalkMsg} sendMsg 发送消息函数
 */
export function initSendMsg({ type, dingTalkUrl, userId, accessToken, roomId, baseUrl, deviceId, title, }: {
    type: "dingTalk" | "matrix";
    dingTalkUrl: string | null;
    userId: string | null;
    accessToken: string | null;
    roomId: string | null;
    baseUrl: string | null;
    deviceId: string | null;
    title: string | null;
}): (({ msg, err, encrypt }: {
    msg: string | any;
    err?: boolean | undefined;
    encrypt?: boolean | undefined;
}, sendMsgConfig: any) => Promise<void>) | ((msg: string, options: {
    title: string | null;
    at: object | null;
    msgtype: string | null;
}, url: string | null) => Promise<any>);
