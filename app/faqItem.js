'use client';
import Image from 'next/image';
import { useState } from 'react';
import DropdownIcon from './icons/drop_down_icon.svg';
import styles from './page.module.scss';

export default function FAQItem(props) {
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
      <div>
        {props.content.map((item, index) => (
          <p key={index}>{item}</p>
        ))}
      </div>
    </div>
  );
}
