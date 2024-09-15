import Script from 'next/script';

function WXScript() {
  return (
    <>
      <Script
        src="http://res.wx.qq.com/connect/zh_CN/htmledition/js/wxLogin.js"
        onReady={() => {
          console.log(111);
          try {
            var obj = new WxLogin({
              self_redirect: true,
              id: 'login_container',
              appid: 'wxa9d98075500249e1',
              scope: 'snsapi_login',
              redirect_uri: 'http://localhost:3000/',
              state: '',
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
