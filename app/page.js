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
import HomeDescIcon_1 from './icons/home_desc_icon_1.svg';
import HomeDescIcon_2 from './icons/home_desc_icon_2.svg';
import HomeDescIcon_3 from './icons/home_desc_icon_3.svg';
import HomeDescIcon_4 from './icons/home_desc_icon_4.svg';
import HomeTriangleIcon from './icons/home_triangle_icon.svg';
import HomeTriangleWhiteIcon from './icons/home_triangle_white_icon.svg';
import MagnifierIcon from './icons/magnifier.svg';
import LogoIcon from './icons/main_logo.svg';
import ReportIcon from './icons/report.svg';
import WorkFlowIcon from './icons/workflow.svg';
import BNU from './img/bnu.png';
import ZhongguoShehuiKexue from './img/caoss.png';
import CAS from './img/cas.png';
import CQU from './img/cqu.png';
import FudanUniversity from './img/fudanUniversity.png';
import NanjingUniversity from './img/nanjingUniversity.png';
import PekingUniversity from './img/pekingUniversity.png';
import RenminUniversityofChina from './img/renminUniversityofChina.png';
import ShanghaiJiaoTongUniversity from './img/shanghaiJiaoTongUniversity.png';
import SYSU from './img/sysu.png';
import TsinghuaUniversity from './img/tsinghuaUniversity.png';
import WHU from './img/whu.png';
import XJTU from './img/xjtu.png';
import ZhejiangUniversity from './img/zhejiangUniversity.png';

import HomeFAQList from './components/homeFAQList';
import styles from './page.module.scss';

export default function Home() {
  return (
    <div className={styles.home}>
      <div className={styles.home_search}>
        <div className={styles.home_search_logo}>
          <Image src={LogoIcon.src} width={190} height={80} alt="logo" />
        </div>
        <div className={styles.home_search_subheading}>
          文献和启发，一并送达
        </div>
        <HomeTextArea />
        <div className={styles.home_search_tips}>
          *Powered by Gemmed Search, 更擅长社科文献的「解读式」搜索引擎
        </div>

        <div className={styles.home_search_recommend}>
          <div className={styles.home_search_recommend_title}>试试搜索：</div>
          <RecommendBtnListCom />
        </div>
        <div className={styles.home_triangle_mask}>
          <div className={styles.home_triangle}>
            <Image
              src={HomeTriangleIcon.src}
              width={60}
              height={43}
              alt="triangle"
            />
          </div>
        </div>
      </div>

      <div className={styles.home_intro}>
        <div className={styles.home_intro_title}>为什么使用「镶嵌」</div>
        <div className={styles.home_intro_sub_title}>
          基于前沿AI技术，更强大的文献搜索能力，更明快的结果反馈方式
        </div>
        <div className={styles.home_intro_list}>
          <div className={styles.home_intro_list_item}>
            <Image
              className={styles.home_intro_list_item_img}
              src={MagnifierIcon}
              width={68}
              height={68}
              alt="magnifier"
            />
            <div className={styles.home_intro_list_item_h1}>推理式搜索</div>
            <div className={styles.home_intro_list_item_h2}>
              像聊天一样搜索！
            </div>
            <div className={styles.home_intro_list_item_h2}>
              只用中文也能搜到双语文献。
            </div>
          </div>
          <div className={styles.home_intro_list_item}>
            <Image
              className={styles.home_intro_list_item_img}
              src={ReportIcon}
              width={68}
              height={68}
              alt="report"
            />
            <div className={styles.home_intro_list_item_h1}>基于文献回应</div>
            <div className={styles.home_intro_list_item_h2}>
              让GPT变得可靠！
            </div>
            <div className={styles.home_intro_list_item_h2}>
              事关学术，必须有理也有据。
            </div>
            <div className={styles.home_intro_list_item_h6}>
              *部分信息受限于版权，需跳转查看原文。
            </div>
          </div>
          <div className={styles.home_intro_list_item}>
            <Image
              className={styles.home_intro_list_item_img}
              src={WorkFlowIcon}
              width={68}
              height={68}
              alt="workFlow"
            />
            <div className={styles.home_intro_list_item_h1}>文献内容速览</div>
            <div className={styles.home_intro_list_item_h2}>一目十行！</div>
            <div className={styles.home_intro_list_item_h2}>
              文献要点和综述，都已整理就绪。
            </div>
          </div>
        </div>
      </div>

      <div className={styles.home_desc}>
        <div className={styles.home_white_triangle_container}>
          <div className={styles.home_white_triangle}>
            <Image
              src={HomeTriangleWhiteIcon.src}
              width={60}
              height={43}
              alt="triangle"
            />
          </div>
        </div>
        <div className={styles.home_desc_title}>为什么更适合社会科学？</div>
        <div className={styles.home_desc_sub_title}>
          十余名行业顶尖的社会科学专家参与设计，充分考虑社科学术的使用场景
        </div>
        <div className={styles.home_desc_list}>
          <div className={styles.home_desc_list_item}>
            <Image
              className={styles.home_desc_list_item_img}
              src={HomeDescIcon_1}
              width={68}
              height={68}
              alt="magnifier"
            />
            <div className={styles.home_desc_list_item_titles}>
              <div className={styles.home_desc_list_item_h1}>
                上亿篇中英文社会科学文献
              </div>
              <div className={styles.home_desc_list_item_h2}>
                聚合中英文文献库。已实现中文核心期刊全覆盖，同时提供Elsevier,
                Springer Nature, Wiley, Taylor & Francis, SAGE, NAS, AAAS, AEA,
                INFORMS, The BMJ等主流出版商和协会的全部英文文献。
              </div>
            </div>
          </div>
          <div className={styles.home_desc_list_item}>
            <Image
              className={styles.home_desc_list_item_img}
              src={HomeDescIcon_2}
              width={68}
              height={68}
              alt="magnifier"
            />
            <div className={styles.home_desc_list_item_titles}>
              <div className={styles.home_desc_list_item_h1}>
                社会科学思维的深度学习
              </div>
              <div className={styles.home_desc_list_item_h2}>
                全面增强对社会科学专有名词的理解能力，提供符合社会科学表述规范的文献总结。
              </div>
            </div>
          </div>
          <div className={styles.home_desc_list_item}>
            <Image
              className={styles.home_desc_list_item_img}
              src={HomeDescIcon_3}
              width={68}
              height={68}
              alt="magnifier"
            />
            <div className={styles.home_desc_list_item_titles}>
              <div className={styles.home_desc_list_item_h1}>
                社会科学专业期刊分级标注
              </div>
              <div className={styles.home_desc_list_item_h2}>
                英文期刊提供SCI、SSCI等检索和分区，中文期刊提供南大/北大核心等期刊索引标识。
                让权威期刊更醒目，帮你快速定位高水平文献。
              </div>
              <div className={styles.home_desc_list_item_h3}>
                *默认显示最高分级。英文TOP期刊为领域内前5%的期刊；中文CSSCI权威期刊参照中国社科院AMI评价、基金委重点期刊信息标注。
              </div>
            </div>
          </div>
          <div className={styles.home_desc_list_item}>
            <Image
              className={styles.home_desc_list_item_img}
              src={HomeDescIcon_4}
              width={68}
              height={68}
              alt="magnifier"
            />
            <div className={styles.home_desc_list_item_titles}>
              <div className={styles.home_desc_list_item_h1}>
                优化中英文显示
              </div>
              <div className={styles.home_desc_list_item_h2}>
                试试英文文献的中文简介！一眼即可了解文章的主要议题，更符合中国学者的习惯。
              </div>
            </div>
          </div>
        </div>
        <div className={styles.home_triangle_mask}>
          <div className={styles.home_triangle}>
            <Image
              src={HomeTriangleIcon.src}
              width={60}
              height={43}
              alt="triangle"
            />
          </div>
        </div>
      </div>

      <HomeFAQList />

      <div className={styles.school_info}>
        <div className={styles.home_white_triangle_container}>
          <div className={styles.home_white_triangle}>
            <Image
              src={HomeTriangleWhiteIcon.src}
              width={60}
              height={43}
              alt="triangle"
            />
          </div>
        </div>
        <div className={styles.school_info_title}>
          5000+ 社会科学工作者已率先使用
        </div>
        <div className={styles.school_info_list}>
          <Image
            className={styles.school_info_list_item}
            src={PekingUniversity.src}
            width={120}
            height={60}
            alt="logo"
          />
          <Image
            src={TsinghuaUniversity.src}
            className={styles.school_info_list_item}
            width={120}
            height={60}
            alt="logo"
          />
          <Image
            src={FudanUniversity.src}
            className={styles.school_info_list_item}
            width={120}
            height={60}
            alt="logo"
          />
          <Image
            src={ShanghaiJiaoTongUniversity.src}
            className={styles.school_info_list_item}
            width={120}
            height={60}
            alt="logo"
          />
          <Image
            src={ZhejiangUniversity.src}
            className={styles.school_info_list_item}
            width={120}
            height={60}
            alt="logo"
          />
          <Image
            src={RenminUniversityofChina.src}
            className={styles.school_info_list_item}
            width={120}
            height={60}
            alt="logo"
          />
          <Image
            src={NanjingUniversity.src}
            className={styles.school_info_list_item}
            width={120}
            height={60}
            alt="logo"
          />
          <Image
            src={ZhongguoShehuiKexue.src}
            className={styles.school_info_list_item}
            width={120}
            height={60}
            alt="logo"
          />
          <Image
            src={CAS.src}
            className={styles.school_info_list_item}
            width={120}
            height={60}
            alt="logo"
          />
          <Image
            src={XJTU.src}
            className={styles.school_info_list_item}
            width={120}
            height={60}
            alt="logo"
          />
          <Image
            src={WHU.src}
            className={styles.school_info_list_item}
            width={120}
            height={60}
            alt="logo"
          />
          <Image
            src={SYSU.src}
            className={styles.school_info_list_item}
            width={120}
            height={60}
            alt="logo"
          />
          <Image
            src={BNU.src}
            className={styles.school_info_list_item}
            width={120}
            height={60}
            alt="logo"
          />
          <Image
            src={CQU.src}
            className={styles.school_info_list_item}
            width={120}
            height={60}
            alt="logo"
          />
        </div>
      </div>
      <Footer />
      <LoginBtn />
    </div>
  );
}
