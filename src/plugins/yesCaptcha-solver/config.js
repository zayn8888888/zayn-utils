const config = {
  clientKey: "", // 你购买授权的clientKey
  host: "https://api.yescaptcha.com", // 服务器地址，默认官网服务器https://api.yescaptcha.com

  autorun: true, // 自动运行 true or false
  //遗弃
  imageclassification: true, // （已弃用！！！）reCaptcha谷歌人机自动识别
  hcaptcha: true, // hCaptchaHC人机自动识别
  imagetotext: true, // Coinlist英文数字人机自动识别
  rainbow: true, // Coinlist排队时粉色按钮自动点击
  times: 200, // 点击图片的间隔时间，单位毫秒
  isTextCaptcha: false, // 开启文字验证码识别
  endTimes: "20", // 在几次识别流程后停止识别
  isAutoClickCheckBox: true, // 是否自动点击checkBox
  checkBoxClickDelayTime: "500", // 页面加载之后 延迟多久自动点击checkBox
  isOpenEndTimes: true, // 是否打开“在几次识别流程后停止识别”这个功能
  isOpenCloudflare: false, //是否开启Cloudflare验证
  isAutoSubmit: true, //一次九宫格验证中，是否自动点击提交按钮
  autoSubmitDelayTime: 100, // 自动提交之前间隔时间，单位毫秒
  autoSubmitDelayFloatRate: 0.1, // 自动提交之前间隔时间浮动比例，数值0~1
  workStatusFlag: "",
  jsControlObjectName: "yesCaptcha",
  allowJsInject: false,
  network: {
    //网络设置
    hcaptchaVerifyFailDelay: 1000, //在一次解析请求失败后，重试的延迟事件（网络不好的情况）
    hcaptchaVerifyTry: 3, //单次解析请求的重复此时（网络不好的情况）
    recaptchaVerifyFailDelay: 1000,
    recaptchaVerifyTry: 2,
    funcaptchaVerifyFailDelay: 1000,
    funcaptchaVerifyTry: 3,
  },
  //hcaptcha 独立配置
  hcaptchaConfig: {
    isPassDragChallenge: false,
    //是否失败刷新
    isAutoRefresh: true,
  },
  //funcatpcha 独立配置
  funcaptchaConfig: {
    isOpen: true,
    // "nothing" | "refresh"
    actionAfterRecSuccess: "nothing",

    // "nothing"  | "submit" | "restart"
    actionAfterOneRecFail: "nothing",

    // "nothing" | "tryAgain" | "restart" ,
    actionAfterRecFail: "nothing",

    actionDelay: 3000,

    // 是否自动点击前置页开始按钮
    isAutoClickPrePage: true,
  },
  //recaptcha 独立配置
  recaptchaConfig: {
    isOpen: true,
    isUseNewScript: true,
    //单图淡入等待延迟（ms）
    delayFor1X1: 3000,
    //适应invisible模式。值为true，非invisible模式可能会出现识别卡住的情况
    isAdaptInvisible: false,
  },
  textCaptchaConfig: {
    //是否将服务器传回来的验证结果转换为大写字母
    isTransToUppercase: false,
  },
  //网站黑名单配置
  blackListConfig: {
    isOpen: false,
    urlList: [],
  },
  //网站白名单配置
  whiteListConfig: {
    isOpen: false,
    urlList: [],
  },
  awsCaptchaConfig: {
    isOpen: true,
  },
};

// 以下代码请勿修改
chrome.storage.local.get(["config"], function (result) {
  if (!result.config) {
    chrome.storage.local.set({ config }, () => {}); // 存储配置
  }
});
