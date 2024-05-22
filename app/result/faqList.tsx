import Image from 'next/image';
import DocumentIcon from '../icons/document_icon.svg';
import DropdownIcon from '../icons/drop_down_icon.svg';

import styles from './faqList.module.scss';
import { useEffect, useState } from 'react';
import { getRelatedSearch } from '../service';
import { Skeleton } from 'antd';

interface IFAQItemProps {
  title: string;
}

function FAQItem(props: IFAQItemProps) {
  const onQuestionClick = () => {
    // TODO
  };

  return (
    <div
      className={styles.faq_list_item}
      onClick={() => {
        onQuestionClick();
      }}
    >
      <div className={styles.faq_list_item_title}>
        {props.title}
        <Image
          className={styles.faq_list_item_drop_down}
          src={DropdownIcon}
          width={12}
          height={12}
          alt="drop_down"
        />
      </div>
    </div>
  );
}

export default function FAQList() {
  const [questionList, setQuestionList] = useState<string[]>([])

  useEffect(() => {
   async function getQuestionList() {
      
      try {
        const listRes = await getRelatedSearch();
        if (!listRes.ok) {
          throw new Error('Failed search');
        }
        const data = await listRes.json();
        setQuestionList(data)
      } catch (e) {
      }
    }

    getQuestionList()
  },[])

  return (
    <div className={styles.faq}>
      <div>
        <div className={styles.faq_title}>
          <Image
            className={styles.faq_icon}
            src={DocumentIcon.src}
            width={20}
            height={24}
            alt="logo"
          />
          相关研究问题
        </div>
        <div className={styles.faq_list}>
          <Skeleton active title={false}>
          {questionList.map((item, index) => (
            <FAQItem key={index} title={item} />
          ))}</Skeleton>
        </div>
      </div>
    </div>
  );
}
