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
import sideBarCheck from '../icons/side_bar_check.svg';
import sideBarQuit from '../icons/side_bar_quit_login.svg';
import sideBarRightArrow from '../icons/side_bar_right_arrow.svg';
import userIcon from '../icons/userIcon.svg';
import userLogoutIcon from '../icons/userLogoutIcon.svg';
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
      {/* {!getItem('token') ? (
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
      ) : ( */}
      {getItem('token') && (
        <button
          className={styles.loggedInIcon}
          onClick={() => {
            if (getItem('token')) {
              return;
            }
            router.push('/login');
          }}
        >
          <Image src={userIcon} alt="userIcon" />
          {props.isOpen && <div className={styles.userMobile}>135****1234</div>}
        </button>
      )}
      {!getItem('token') && (
        <>
          <button
            className={styles.loggedOutIcon}
            disabled
            onClick={() => {
              if (getItem('token')) {
                return;
              }
              router.push('/login');
            }}
          >
            <Image src={userLogoutIcon} alt="userLogoutIcon" />
            {props.isOpen && (
              <div className={styles.loggedOutText}>登录查看更多</div>
            )}
          </button>
          {props.isOpen && (
            <div className={styles.loggedOutButtons}>
              <ConfigProvider
                theme={{
                  token: {
                    colorPrimary: '#6F9EC1',
                  },
                }}
              >
                <Button
                  className={styles.loggedOutButtonRegister}
                  size="large"
                  type="primary"
                  onClick={() => {
                    router.push('/login');
                  }}
                >
                  注册
                </Button>
              </ConfigProvider>
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
                  className={styles.loggedOutButtonLogin}
                  size="large"
                  type="primary"
                  onClick={() => {
                    router.push('/login');
                  }}
                >
                  登录
                </Button>
              </ConfigProvider>
            </div>
          )}
        </>
      )}
      {getItem('token') && props.isOpen && (
        <>
          <button className={styles.subscribeButton}>
            <Image src={sideBarCheck} alt="checkIcon" />
            <div className={styles.subscribeDesc}>升级月卡</div>
            <Image
              className={styles.subscribeRightIcon}
              src={sideBarRightArrow}
              alt="rightArrow"
            />
          </button>
          <button className={styles.quitButton}>
            <Image src={sideBarQuit} alt="quitIcon" />
            登出
          </button>
        </>
      )}
      {/* )} */}
    </div>
  );
}

export default LoginBtn;
