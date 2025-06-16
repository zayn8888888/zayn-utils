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
