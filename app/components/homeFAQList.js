'use client';
import Image from 'next/image';
import { useState } from 'react';
import DropdownIcon from '../icons/drop_down_icon.svg';
import FAQ_ICON from '../icons/faq_icon.svg';
import styles from './homeFAQList.module.scss';

const faqData = [
  {
    title: '镶嵌该怎么用？',
    content: [
      '# 当作谷歌学术使用，获取更高质量的搜索结果，并快速获得解读',
      '# 当作ChatGPT使用，得到具有文献支撑的答案',
      '# 根据总结中的要点，生成文献综述参考。通过文献勾选，可调整写法',
    ],
  },
  {
    title: '镶嵌与GPT等对话式工具的比较优势?',
    content: [
      '# 消除GPT的幻觉，所有回答均同步提供可靠的文献支撑',
      '# 结合社会科学领域，进行问答能力、阅读方式、辅助信息等多重优化',
    ],
  },
  {
    title: '镶嵌有何成本?',
    content: [
      '# 基于检索增强生成(RAG)架构，由数十个机器学习(ML)组件组成。每次问答，多个组件的链式运转需调用大量算力和相应云服务，从而产生开支',
      '# 我们始终致力于平衡组件复杂度和运算低成本，打造高性价比的智能方案',
    ],
  },
  {
    title: '我如何联系团队?',
    content: [
      '你好，我们总是期待和您交流:) 不只是反馈、建议和批评，还有你对AI+科研的奇思妙想。',
      '欢迎添加用户服务微信 hello-xiangqian',
    ],
  },
];

function FAQItem(props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={styles.faq_list_item}
      style={{ maxHeight: isOpen ? '1000px' : '' }}
    >
      <div
        className={styles.faq_list_item_title}
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        {props.title}
        <Image
          className={styles.faq_list_item_drop_down}
          style={{ transform: isOpen ? 'rotate(-90deg)' : 'rotate(0deg)' }}
          src={DropdownIcon}
          width={12}
          height={12}
          alt="drop_down"
        />
      </div>
      <div className={styles.faq_list_item_detail}>
        {props.content.map((item, index) => (
          <p key={index}>{item}</p>
        ))}
      </div>
    </div>
  );
}

export default function HomeFAQList() {
  return (
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
          {faqData.map((item, index) => (
            <FAQItem key={index} title={item.title} content={item.content} />
          ))}
        </div>
      </div>
    </div>
  );
}
