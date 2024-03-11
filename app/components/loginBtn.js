/*
 * @Author: 何泽颖 hezeying@autowise.ai
 * @Date: 2024-02-23 10:47:08
 * @LastEditors: 何泽颖 hezeying@autowise.ai
 * @LastEditTime: 2024-03-10 17:06:29
 * @FilePath: /xiangqian-web/app/components/loginBtn.js
 * @Description:
 */
'use client';
import { SettingOutlined } from '@ant-design/icons';
import { Button, ConfigProvider } from 'antd';
// import { useRouter } from 'next/navigation';
import { useRouter } from 'next-nprogress-bar';
import { getItem } from '../utils/storage';
import styles from './loginBtn.module.scss';

function LoginBtn(props) {
  const {
    style = {
      top: 24,
      right: 156,
    },
  } = props;
  const router = useRouter();

  return (
    <div className={styles.loginBtn} style={style}>
      {!getItem('token') ? (
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#356CBC',
            },
            components: {
              Button: {
                paddingInlineLG: 24,
              },
            },
          }}
        >
          <Button
            // size="large"
            type="primary"
            onClick={() => {
              router.push('/login');
            }}
          >
            登录
          </Button>
        </ConfigProvider>
      ) : (
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#50C98C',
            },
            components: {
              Button: {
                paddingInlineLG: 24,
              },
            },
          }}
        >
          <Button
            size="large"
            type="primary"
            shape="circle"
            icon={<SettingOutlined style={{ color: '#000000' }} />}
          />
        </ConfigProvider>
      )}
    </div>
  );
}

export default LoginBtn;
