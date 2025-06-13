export function initSendMsg({ userId, accessToken, roomId, baseUrl, deviceId, title, }: {
    userId: string;
    accessToken: string;
    roomId: string;
    baseUrl: string;
    deviceId: string;
    title: string;
}): ({ msg, err, encrypt }: string | any, sendMsgConfig: any) => Promise<void>;
