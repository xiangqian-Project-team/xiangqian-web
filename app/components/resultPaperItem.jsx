'use client';

import Icon, { DownOutlined, UpOutlined } from '@ant-design/icons';
import { Button, ConfigProvider, Modal, Skeleton, Tooltip } from 'antd';
import Image from 'next/image';
import { useState } from 'react';
import CheckIcon from '../icons/icon_check.svg';
import NoneCheckIcon from '../icons/icon_none_check.svg';
import BookIcon from '../img/book.png';
import LockIcon from '../img/lock.png';
import UserIcon from '../img/user.png';
import {
  fetchAbstract as fetchAbstractAsync,
  fetchReferences as fetchReferencesAsync,
} from '../service';
import CitationText from './citationText.js';
import styles from './resultPaperItem.module.scss';

const QuoteSvg = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="3"
      y="4"
      width="4"
      height="4"
      stroke="#00A650"
      stroke-width="1.2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M7 8V8C7 9.22573 6.30747 10.3463 5.21115 10.8944L5 11"
      stroke="#00A650"
      stroke-width="1.2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <rect
      x="9"
      y="4"
      width="4"
      height="4"
      stroke="#00A650"
      stroke-width="1.2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M13 8V8C13 9.22573 12.3075 10.3463 11.2111 10.8944L11 11"
      stroke="#00A650"
      stroke-width="1.2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

export default function ResultPaperItem(props) {
  const {
    authors,
    citationCount,
    journal,
    journalRank,
    title,
    id,
    year,
    response,
    isOpenAccess,
    openAccessPdf,
    bibtex,
    doi,
  } = props.data;

  const [paperAbstract, setPaperAbstract] = useState('');
  const [paperAbstractZh, setPaperAbstractZh] = useState('');
  const [references, setReferences] = useState('');
  const [isQuoteVisible, setIsQuoteVisible] = useState(false);
  const [isAbstractLoading, setIsAbstractLoading] = useState(false);
  const [isReferencesLoading, setIsReferencesLoading] = useState(false);
  const [contentStatus, setContentStatus] = useState('closed');

  const toggleAbstract = async (id) => {
    try {
      if (contentStatus === 'abstract') {
        setContentStatus('closed');
        return;
      }
      if (paperAbstract) {
        setContentStatus('abstract');
        return;
      }

      setIsAbstractLoading(true);

      const res = await fetchAbstractAsync(id);
      if (!res.ok) {
        throw new Error('Failed search');
      }
      const { abstract, abstractZh } = await res.json();
      setPaperAbstract(abstract || 'No abstract');
      setPaperAbstractZh(abstractZh);
      setContentStatus('abstract');
    } catch (error) {
      console.error(error);
    } finally {
      setIsAbstractLoading(false);
    }
  };

  const toggleReferences = async (id) => {
    try {
      if (contentStatus === 'references') {
        setContentStatus('closed');
        return;
      }
      if (references) {
        setContentStatus('references');
        return;
      }

      setIsReferencesLoading(true);

      const res = await fetchReferencesAsync(id);
      if (!res.ok) {
        throw new Error('Failed search');
      }
      const { references: refs } = await res.json();
      setReferences(refs);
      setContentStatus('references');
    } catch (error) {
      console.error(error);
    } finally {
      setIsReferencesLoading(false);
    }
  };

  return (
    <div className={styles.content_card}>
      <div className={styles.content_card_title}>
        {props.checkedPapers.includes(id) ? (
          <Image
            alt=""
            className={styles.content_card_check}
            src={CheckIcon}
            onClick={() => {
              const newCheckedPapers = props.checkedPapers.filter(
                (item) => item !== id
              );
              props.setCheckedPapers(newCheckedPapers);
            }}
          />
        ) : (
          <Image
            alt=""
            className={styles.content_card_check}
            src={NoneCheckIcon}
            onClick={() => {
              const newCheckedPapers = [...props.checkedPapers, id];
              props.setCheckedPapers(newCheckedPapers);
            }}
          />
        )}
        <Tooltip title={title}>
          <span>{title}</span>
        </Tooltip>
      </div>

      <div className={styles.content_card_footer}>
        <div className={styles.content_card_footer_journal}>
          <Image src={BookIcon.src} width={16} height={16} alt="BookIcon" />
        </div>

        <Tooltip title={journal}>
          <div className={styles.content_card_footer_journal_text}>
            {journal}
          </div>
        </Tooltip>

        <div className={styles.content_card_footer_division} />
        <div className={styles.content_card_footer_authors}>
          <Image src={UserIcon.src} width={16} height={16} alt="UserIcon" />
          {authors[0]}等
        </div>
        <div className={styles.content_card_footer_division} />
        <div className={styles.content_card_footer_years}>{year || 2000}</div>
        <div className={styles.content_card_footer_division} />
        <div className={styles.content_card_footer_jcr}>{journalRank}</div>
        <div className={styles.content_card_footer_division} />
        <div className={styles.content_card_footer_citationCount}>
          被引
          <span className={styles.b}>{citationCount}</span>次
        </div>
        {isOpenAccess && (
          <>
            <div className={styles.content_card_footer_division} />

            <div className={styles.content_card_footer_openAccess}>
              <Image src={LockIcon.src} width={12} height={12} alt="LockIcon" />
              <span>open access</span>
            </div>
          </>
        )}
      </div>

      <div className={styles.content_card_crossline} />

      <Skeleton active loading={!response} paragraph={{ rows: 0 }}>
        <div className={styles.content_card_response}>
          {response || '由于版权问题，暂时无法查看简介'}
        </div>
      </Skeleton>

      <div className={styles.content_card_btn}>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#03A097',
            },
            components: {
              Button: {
                paddingInlineSM: 34,
                defaultColor: '#000',
                defaultBg: '#EEEEEE',
                borderRadius: 20,
                borderColor: 'none',
              },
            },
          }}
        >
          <Button
            size="small"
            onClick={() => {
              setIsQuoteVisible(true);
            }}
          >
            <div className={styles.content_card_btn_quote}>
              <Icon component={QuoteSvg} />
              引用
            </div>
          </Button>
        </ConfigProvider>

        <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#03A097',
            },
            components: {
              Button: {
                paddingInlineSM: 34,
                defaultColor: '#000',
                defaultBg: '#EEEEEE',
                borderRadius: 30,
                borderColor: 'none',
              },
            },
          }}
        >
          <Button
            size="small"
            loading={isReferencesLoading}
            onClick={() => {
              toggleReferences(id);
            }}
          >
            {contentStatus === 'references' ? (
              <>
                收起
                <UpOutlined style={{ color: '#00A650', fontSize: '8px' }} />
              </>
            ) : (
              <>
                参考文献
                <DownOutlined style={{ color: '#00A650', fontSize: '8px' }} />
              </>
            )}
          </Button>
          <Button
            size="small"
            loading={isAbstractLoading}
            onClick={() => {
              toggleAbstract(id);
            }}
          >
            {contentStatus === 'abstract' ? (
              <>
                收起
                <UpOutlined style={{ color: '#00A650', fontSize: '8px' }} />
              </>
            ) : (
              <>
                查看摘要
                <DownOutlined style={{ color: '#00A650', fontSize: '8px' }} />
              </>
            )}
          </Button>
          <Button
            size="small"
            onClick={() => {
              if (openAccessPdf) {
                window.open(openAccessPdf.url, '_blank');
              } else if (doi) {
                window.open(`https://doi.org/${doi}`, '_blank');
              } else {
                alert('由于版权原因，本文暂不支持查看原文');
              }
            }}
          >
            {openAccessPdf ? '查看PDF' : '跳转原文'}
          </Button>
        </ConfigProvider>
      </div>

      {contentStatus === 'abstract' && (
        <div className={styles.content_card_paperAbstract}>
          {paperAbstract != 'No abstract' ? (
            <>
              <span>摘要：{paperAbstractZh}</span>
              <span>摘要原文：{paperAbstract}</span>
            </>
          ) : (
            <span>
              由于版权问题，我们无法提供本文的摘要，请点击「查看原文」前往官网查看。
            </span>
          )}
        </div>
      )}

      {contentStatus === 'references' && (
        <div className={styles.content_card_paperAbstract}>
          <span>{references}</span>
        </div>
      )}

      <Modal
        title="引用文章"
        open={isQuoteVisible}
        onCancel={() => {
          setIsQuoteVisible(false);
        }}
        footer={null}
        width={552}
        wrapClassName={styles.quoteModal}
      >
        <CitationText bibtex={bibtex} template="apa" />
      </Modal>
    </div>
  );
}
