/*
 * @Author: 何泽颖 hezeying@autowise.ai
 * @Date: 2024-02-23 10:47:08
 * @LastEditors: 何泽颖 hezeying@autowise.ai
 * @LastEditTime: 2024-02-23 20:14:39
 * @FilePath: /xiangqian-web/app/components/header.jsx
 * @Description:
 */
'use client';
import { SearchOutlined } from '@ant-design/icons';
import { Input } from 'antd';
import { useSetAtom } from 'jotai';
import Image from 'next/image';
import withTheme from '../../theme';
import LogoIcon from '../img/logo.png';
import { papersAtom, summaryAtom } from '../models/search';
import { getPedia as getPediaAsync } from '../service';
import styles from './header.module.scss';

function PediaHeader() {
  const setSummary = useSetAtom(summaryAtom);
  const setPapers = useSetAtom(papersAtom);
  return (
    <header className={styles.header}>
      <div className={styles.header_content}>
        <div className={styles.header_content_logo}>
          <Image src={LogoIcon.src} width={32} height={32} alt="镶嵌" />
          <div className={styles.header_content_logo_text}>
            <span>镶嵌</span>
            <span>GemmeD</span>
          </div>
        </div>

        <div className={styles.header_content_search}>
          <Input
            style={{ width: 800 }}
            prefix={<SearchOutlined />}
            placeholder="How does climate change impact biodiversity?"
            size="large"
            onPressEnter={async (e) => {
              const { value } = e.target;
              const params = { q: value };
              const data = await getPediaAsync(params);
              const { papers, summary } = data;
              setSummary(summary);
              setPapers(papers);
            }}
          />
        </div>
      </div>
    </header>
  );
}

const PediaHeaderPage = () => {
  return withTheme(<PediaHeader />);
};

export default PediaHeaderPage;
