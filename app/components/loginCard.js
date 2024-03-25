/*
 * @Author: 何泽颖 hezeying@autowise.ai
 * @Date: 2024-02-23 10:47:08
 * @LastEditors: 何泽颖 hezeying@autowise.ai
 * @LastEditTime: 2024-03-10 14:16:32
 * @FilePath: /xiangqian-web/app/components/loginCard.js
 * @Description:
 */
'use client';
import {
  Button,
  ConfigProvider,
  Form,
  Input,
  message as antdMessage,
} from 'antd';
// import { useRouter } from 'next/navigation';
import { useRouter } from 'next-nprogress-bar';
import { useEffect, useRef, useState } from 'react';
import { getMessage as getMessageAsync, login as loginAsync } from '../service';
import { setItem } from '../utils/storage';
import styles from './loginCard.module.scss';

function LoginCard() {
  const [form] = Form.useForm();
  const router = useRouter();
  const timeId = useRef({ id: -1 });

  const [count, setCount] = useState(60);
  const [message, setMessage] = useState('');
  const [messageLoading, setMessageLoading] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

  const getMessage = async () => {
    try {
      const { phone } = await form?.validateFields();
      setMessageLoading(true);
      await getMessageAsync({ phone });
      antdMessage.success('验证码发送成功');
      // 开启倒计时
      timeId.current.id = setInterval(() => {
        setCount((count) => count - 1);
      }, 1000);
      setMessageLoading(false);
    } catch (error) {
      setMessageLoading(false);
    }
  };

  const login = async () => {
    try {
      const { phone } = await form?.validateFields();
      setLoginLoading(true);
      const token = await loginAsync({
        phone,
        message,
      });
      antdMessage.success('登录成功，正在跳转回首页');
      setTimeout(() => {
        setItem('token', token);
        setLoginLoading(false);
        router.push('/');
      }, 1000);
    } catch (error) {
      setLoginLoading(false);
    }
  };

  useEffect(() => {
    // 当倒计时为0时 清除定时器
    if (count === 0) {
      clearInterval(timeId.current.id);
      setCount(60);
    }
  }, [count]);

  return (
    <div className={styles.loginCard}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#86F1D3',
          },
          components: {
            Input: {
              paddingBlockLG: 10,
            },
            Button: {
              paddingInlineLG: 24,
            },
          },
        }}
      >
        <div className={styles.loginCard_header}>手机号登录</div>
        <Form form={form} name="phone" style={{ width: '100%' }}>
          <Form.Item
            name="phone"
            validateTrigger="onBlur"
            rules={[
              {
                required: true,
                message: '手机号输入错误',
                pattern: new RegExp(/^1(3|4|5|6|7|8|9)\d{9}$/, 'g'),
              },
            ]}
          >
            <Input placeholder="请输入手机号" size="large" />
          </Form.Item>
        </Form>

        <div className={styles.loginCard_auth}>
          <Input
            placeholder="请输入验证码"
            size="large"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
            }}
          />
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: '#6F9EC1',
              },
            }}
          >
            {count === 60 ? (
              <Button
                size="large"
                type="primary"
                onClick={getMessage}
                loading={messageLoading}
              >
                发送
              </Button>
            ) : (
              <Button
                size="large"
                type="primary"
                onClick={getMessage}
                loading={messageLoading}
                style={{ marginLeft: '12px' }}
              >
                {count}
              </Button>
            )}
          </ConfigProvider>
        </div>

        <div className={styles.loginCard_tips}>
          提示：未注册手机号验证后自动注册
        </div>

        <div className={styles.loginCard_login}>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: '#356CBC',
              },
            }}
          >
            <Button
              size="large"
              type="primary"
              //   disabled={!(message && phone)}
              onClick={login}
              loading={loginLoading}
            >
              登录/注册
            </Button>
          </ConfigProvider>
        </div>
      </ConfigProvider>
    </div>
  );
}

export default LoginCard;
