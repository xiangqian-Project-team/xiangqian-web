/*
 * @Author: 何泽颖 hezeying@autowise.ai
 * @Date: 2024-02-23 16:54:13
 * @LastEditors: 何泽颖 hezeying@autowise.ai
 * @LastEditTime: 2024-02-23 19:54:23
 * @FilePath: /xiangqian-web/app/components/papersCardList.jsx
 * @Description:
 */
'use client';
import { FileTextOutlined } from '@ant-design/icons';
import { Card } from 'antd';
import { useAtomValue } from 'jotai';
import { papersAtom } from '../models/search';
import styles from './papersCardList.module.scss';

const { Meta } = Card;

export default function PapersCardList() {
  const papers = useAtomValue(papersAtom);

  return (
    <>
      {papers.map(({ paperAbstract, authors, journal, title, year }, i) => (
        <div className={styles.papersCard} key={i}>
          <Card style={{ marginTop: 16 }} hoverable>
            <Meta
              avatar={<FileTextOutlined />}
              title={title}
              description={paperAbstract}
            />

            <div className={styles.papersCard_intro}>
              <span>{journal}</span>
              <span>{authors}</span>
              <span>{year}</span>
            </div>
          </Card>
        </div>
      ))}
    </>
  );
}

// abstract:论文摘要。简要总结论文的研究内容、方法、结果等。
// authors:论文作者。列出了参与研究和写作的所有作者的姓名。
// journal:发表期刊。这篇论文发表在哪本学术期刊上。
// title:论文标题。概括表达论文的主题。
// year:发表年份。标明这篇论文的发表年份。
