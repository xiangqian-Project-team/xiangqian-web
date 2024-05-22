import Image from 'next/image';
import DocumentIcon from '../icons/document_icon.svg';
import DropdownIcon from '../icons/drop_down_icon.svg';

import styles from './faqList.module.scss';

const faqData = [
  '镶嵌该怎么用？','镶嵌与GPT等对话式工具的比较优势?',
'镶嵌有何成本?','我如何联系团队?',
];

interface IFAQItemProps {
  title: string;
}

function FAQItem(props: IFAQItemProps) {
  const onQuestionClick = () => {
    // TODO
  }

  return (
    <div className={styles.faq_list_item} onClick={() => {onQuestionClick()}}>
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
          {faqData.map((item, index) => (
            <FAQItem key={index} title={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
