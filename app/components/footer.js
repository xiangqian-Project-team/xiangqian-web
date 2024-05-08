/*
 * @Author: 何泽颖 hezeying@autowise.ai
 * @Date: 2024-03-02 21:21:42
 * @LastEditors: 何泽颖 hezeying@autowise.ai
 * @LastEditTime: 2024-03-12 20:47:51
 * @FilePath: /xiangqian-web/app/components/footer.js
 * @Description:
 */
// import Image from 'next/image';
// import Logo2Icon from '../img/logo2.png';
import styles from './footer.module.scss';

export default function Footer(props) {
  const { width = '100%' } = props;
  return (
    <div className={styles.footer} style={{ width }}>
      <div className={styles.footer_footer}>
        <span>苏ICP备2024092953号</span>
        <span>Copyright © 2024-2025 南京相嵌科技有限公司</span>
        <span>苏公网安备32010602011503号</span>
      </div>
    </div>
  );
}
