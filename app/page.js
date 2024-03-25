/*
 * @Author: 何泽颖 hezeying@autowise.ai
 * @Date: 2024-02-23 10:19:46
 * @LastEditors: 何泽颖 hezeying@autowise.ai
 * @LastEditTime: 2024-03-09 23:30:40
 * @FilePath: /xiangqian-web/app/page.js
 * @Description:
 */
import Image from 'next/image';
import HomeTextArea from './components/homeTextArea';
import LoginBtn from './components/loginBtn';
import RecommendBtnListCom from './components/recommendBtnList';
import LogoIcon from './img/logo.png';

import styles from './page.module.scss';

export default function Home() {
  return (
    <div className={styles.home}>
      <div className={styles.home_search}>
        <div className={styles.home_search_logo}>
          <Image src={LogoIcon.src} width={190} height={80} alt="logo" />
        </div>
        <div className={styles.home_search_subheading}>
          AI驱动的社科文献调研
        </div>
        <HomeTextArea />
        <div className={styles.home_search_tips}>
          *Powered by Gemmed Search, 基于社会科学大数据的「推理式」英文文献搜索
        </div>

        <div className={styles.home_search_recommend}>
          <RecommendBtnListCom />
        </div>
      </div>

      <div className={styles.home_searchGuide}>
        <div className={styles.home_searchGuide_content}>
          <div className={styles.home_searchGuide_content_triangle} />
        </div>
      </div>

      <LoginBtn />
    </div>
  );
}
