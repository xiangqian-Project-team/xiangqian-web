import Script from 'next/script';

function WXScript() {
  const uri = encodeURIComponent('http://127.0.0.1/wechat-auth-callback');
  return (
    <>
      <Script
        src="http://res.wx.qq.com/connect/zh_CN/htmledition/js/wxLogin.js"
        onReady={() => {
          try {
            var obj = new WxLogin({
              self_redirect: false,
              id: 'login_container',
              appid: 'wxa9d98075500249e1',
              scope: 'snsapi_login',
              redirect_uri: uri,
              state: Math.random().toString(),
              style: '',
              href: '',
            });
          } catch (e) {
            console.log(e);
          }

          console.log(obj);
        }}
      />
      <div id="login_container"></div>
    </>
  );
}

export default WXScript;
