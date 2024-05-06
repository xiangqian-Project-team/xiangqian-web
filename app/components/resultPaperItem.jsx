'use client';

import Icon, { DownOutlined, UpOutlined } from '@ant-design/icons';
import { Button, ConfigProvider, Modal, Skeleton, Tooltip } from 'antd';
import Image from 'next/image';
import { useCallback, useState } from 'react';
import SelectedActiveButtonIcon from '../icons/selected_active_button_icon.svg';
import SelectedWhiteButtonIcon from '../icons/selected_white_button_icon.svg';
import BookIcon from '../img/book.png';
import LockIcon from '../img/lock.png';
import UserIcon from '../img/user.png';
import {
  fetchAbstract as fetchAbstractAsync,
  fetchReferences as fetchReferencesAsync,
} from '../service';
import CitationText from './citationText.js';
import styles from './resultPaperItem.module.scss';

const QuoteIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="1"
      y="3"
      width="4"
      height="4"
      stroke="black"
      stroke-width="1.2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M5 7V7C5 8.22573 4.30747 9.34626 3.21115 9.89443L3 10"
      stroke="black"
      stroke-width="1.2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <rect
      x="7"
      y="3"
      width="4"
      height="4"
      stroke="black"
      stroke-width="1.2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M11 7V7C11 8.22573 10.3075 9.34626 9.21115 9.89443L9 10"
      stroke="black"
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
    isEn,
  } = props.data;

  const { isBorderVisible } = props;

  const [paperAbstract, setPaperAbstract] = useState('');
  const [paperAbstractZh, setPaperAbstractZh] = useState('');
  const [references, setReferences] = useState('');
  const [isQuoteVisible, setIsQuoteVisible] = useState(false);
  const [isAbstractLoading, setIsAbstractLoading] = useState(false);
  const [isReferencesLoading, setIsReferencesLoading] = useState(false);
  const [contentStatus, setContentStatus] = useState('closed');

  const IsSelected = useCallback(
    (id) => {
      return props.checkedPapers.includes(id);
    },
    [props.checkedPapers]
  );

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
    <div
      className={
        isBorderVisible ? styles.content_card : styles.content_card_no_border
      }
    >
      <div className={styles.content_card_title}>
        <Tooltip title={title}>
          <span>{title}</span>
        </Tooltip>
        {IsSelected(id) ? (
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: '#000',
              },
              components: {
                Button: {
                  paddingInlineSM: 34,
                  defaultBorderColor: 'none',
                  defaultColor: '#000',
                  defaultBg: '#FFF',
                  defaultHoverBg: '#99E0ED',
                  defaultHoverBorderColor: '#EEE',
                },
              },
            }}
          >
            <Button
              className={styles.content_card_checked}
              active
              onClick={() => {
                const newCheckedPapers = props.checkedPapers.filter(
                  (item) => item !== id
                );
                props.setCheckedPapers(newCheckedPapers);
              }}
            >
              <Image
                src={SelectedActiveButtonIcon.src}
                width={18}
                height={18}
              />
              已选中
            </Button>
          </ConfigProvider>
        ) : (
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: '#000',
              },
              components: {
                Button: {
                  paddingInlineSM: 34,
                  defaultBorderColor: 'none',
                  defaultColor: '#000',
                  defaultBg: '#FFF',
                  defaultHoverBg: '#99E0ED',
                  defaultHoverBorderColor: '#EEE',
                },
              },
            }}
          >
            <Button
              className={styles.content_card_check}
              onClick={() => {
                const newCheckedPapers = [...props.checkedPapers, id];
                props.setCheckedPapers(newCheckedPapers);
              }}
            >
              <Image src={SelectedWhiteButtonIcon.src} width={18} height={18} />
              选中文本
            </Button>
          </ConfigProvider>
        )}
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
              colorPrimary: '#000',
            },
            components: {
              Button: {
                paddingInlineSM: 34,
                defaultColor: '#000',
                defaultHoverColor: '#FFF',
                defaultBg: '#EEEEEE',
                defaultHoverBg: '#068DA5',
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
              引用
              <Icon component={QuoteIcon} />
            </div>
          </Button>
        </ConfigProvider>

        <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#000',
            },
            components: {
              Button: {
                paddingInlineSM: 34,
                defaultColor: '#000',
                defaultHoverColor: '#FFF',
                defaultBg: '#EEEEEE',
                defaultHoverBg: '#068DA5',
              },
            },
          }}
        >
          {isEn && (
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
                  <UpOutlined
                    style={{
                      color: '#00A650',
                      fontSize: '8px',
                      marginLeft: '5px',
                    }}
                  />
                </>
              ) : (
                <>
                  参考文献
                  <DownOutlined
                    style={{
                      color: '#00A650',
                      fontSize: '8px',
                      marginLeft: '5px',
                    }}
                  />
                </>
              )}
            </Button>
          )}
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
                <UpOutlined
                  style={{
                    color: '#00A650',
                    fontSize: '8px',
                    marginLeft: '5px',
                  }}
                />
              </>
            ) : (
              <>
                查看摘要
                <DownOutlined
                  style={{
                    color: '#00A650',
                    fontSize: '8px',
                    marginLeft: '5px',
                  }}
                />
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
