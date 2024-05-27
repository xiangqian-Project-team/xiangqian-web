import Image from 'next/image';
import DocumentIcon from '../icons/document_icon.svg';
import DropdownIcon from '../icons/drop_down_icon.svg';

import { useSelector } from '@xstate/react';
import { Skeleton } from 'antd';
import { searchActor } from '../models/searchMachine';
import { useRouter } from 'next/navigation';
import styles from './faqList.module.scss';

interface IFAQItemProps {
  title: string;
}

function FAQItem(props: IFAQItemProps) {
  const router = useRouter();
  const onQuestionClick = () => {
    router.push(`./result?q=${props.title}`);
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
  const state = useSelector(searchActor, (state) => state);
  const faqList = useSelector(searchActor, (state) => state.context.faqList);
  const isFetchRelatedSearchSuccess = state.matches({
    viewing: { fetchingRelatedSearch: 'success' },
  });

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
          <Skeleton
            active
            title={false}
            loading={!isFetchRelatedSearchSuccess}
          >
            {faqList.map((item, index) => (
              <FAQItem key={index} title={item} />
            ))}
          </Skeleton>
        </div>
      </div>
    </div>
  );
}
