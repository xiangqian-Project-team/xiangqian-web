declare global {
  class WxLogin {
    constructor(options: {
      self_redirect: boolean;
      id: string;
      appid: string;
      scope: string;
      redirect_uri: string;
      state: string;
      style: string;
      href: string;
    });
  }
}

export default global;
