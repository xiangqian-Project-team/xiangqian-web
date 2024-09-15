/*
 * @Author: 何泽颖 hezeying@autowise.ai
 * @Date: 2024-02-23 10:19:46
 * @LastEditors: 何泽颖 hezeying@autowise.ai
 * @LastEditTime: 2024-03-09 23:30:58
 * @FilePath: /xiangqian-web/app/login/page.js
 * @Description:
 */
'use client';
import Image from 'next/image';
import Footer from '../components/footer';
import LoginCard from '../components/loginCard';
import LogoIcon from '../img/logo.png';
import WXScript from './WXScript';
import styles from './page.module.scss';

export default function Login() {
  return (
    <div className={styles.login}>
      <div className={styles.login_content}>
        <div className={styles.login_content_logo}>
          <Image src={LogoIcon.src} width={86} height={36} alt="logo" />
        </div>
        <div className={styles.login_content_tips}>登录/注册查看更多功能</div>
        <WXScript />
        <LoginCard />
      </div>
      <Footer />
    </div>
  );
}
