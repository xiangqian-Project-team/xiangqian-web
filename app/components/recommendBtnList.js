/*
 * @Author: 何泽颖 hezeying@autowise.ai
 * @Date: 2024-02-23 10:47:08
 * @LastEditors: 何泽颖 hezeying@autowise.ai
 * @LastEditTime: 2024-03-03 02:02:46
 * @FilePath: /xiangqian-web/app/components/RecommendBtnList.js
 * @Description:
 */
'use client';
import { Button } from 'antd';
import { useRouter } from 'next-nprogress-bar';
import withTheme from '../../theme';
import { RECOMMEND_LIST } from '../config';
import styles from './recommendBtnList.module.scss';

function RecommendBtnList() {
  const router = useRouter();

  return (
    <div className={styles.recommendBtnList}>
      {RECOMMEND_LIST.map((q) => (
        <Button
          key={q}
          onClick={() => {
            router.push(`./result?q=${q}`);
          }}
        >
          {q}
        </Button>
      ))}
    </div>
  );
}

const RecommendBtnListCom = () => {
  return withTheme(<RecommendBtnList />);
};

export default RecommendBtnListCom;
