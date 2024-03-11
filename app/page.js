/*
 * @Author: 何泽颖 hezeying@autowise.ai
 * @Date: 2024-02-23 10:19:46
 * @LastEditors: 何泽颖 hezeying@autowise.ai
 * @LastEditTime: 2024-03-09 23:30:40
 * @FilePath: /xiangqian-web/app/page.js
 * @Description:
 */
import Image from 'next/image';
import Footer from './components/footer';
import HomeTextArea from './components/homeTextArea';
import LoginBtn from './components/loginBtn';
import RecommendBtnListCom from './components/recommendBtnList';
import Bnu from './img/bnu.png';
import Caoss from './img/caoss.png';
import Cas from './img/cas.png';
import Cqu from './img/cqu.png';
import FudanUniversity from './img/fudanUniversity.png';
import LogoIcon from './img/logo.png';
import NanjingUniversity from './img/nanjingUniversity.png';
import PekingUniversity from './img/pekingUniversity.png';
import Publicity1 from './img/publicity1.png';
import Publicity2 from './img/publicity2.png';
import Publicity3 from './img/publicity3.png';
import RenminUniversityofChina from './img/renminUniversityofChina.png';
import ShanghaiJiaoTongUniversity from './img/shanghaiJiaoTongUniversity.png';
import Sysu from './img/sysu.png';
import TsinghuaUniversity from './img/tsinghuaUniversity.png';
import Whu from './img/whu.png';
import Xjtu from './img/xjtu.png';
import ZhejiangUniversity from './img/zhejiangUniversity.png';

import styles from './page.module.scss';

export default function Home() {
  return (
    <div className={styles.home}>
      <div className={styles.home_search}>
        <div className={styles.home_search_logo}>
          <Image src={LogoIcon.src} width={152} height={64} alt="logo" />
        </div>
        <div className={styles.home_search_subheading}>
          观点或是问题，都有文献支撑
        </div>
        <HomeTextArea />
        <div className={styles.home_search_tips}>
          *基于GEMMED ENGINE，一款专为社会科学研究者开发的引擎
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

      <div className={styles.home_why}>
        <div className={styles.home_why_content}>
          <div className={styles.home_why_content_text}>为什么选择我们？</div>
          <div className={styles.home_why_content_publicity}>
            <Image
              src={Publicity1.src}
              width={456}
              height={140}
              alt="Publicity1"
            />
            <Image
              src={Publicity2.src}
              width={456}
              height={140}
              alt="Publicity1"
            />
            <Image
              src={Publicity3.src}
              width={456}
              height={140}
              alt="Publicity1"
            />
          </div>
        </div>
      </div>

      <div className={styles.home_university}>
        <div className={styles.home_university_text}>
          5000+社会科学工作者已率先使用
        </div>
        <div className={styles.home_university_imgs}>
          {[
            PekingUniversity,
            TsinghuaUniversity,
            FudanUniversity,
            ShanghaiJiaoTongUniversity,
            ZhejiangUniversity,
            NanjingUniversity,
            RenminUniversityofChina,
          ].map(({ src }) => (
            <Image key={src} src={src} width={160} height={80} alt={src} />
          ))}
        </div>
        <div className={styles.home_university_imgs}>
          {[Caoss, Cas, Xjtu, Whu, Sysu, Bnu, Cqu].map(({ src }) => (
            <Image key={src} src={src} width={160} height={80} alt={src} />
          ))}
        </div>
      </div>

      <Footer />
      <LoginBtn />
    </div>
  );
}
