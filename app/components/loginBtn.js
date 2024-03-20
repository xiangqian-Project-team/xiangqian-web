/*
 * @Author: 何泽颖 hezeying@autowise.ai
 * @Date: 2024-02-23 10:47:08
 * @LastEditors: 何泽颖 hezeying@autowise.ai
 * @LastEditTime: 2024-03-12 21:19:05
 * @FilePath: /xiangqian-web/app/components/loginBtn.js
 * @Description:
 */
'use client';
import { Button, ConfigProvider } from 'antd';
import Image from 'next/image';
import { getItem } from '../utils/storage';
// import { useRouter } from 'next/navigation';
import { useRouter } from 'next-nprogress-bar';
import userIcon from '../img/userIcon.png';
import styles from './loginBtn.module.scss';

function LoginBtn(props) {
  const {
    style = {
      position: 'absolute',
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
        <button className={styles.loggedIcon}>
          <Image src={userIcon} alt="userIcon" />
        </button>
      )}
    </div>
  );
}

export default LoginBtn;
