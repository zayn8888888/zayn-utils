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
export function initSendMsg({ userId, accessToken, roomId, baseUrl, deviceId, title, }: {
    userId: string;
    accessToken: string;
    roomId: string;
    baseUrl: string;
    deviceId: string;
    title: string;
}): ({ msg, err, encrypt }: {
    msg: string | any;
    err?: boolean | undefined;
    encrypt?: boolean | undefined;
}, sendMsgConfig: any) => Promise<void>;
