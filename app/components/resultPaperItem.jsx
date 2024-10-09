'use client';

import Icon, {
  DownOutlined,
  LoadingOutlined,
  UpOutlined,
} from '@ant-design/icons';
import { Modal, Skeleton, Tooltip } from 'antd';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import BookIcon from '../img/book.png';
import LockIcon from '../img/lock.png';
import UserIcon from '../img/user.png';
import { searchActor } from '../models/searchMachine';
import {
  fetchAbstractAndTranslation as fetchAbstractAndTranslationAsync,
  fetchReadingGuide as fetchReadingGuideAsync,
  fetchSimiliar as fetchSimiliarAsync,
} from '../service';
import CitationText from './citationText.js';
import styles from './resultPaperItem.module.scss';

const SimiliarIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="5" cy="6" r="2.5" stroke="#FFCF6D" />
    <circle cx="9" cy="13" r="1.5" stroke="#FFCF6D" />
    <circle cx="13.5" cy="6.5" r="2" stroke="#FFCF6D" />
    <rect
      opacity="0.6"
      x="7.06995"
      y="6"
      width="4.37062"
      height="1"
      transform="rotate(4.01078 7.06995 6)"
      fill="#FFCF6D"
    />
    <rect
      opacity="0.6"
      x="6.90393"
      y="8"
      width="4.37062"
      height="1"
      transform="rotate(64.6814 6.90393 8)"
      fill="#FFCF6D"
    />
    <rect
      opacity="0.6"
      x="12.3826"
      y="8.58899"
      width="4.37062"
      height="1"
      transform="rotate(126.088 12.3826 8.58899)"
      fill="#FFCF6D"
    />
  </svg>
);

const AbstractIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4.64789 9H3L5.51091 2H7.49264L10 9H8.35211L6.53019 3.59961H6.47336L4.64789 9ZM4.5449 6.24854H8.43734V7.40381H4.5449V6.24854Z"
      fill="#00A7EA"
    />
    <rect
      opacity="0.4"
      x="11"
      y="6"
      width="4"
      height="2"
      rx="1"
      fill="#00A7EA"
    />
    <rect
      opacity="0.4"
      x="3"
      y="10"
      width="12"
      height="2"
      rx="1"
      fill="#00A7EA"
    />
    <rect
      opacity="0.4"
      x="3"
      y="13"
      width="12"
      height="2"
      rx="1"
      fill="#00A7EA"
    />
  </svg>
);

const GuideIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6.5 5L8.00189 8.33123L11 10L8.00189 11.6688L6.5 15L4.99811 11.6688L2 10L4.99811 8.33123L6.5 5Z"
      fill="#64DBBD"
    />
    <path
      opacity="0.6"
      d="M11 2L12.0013 4.33186L14 5.5L12.0013 6.66814L11 9L9.99874 6.66814L8 5.5L9.99874 4.33186L11 2Z"
      fill="#64DBBD"
    />
    <path
      opacity="0.6"
      d="M13 9L14.0013 11.3319L16 12.5L14.0013 13.6681L13 16L11.9987 13.6681L10 12.5L11.9987 11.3319L13 9Z"
      fill="#64DBBD"
    />
  </svg>
);

const ArticleIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M13 11V14C13 14.5523 12.553 15 12.0007 15C10.3159 15 6.81832 15 3.99894 15C3.44666 15 3 14.5523 3 14V6C3 5.44772 3.44772 5 4 5H7"
      stroke="black"
      stroke-width="1.2"
      stroke-linecap="round"
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M14.4062 3.14853C14.7169 3.14853 14.9724 3.38463 15.0031 3.68718C15.0052 3.70735 15.0062 3.72782 15.0062 3.74853L15.0062 8.54853C15.0062 8.8799 14.7376 9.14853 14.4062 9.14853C14.0749 9.14853 13.8062 8.8799 13.8062 8.54853V5.19705L7.17602 11.8273C6.94171 12.0616 6.56181 12.0616 6.32749 11.8273C6.09318 11.5929 6.09318 11.213 6.32749 10.9787L12.9577 4.34853H9.60623C9.27485 4.34853 9.00623 4.0799 9.00623 3.74853C9.00623 3.41716 9.27485 3.14853 9.60623 3.14853L14.4062 3.14853Z"
      fill="black"
    />
  </svg>
);

const DownloadIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3 12V13.5C3 14.0523 3.44684 14.5 3.99913 14.5C7.53093 14.5 12.0331 14.5 14.0024 14.5C14.5546 14.5 15 14.0523 15 13.5V12"
      stroke="black"
      stroke-width="1.2"
      stroke-linecap="round"
    />
    <path
      d="M9.6 4C9.6 3.66863 9.33137 3.4 9 3.4C8.66863 3.4 8.4 3.66863 8.4 4L9.6 4ZM8.57574 12.4243C8.81005 12.6586 9.18995 12.6586 9.42426 12.4243L13.2426 8.60589C13.477 8.37157 13.477 7.99167 13.2426 7.75736C13.0083 7.52304 12.6284 7.52304 12.3941 7.75736L9 11.1515L5.60589 7.75736C5.37157 7.52304 4.99167 7.52304 4.75736 7.75736C4.52304 7.99167 4.52304 8.37157 4.75736 8.60589L8.57574 12.4243ZM8.4 4L8.4 12L9.6 12L9.6 4L8.4 4Z"
      fill="black"
    />
  </svg>
);

const QuoteIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="2.33334"
      y="5"
      width="5.33333"
      height="5.33333"
      stroke="black"
      stroke-width="1.2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M7.66669 10.3334V10.5279C7.66669 12.043 6.81068 13.428 5.45554 14.1056L5.00002 14.3334"
      stroke="black"
      stroke-width="1.2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <rect
      x="10.3333"
      y="5"
      width="5.33333"
      height="5.33333"
      stroke="black"
      stroke-width="1.2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M15.6667 10.3334V10.5279C15.6667 12.043 14.8107 13.428 13.4555 14.1056L13 14.3334"
      stroke="black"
      stroke-width="1.2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

const CheckIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M1.33333 0.000244141H10.6667C11.4 0.000244141 12 0.600244 12 1.33358V10.6669C12 11.4002 11.4 12.0002 10.6667 12.0002H1.33333C0.6 12.0002 0 11.4002 0 10.6669V1.33358C0 0.600244 0.6 0.000244141 1.33333 0.000244141ZM9.06667 3.06691L10 4.00024L4.66667 9.33358L2 6.66691L2.93333 5.73358L4.66667 7.46691L9.06667 3.06691Z"
      fill="#1D192B"
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
    fetchedAbstract,
    paperAbstractZh,
    paperAbstract,
    // selected,
  } = props.data;

  const { isBorderVisible } = props;

  // const [currPaperAbstract, setCurrPaperAbstract] = useState('');
  // const [currPaperAbstractZh, setCurrPaperAbstractZh] = useState('');
  const [isGuideModalVisible, setIsGuideModalVisible] = useState(false);
  const [guideContent, setGuideContent] = useState('');
  const [similiarContent, setSimiliarContent] = useState([]);
  const [isQuoteVisible, setIsQuoteVisible] = useState(false);
  const [isSimiliarLoading, setIsSimiliarLoading] = useState(false);
  const [isAbstractLoading, setIsAbstractLoading] = useState(false);
  const [isGuideLoading, setIsGuideLoading] = useState(false);
  const [contentStatus, setContentStatus] = useState('closed');
  const [isAbstractFullVisible, setIsAbstractFullVisible] = useState(false);
  const [isEnAbstractVisible, setIsEnAbstractVisible] = useState(false);

  const abstractZh = useMemo(() => {
    if (isAbstractFullVisible) {
      return paperAbstractZh;
    }
    if (!paperAbstractZh) {
      return;
    }
    if (paperAbstractZh.replace(/\r?\n$/, '').length > 145) {
      return `${paperAbstractZh.slice(0, 145)}...`;
    }
    return paperAbstractZh;
  }, [paperAbstractZh, isAbstractFullVisible]);

  const toggleSimiliarContent = async (paper) => {
    try {
      if (contentStatus === 'similiar') {
        setContentStatus('closed');
        return;
      }
      setContentStatus('similiar');
      if (isSimiliarLoading) {
        return;
      }
      if (similiarContent.length) {
        return;
      }

      setIsSimiliarLoading(true);

      const res = await fetchSimiliarAsync(paper);
      if (!res.ok) {
        throw new Error('Failed search');
      }
      const content = await res.json();
      setSimiliarContent(content);
      return;
    } catch (error) {
      console.error(error);
    } finally {
      setIsSimiliarLoading(false);
    }
  };

  const toggleAbstractContent = async (paper) => {
    try {
      if (contentStatus === 'abstract') {
        setContentStatus('closed');
        return;
      }
      setContentStatus('abstract');
      if (paper.paperAbstractZh) {
        return;
      }
      if (fetchedAbstract && !paper.paperAbstract) {
        return;
      }
      if (isAbstractLoading) {
        return;
      }

      setIsAbstractLoading(true);

      const res = await fetchAbstractAndTranslationAsync(paper);
      if (!res.ok) {
        throw new Error('Failed search');
      }
      const data = await res.json();
      searchActor.send({
        type: 'UPDATE_RESPONSE',
        value: { ...data, fetchedAbstract: true },
      });
      // setCurrPaperAbstract(data.paperAbstract);
      // setCurrPaperAbstractZh(data.paperAbstractZh);
      return;
    } catch (error) {
      console.error(error);
    } finally {
      setIsAbstractLoading(false);
    }
  };

  const toggleGuideContent = async (paper) => {
    if (contentStatus === 'guide') {
      setContentStatus('closed');
      return;
    }
    setContentStatus('guide');
    if (guideContent || isGuideLoading) {
      return;
    }

    fetchGuideContent(paper);
  };

  const fetchGuideContent = async (paper) => {
    try {
      setIsGuideLoading(true);
      const res = await fetchReadingGuideAsync(paper);
      if (!res.ok) {
        throw new Error('Failed search');
      }
      const data = await res.json();
      setGuideContent(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsGuideLoading(false);
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
          <h4>{title}</h4>
        </Tooltip>
        {/* {selected ? (
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
                searchActor.send({ type: 'TOGGLE_SELECT', value: id });
              }}
            >
              <Image
                src={SelectedWhiteButtonIcon.src}
                width={18}
                height={18}
                alt=""
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
                searchActor.send({ type: 'TOGGLE_SELECT', value: id });
              }}
            >
              <Image
                src={SelectedActiveButtonIcon.src}
                width={18}
                height={18}
                alt=""
              />
              选中本文
            </Button>
          </ConfigProvider>
        )} */}
      </div>

      <div className={styles.content_card_footer}>
        <div className={styles.content_card_footer_journal}>
          <Image src={BookIcon.src} width={16} height={16} alt="BookIcon" />
        </div>

        <Tooltip title={journal}>
          <div
            className={styles.content_card_footer_journal_text}
            onClick={() => {
              if (!isGuideLoading) {
                fetchGuideContent(props.data);
              }
              setIsGuideModalVisible(true);
            }}
          >
            {journal}
          </div>
        </Tooltip>

        <Modal
          title={title}
          open={isGuideModalVisible}
          footer={null}
          wrapClassName={styles.quoteModal}
          onCancel={() => {
            setIsGuideModalVisible(false);
          }}
        >
          <Skeleton
            active
            loading={isGuideLoading}
            style={{ padding: '20px' }}
            paragraph={{ rows: 3 }}
          >
            <div>{guideContent}</div>
          </Skeleton>
        </Modal>

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
      <div className={styles.content_card_response}>
        <Skeleton active loading={!response} paragraph={{ rows: 0 }}>
          {response || '由于版权问题，暂时无法查看简介'}
        </Skeleton>
      </div>

      <div className={styles.content_card_btn}>
        <div className={styles.content_card_btn_main}>
          <button
            className={`${styles.content_card_btn_related} ${contentStatus === 'similiar' && styles.content_card_btn_related_drop}`}
            onClick={() => {
              umami.track('similar button');
              toggleSimiliarContent(props.data);
            }}
          >
            <Icon component={SimiliarIcon} />
            相似文献
            {isSimiliarLoading && <LoadingOutlined />}
            {!isSimiliarLoading && contentStatus === 'similiar' && (
              <UpOutlined
                className={styles.content_card_btn_related_drop_icon}
              />
            )}
            {!isSimiliarLoading && contentStatus !== 'similiar' && (
              <DownOutlined
                className={styles.content_card_btn_related_drop_icon}
              />
            )}
          </button>
          <button
            className={`${styles.content_card_btn_abstract} ${contentStatus === 'abstract' && styles.content_card_btn_abstract_drop}`}
            onClick={() => {
              toggleAbstractContent(props.data);
            }}
            data-umami-event="abstract button"
          >
            <Icon component={AbstractIcon} />
            查看摘要
            {isAbstractLoading && <LoadingOutlined />}
            {!isAbstractLoading && contentStatus === 'abstract' && (
              <UpOutlined
                className={styles.content_card_btn_abstract_drop_icon}
              />
            )}
            {!isAbstractLoading && contentStatus !== 'abstract' && (
              <DownOutlined
                className={styles.content_card_btn_abstract_drop_icon}
              />
            )}
          </button>
          <button
            className={`${styles.content_card_btn_abstract} ${contentStatus === 'guide' && styles.content_card_btn_abstract_drop}`}
            onClick={() => {
              toggleGuideContent(props.data);
            }}
            data-umami-event="guide button"
          >
            <Icon component={GuideIcon} />
            查看导读
            {isGuideLoading && <LoadingOutlined />}
            {!isGuideLoading && contentStatus === 'guide' && (
              <UpOutlined
                className={styles.content_card_btn_abstract_drop_icon}
              />
            )}
            {!isGuideLoading && contentStatus !== 'guide' && (
              <DownOutlined
                className={styles.content_card_btn_abstract_drop_icon}
              />
            )}
          </button>
        </div>
        <div className={styles.content_card_btn_sub}>
          <button
            className={styles.content_card_btn_download}
            onClick={() => {
              if (openAccessPdf) {
                umami.track('source button');
                window.open(openAccessPdf.url, '_blank');
              } else if (doi) {
                umami.track('pdf button');
                window.open(doi, '_blank');
              } else {
                alert('由于版权原因，本文暂不支持查看原文');
              }
            }}
          >
            {openAccessPdf ? (
              <>
                <Icon component={DownloadIcon} />
                下载
              </>
            ) : (
              <>
                <Icon component={ArticleIcon} />
                跳转原文
              </>
            )}
          </button>
          <button
            className={styles.content_card_btn_quote}
            onClick={() => {
              setIsQuoteVisible(true);
            }}
            data-umami-event="ref button"
          >
            <Icon component={QuoteIcon} />
            引用
          </button>
        </div>
      </div>

      {contentStatus === 'similiar' && !isSimiliarLoading && (
        <ul className={styles.content_card_paper_similiar}>
          {similiarContent.length > 0 ? (
            similiarContent.map((item, index) => (
              <li key={item.id}>
                <b>{index + 1}</b>
                <span
                  onClick={() => {
                    window.open(item.doi, '_blank');
                  }}
                >
                  {item.authors[0]}
                  {item.authors.length > 1 && '等'}，{item.year}.
                </span>{' '}
                {item.response}
                <i>
                  被引{item.citationCount}次 | {item.journalRank}
                </i>
              </li>
            ))
          ) : (
            <li>
              抱歉，未找到相似文献，我们正在努力完善中，可以试试其他文献～
            </li>
          )}
        </ul>
      )}

      {contentStatus === 'abstract' && !isAbstractLoading && (
        <div className={styles.content_card_paperAbstract}>
          {!paperAbstract ? (
            <span>由于版权问题，我们无法提供本文的摘要，建议查看原文。</span>
          ) : (
            <>
              <div className={styles.content_card_abstract_switch}>
                <label>
                  {isEnAbstractVisible && (
                    <Icon
                      className={styles.content_card_abstract_switch_icon}
                      component={CheckIcon}
                    />
                  )}
                  <input
                    type="checkbox"
                    value={isEnAbstractVisible}
                    onChange={(v) => {
                      setIsEnAbstractVisible(v.target.checked);
                    }}
                  />
                  显示英文原文
                </label>
              </div>
              <div>
                <div>
                  <span>{abstractZh}</span>
                  {!isAbstractFullVisible && (
                    <button
                      className={styles.content_card_abstract_more_btn}
                      onClick={() => {
                        setIsAbstractFullVisible(true);
                      }}
                    >
                      展开
                    </button>
                  )}
                </div>
                {isEn && isEnAbstractVisible && (
                  <div className={styles.content_card_abstract_en}>
                    {paperAbstract}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {contentStatus === 'guide' && !isGuideLoading && (
        <div className={styles.content_card_paperAbstract}>{guideContent}</div>
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
        <span style={{ fontWeight: 'bold' }}>{doi}</span>
        <CitationText bibtex={bibtex} template="apa" />
      </Modal>
    </div>
  );
}
