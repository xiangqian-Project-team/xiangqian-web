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
import FAQ_ICON from './icons/faq_icon.svg';
import HomeDescIcon_1 from './icons/home_desc_icon_1.svg';
import HomeDescIcon_2 from './icons/home_desc_icon_2.svg';
import HomeDescIcon_3 from './icons/home_desc_icon_3.svg';
import HomeDescIcon_4 from './icons/home_desc_icon_4.svg';
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

import FAQItem from './faqItem';
import styles from './page.module.scss';

export default function Home() {
  const faqList = [
    {
      title: '镶嵌该怎么用？',
      content: [
        '当你搜索概念，我们会为你查询定义和研究进展',
        '当你搜索问题，你会得到简要回答和一些观点',
        '如果需要更加紧凑的、穿插文献的回应，点击底部按钮获取。',
      ],
    },
    {
      title: '镶嵌与GPT等对话式工具的比较优势?',
      content: [
        '消除ChatGPT的幻觉，所有回应均依靠真实可靠的文献支撑',
        '针对文献调研工作流（了解现状、挖掘灵感、梳理思路），给出特定回答',
        '结合社会科学领域，进行问答能力、阅读方式、辅助信息等多重优化',
        '费用仅为ChatGPT的1/3',
      ],
    },
    {
      title: '镶嵌为何限制免费次数？有何成本?',
      content: [
        '镶嵌遵循检索增强生成（RAG）架构，由数十个机器学习（ML）组件组成。每次问答，N个组件需进行链式运转，需调用大量算力和相应云服务而产生开支。这会产生 N*（0.005RMB-0.01RMB）的开支。',
        '为兼顾轻松提问和理想结果，我们致力于平衡组件复杂度和运算低成本，打造高性价比的智能方案。',
      ],
    },
    {
      title: '我如何联系团队?',
      content: [
        '你好！我们总是期待和您交流 : &#41;',
        '任何有关镶嵌反馈、建议和批评，以及有关AI+社会科学的想法，都欢迎添加用户服务微信 hello-xiangqian 交流',
        '我们的自媒体社区正在筹备中，届时你可以加入了解更多。',
      ],
    },
  ];
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
          *Powered by Gemmed Search, 基于社会科学大数据的「推理式」英文文献搜索
        </div>

        <div className={styles.home_search_recommend}>
          <div className={styles.home_search_recommend_title}>试试搜索：</div>
          <RecommendBtnListCom />
        </div>
      </div>

      <div className={styles.home_searchGuide}>
        <div className={styles.home_searchGuide_content}>
          <div className={styles.home_searchGuide_content_triangle} />
        </div>
      </div>

      <div className={styles.home_intro}>
        <div className={styles.home_intro_title}>为什么使用「镶嵌」</div>
        <div className={styles.home_intro_sub_title}>
          借助前沿的AI技术，增强文献搜索能力，重塑结果反馈的方式
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
              无需提炼关键词，更直接的提问方式，更明快的搜索结果。用中文也能搜到英文文献。
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
            <div className={styles.home_intro_list_item_h1}>基于文献的回应</div>
            <div className={styles.home_intro_list_item_h2}>
              每篇给出的文献都真实存在且路径可查，你可以通过摘要、原文链接甚至是PDF全文快速确认。
            </div>
            <div className={styles.home_intro_list_item_h6}>
              *部分信息受限于版权，建议查看原文。
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
            <div className={styles.home_intro_list_item_h1}>加速学术工作流</div>
            <div className={styles.home_intro_list_item_h2}>
              快速了解陌生学术领域的中英文研究，轻松定位相关方向的学术论文，获取研究思路和启发。
            </div>
          </div>
        </div>
      </div>

      <div className={styles.home_desc}>
        <div className={styles.home_desc_title}>为什么更适合社会科学？</div>
        <div className={styles.home_desc_sub_title}>
          多位行业顶尖的社会科学专家参与设计，充分考虑社科文献的使用场景
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
                Springer Nature, Wiley, Taylor & Francis, SAGE, NAS, Frontiers,
                MDPI等主流出版商的全部英文文献。
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
                提供JCR、CSSCI等中英文期刊索引标识，及部分专业性榜单标注（如UTD24、国家社科基金资助期刊等）。
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
                用中文概括英文文献的要点，一眼即可了解文章议题，更符合中国学者的习惯。
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.faq}>
        <Image
          className={styles.faq_icon}
          src={FAQ_ICON.src}
          width={120}
          height={120}
          alt="logo"
        />
        <div>
          <div className={styles.faq_title}>常见问题</div>
          <div className={styles.faq_list}>
            {faqList.map((item, index) => (
              <FAQItem key={index} title={item.title} content={item.content} />
            ))}
          </div>
        </div>
      </div>

      <div className={styles.school_info}>
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

      <LoginBtn />
    </div>
  );
}
