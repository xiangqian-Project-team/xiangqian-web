/*
 * @Author: 何泽颖 hezeying@autowise.ai
 * @Date: 2024-02-23 10:19:46
 * @LastEditors: 何泽颖 hezeying@autowise.ai
 * @LastEditTime: 2024-02-23 19:32:12
 * @FilePath: /xiangqian-web/app/page.js
 * @Description:
 */
import { Select } from 'antd';
import Image from 'next/image';
import PapersCardList from './components/papersCardList.jsx';
import SummaryText from './components/summaryText';
import I18nIcon from './icons/i18n.svg';
import styles from './page.module.scss';

export default function Home() {
  return (
    <div className={styles.home}>
      <div className={styles.home_summary}>
        <div className={styles.home_summary_header}>
          <div className={styles.home_summary_header_title}>
            <div>
              <span>Summary</span>
              <span>beta</span>
            </div>
            <div>Top 8 papers analyzed</div>
          </div>
          <div className={styles.home_summary_header_i18n}>
            <Image
              src={I18nIcon.src}
              width={16}
              height={16}
              alt={'I18nIcon'}
              style={{ borderRadius: 4 }}
            />
            <Select
              defaultValue="Chinese (zh)"
              style={{ width: 140 }}
              bordered={false}
              options={[
                { value: 'Chinese (zh)', label: 'Chinese (zh)' },
                { value: 'English (en)', label: 'English (en)' },
              ]}
            />
          </div>
        </div>
        <div lassName={styles.home_summary_content}>
          <SummaryText />
        </div>
      </div>
      <div className={styles.home_papers}>
        <PapersCardList />
      </div>
    </div>
  );
}
