'use client';

import Icon, {
  DownOutlined,
  LoadingOutlined,
  UpOutlined,
} from '@ant-design/icons';
import { Modal, Skeleton, Tooltip } from 'antd';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import AbstractIcon from '../img/abstractIcon.svg';
import AchievementSimiliarIcon from '../img/achievementSimiliarIcon.svg';
import ArticleIcon from '../img/articleIcon.svg';
import CheckIcon from '../img/checkIcon.svg';
import DownloadIcon from '../img/downloadIcon.svg';
import FundSimiliarIcon from '../img/fundSimiliarIcon.svg';
import GuideIcon from '../img/guideIcon.svg';
import QuoteIcon from '../img/quoteIcon.svg';
import SimiliarIcon from '../img/similiarIcon.svg';
import { searchActor } from '../models/searchMachine';
import {
  fetchAbstractAndTranslation as fetchAbstractAndTranslationAsync,
  fetchFundSimiliar as fetchFundSimiliarAsync,
  fetchReadingGuide as fetchReadingGuideAsync,
  fetchSimiliar as fetchSimiliarAsync,
} from '../service';
import CitationText from './citationText.js';
import styles from './resultPaperItem.module.scss';
import ResultPaperSubInfo from './resultPaperSubInfo';

export default function ResultPaperItem(props) {
  const {
    title,
    response,
    openAccessPdf,
    bibtex,
    doi,
    fetchedAbstract,
    paperAbstractZh,
    paperAbstract,
    dataType,
  } = props.data;

  const { isBorderVisible, mode } = props;

  const [fundSimiliarContent, setFundSimiliarContent] = useState([]);
  const [isFundSimiliarLoading, setIsFundSimiliarLoading] = useState(false);
  const [isAchievementSimiliarLoading, setIsAchievementSimiliarLoading] =
    useState(false);
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

  const toggleFundSimiliarContent = async (paper) => {
    try {
      if (contentStatus === 'fund-similiar') {
        setContentStatus('closed');
        return;
      }
      setContentStatus('fund-similiar');
      if (isFundSimiliarLoading) {
        return;
      }
      if (fundSimiliarContent.length) {
        return;
      }

      setIsFundSimiliarLoading(true);

      const res = await fetchFundSimiliarAsync(paper);
      if (!res.ok) {
        throw new Error('Failed search');
      }
      const content = await res.json();
      setFundSimiliarContent(content);
      return;
    } catch (error) {
      console.error(error);
    } finally {
      setIsFundSimiliarLoading(false);
    }
  };

  const toggleAchievementSimiliarContent = async (paper) => {
    try {
      if (contentStatus === 'achievement-similiar') {
        setContentStatus('closed');
        return;
      }
      setContentStatus('achievement-similiar');
      if (isAchievementSimiliarLoading) {
        return;
      }
      if (similiarContent.length) {
        return;
      }

      setIsAchievementSimiliarLoading(true);

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
      setIsAchievementSimiliarLoading(false);
    }
  };

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
      </div>

      <ResultPaperSubInfo
        paper={props.data}
        mode={props.mode}
        isGuideLoading={isGuideLoading}
      />
      <div className={styles.content_card_response}>
        <Skeleton active loading={!response} paragraph={{ rows: 0 }}>
          {response || '由于版权问题，暂时无法查看简介'}
        </Skeleton>
      </div>

      <div className={styles.content_card_btn}>
        <div className={styles.content_card_btn_main}>
          {mode === 'fund' && (
            <>
              <button
                className={`${styles.content_card_btn_related} ${contentStatus === 'fund-similiar' && styles.content_card_btn_related_drop}`}
                onClick={() => {
                  // umami.track('similar button');
                  toggleFundSimiliarContent(props.data);
                }}
              >
                <Image src={FundSimiliarIcon} alt="" />
                相似课题
                {isFundSimiliarLoading && <LoadingOutlined />}
                {!isFundSimiliarLoading &&
                  contentStatus === 'fund-similiar' && (
                    <UpOutlined
                      className={styles.content_card_btn_related_drop_icon}
                    />
                  )}
                {!isFundSimiliarLoading &&
                  contentStatus !== 'fund-similiar' && (
                    <DownOutlined
                      className={styles.content_card_btn_related_drop_icon}
                    />
                  )}
              </button>
              <button
                className={`${styles.content_card_btn_related} ${contentStatus === 'achievement-similiar' && styles.content_card_btn_related_drop}`}
                onClick={() => {
                  // umami.track('similar button');
                  toggleAchievementSimiliarContent(props.data);
                }}
              >
                <Image src={AchievementSimiliarIcon} alt="" />
                相关成果
                {isAchievementSimiliarLoading && <LoadingOutlined />}
                {!isAchievementSimiliarLoading &&
                  contentStatus === 'achievement-similiar' && (
                    <UpOutlined
                      className={styles.content_card_btn_related_drop_icon}
                    />
                  )}
                {!isAchievementSimiliarLoading &&
                  contentStatus !== 'achievement-similiar' && (
                    <DownOutlined
                      className={styles.content_card_btn_related_drop_icon}
                    />
                  )}
              </button>
            </>
          )}
          {dataType !== 'fund_cn' && (
            <>
              <button
                className={`${styles.content_card_btn_related} ${contentStatus === 'similiar' && styles.content_card_btn_related_drop}`}
                onClick={() => {
                  umami.track('similar button');
                  toggleSimiliarContent(props.data);
                }}
              >
                <Image src={SimiliarIcon} alt="" />
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
                <Image src={AbstractIcon} alt="" />
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
                <Image src={GuideIcon} alt="" />
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
            </>
          )}
        </div>
        <div className={styles.content_card_btn_sub}>
          <button
            className={styles.content_card_btn_download}
            onClick={() => {
              if (dataType === 'fund_cn') {
                umami.track('fund source button');
                window.open(doi, '_blank');
                return;
              }
              if (dataType === 'wf') {
                umami.track('zh source button');
                window.open(
                  `https://kns.cnki.net/kns8s/defaultresult/index?classid=YSTT4HG0&korder=TI&kw=${title}`,
                  '_blank'
                );
                return;
              }
              if (dataType === 's2') {
                if (openAccessPdf) {
                  umami.track('pdf button');
                  window.open(openAccessPdf.url, '_blank');
                } else if (doi) {
                  umami.track('source button');
                  window.open(doi, '_blank');
                } else {
                  alert('由于版权原因，本文暂不支持查看原文');
                }
                return;
              }
              alert('由于版权原因，暂不支持查看原文');
            }}
          >
            {openAccessPdf ? (
              <>
                <Icon component={DownloadIcon} />
                下载
              </>
            ) : (
              <>
                <Image src={ArticleIcon} alt="" />
                {dataType === 'fund_cn' ? '跳转官网' : '跳转原文'}
              </>
            )}
          </button>
          {dataType !== 'fund_cn' && (
            <button
              className={styles.content_card_btn_quote}
              onClick={() => {
                setIsQuoteVisible(true);
              }}
              data-umami-event="ref button"
            >
              <Image src={QuoteIcon} alt="" />
              引用
            </button>
          )}
        </div>
      </div>

      {contentStatus === 'fund-similiar' && !isFundSimiliarLoading && (
        <ul className={styles.content_card_paper_similiar}>
          {fundSimiliarContent.length > 0 ? (
            fundSimiliarContent.map((item, index) => (
              <li key={item.id}>
                <b>{index + 1}</b>
                <span
                  onClick={() => {
                    if (item.dataType === 'wf') {
                      window.open(
                        `https://kns.cnki.net/kns8s/defaultresult/index?classid=YSTT4HG0&korder=TI&kw=${item.title}`,
                        '_blank'
                      );
                    } else {
                      window.open(item.doi, '_blank');
                    }
                  }}
                >
                  {item.authors[0]}
                  {item.authors.length > 1 && '等'}，{item.year}.
                </span>{' '}
                {item.dataType === 'fund_cn' || item.dataType === 'wf'
                  ? item.title
                  : item.response}{' '}
                <i>
                  {item.dataType === 'fund_cn'
                    ? item.journal
                    : `被引${item.citationCount}次`}{' '}
                  | {item.journalRank}
                </i>
              </li>
            ))
          ) : (
            <li>
              {dataType === 'fund_cn'
                ? '暂未查询到该项目的成果，深度搜索功能正在开发中…'
                : '抱歉，未找到相似文献，我们正在努力完善中，可以试试其他文献～'}
            </li>
          )}
        </ul>
      )}

      {contentStatus === 'achievement-similiar' &&
        !isAchievementSimiliarLoading && (
          <ul className={styles.content_card_paper_similiar}>
            {similiarContent.length > 0 ? (
              similiarContent.map((item, index) => (
                <li key={item.id}>
                  <b>{index + 1}</b>
                  <span
                    onClick={() => {
                      if (item.dataType === 'wf') {
                        window.open(
                          `https://kns.cnki.net/kns8s/defaultresult/index?classid=YSTT4HG0&korder=TI&kw=${item.title}`,
                          '_blank'
                        );
                      } else {
                        window.open(item.doi, '_blank');
                      }
                    }}
                  >
                    {item.authors[0]}
                    {item.authors.length > 1 && '等'}，{item.year}.
                  </span>{' '}
                  {item.dataType === 'wf' ? item.title : item.response}{' '}
                  <i>
                    被引{item.citationCount}次 | {item.journalRank}
                  </i>
                </li>
              ))
            ) : (
              <li>
                {dataType === 'fund_cn'
                  ? '暂未查询到该项目的成果，深度搜索功能正在开发中…'
                  : '抱歉，未找到相似文献，我们正在努力完善中，可以试试其他文献～'}
              </li>
            )}
          </ul>
        )}

      {contentStatus === 'similiar' && !isSimiliarLoading && (
        <ul className={styles.content_card_paper_similiar}>
          {similiarContent.length > 0 ? (
            similiarContent.map((item, index) => (
              <li key={item.id}>
                <b>{index + 1}</b>
                <span
                  onClick={() => {
                    if (item.dataType === 'wf') {
                      window.open(
                        `https://kns.cnki.net/kns8s/defaultresult/index?classid=YSTT4HG0&korder=TI&kw=${item.title}`,
                        '_blank'
                      );
                    } else {
                      window.open(item.doi, '_blank');
                    }
                  }}
                >
                  {item.authors[0]}
                  {item.authors.length > 1 && '等'}，{item.year}.
                </span>{' '}
                {item.dataType === 'wf' ? item.title : item.response}{' '}
                <i>
                  被引{item.citationCount}次 | {item.journalRank}
                </i>
              </li>
            ))
          ) : (
            <li>
              {dataType === 'fund_cn'
                ? '暂未查询到该项目的成果，深度搜索功能正在开发中…'
                : '抱歉，未找到相似文献，我们正在努力完善中，可以试试其他文献～'}
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
              {dataType === 's2' && (
                <div className={styles.content_card_abstract_switch}>
                  <label>
                    {isEnAbstractVisible && (
                      <Image
                        className={styles.content_card_abstract_switch_icon}
                        src={CheckIcon}
                        alt=""
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
              )}
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
                {dataType === 's2' && isEnAbstractVisible && (
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
