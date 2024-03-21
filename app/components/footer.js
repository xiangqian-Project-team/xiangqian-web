/*
 * @Author: 何泽颖 hezeying@autowise.ai
 * @Date: 2024-03-02 21:21:42
 * @LastEditors: 何泽颖 hezeying@autowise.ai
 * @LastEditTime: 2024-03-12 20:47:51
 * @FilePath: /xiangqian-web/app/components/footer.js
 * @Description:
 */
import Image from 'next/image';
import Logo2Icon from '../img/logo2.png';
import styles from './footer.module.scss';

export default function Footer(props) {
  const { width = '100%', isIcpHidden } = props;
  return (
    <div className={styles.footer} style={{ width }}>
      <div className={styles.footer_message}>
        <div className={styles.footer_message_line} />
        <div className={styles.footer_message_content}>
          <Image src={Logo2Icon.src} width={64} height={76} alt="logo2" />

          <div className={styles.footer_message_content_relation}>
            <div style={{ marginBottom: '8px' }}>
              <span>客服邮箱：support@xxxx.com</span>
              <span>邮编：100023</span>
            </div>

            <div>
              <span>官方微信：support@xxxx.com</span>
              <span>地址：上海市长宁区xx路2343号</span>
            </div>
          </div>
        </div>
      </div>

      {!isIcpHidden && (
        <div className={styles.footer_footer}>
          <span>Copyright © 2023-2024 GEMMED有限公司</span>
          <span>All Rights Reserved</span>
          <span>京ICP备234294309</span>
        </div>
      )}
    </div>
  );
}
