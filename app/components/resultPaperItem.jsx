'use client';

import Icon, {
  CloseOutlined,
  DownOutlined,
  UpOutlined,
} from '@ant-design/icons';
import { Button, ConfigProvider, Modal, Popover, Tooltip } from 'antd';
import { BibtexParser } from 'bibtex-js-parser';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import CheckIcon from '../icons/icon_check.svg';
import NoneCheckIcon from '../icons/icon_none_check.svg';
import BookIcon from '../img/book.png';
import LockIcon from '../img/lock.png';
import UserIcon from '../img/user.png';
import textCopy from '../utils/textCopy';
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
    paperAbstract,
    authors,
    citationCount,
    journal,
    journalRank,
    title,
    paperId,
    year,
    responseZh,
    isOpenAccess,
    bibtex,
  } = props.data;
  const [paperAbstractZh, setPaperAbstractZh] = useState('');
  const [isQuoteVisible, setIsQuoteVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const [isAllDetailVisible, setIsAllDetailVisible] = useState(false);

  function capitalizeWords(str) {
    return str.replace(/\w\S*/g, (txt) => {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }

  function formatAuthors(authorsString) {
    return authorsString
      .split(' and ')
      .map((name) => {
        const [lastName, firstName] = name.split(' ');
        return `${lastName}, ${firstName.charAt(0)}.`;
      })
      .join(' & ');
  }

  const bibtexDataText = useMemo(() => {
    try {
      const bibtexData = BibtexParser.parseToJSON(bibtex)[0];
      const authorsFormatted = formatAuthors(bibtexData.author);
      const title = bibtexData.title;
      const journal = capitalizeWords(bibtexData.journal);
      const year = bibtexData.year;
      const volume = bibtexData.volume;
      const number = bibtexData.number ? `(${bibtexData.number})` : '';
      const pages = bibtexData.pages;
      return (
        <>
          {authorsFormatted} ({year}). {title}.{' '}
          <span style={{ fontStyle: 'italic' }}>
            {journal}, {volume}
          </span>
          {number ? `(${number})` : ''}, {pages}.
        </>
      );
    } catch (error) {
      console.error(error);
    }
  }, [bibtex]);

  const translate = async (queryText) => {
    try {
      if (isDetailVisible) {
        setIsDetailVisible(false);
        setIsAllDetailVisible(false);
        return;
      }

      setIsLoading(true);

      const params = { queryText };
      const { abstractZh } = await translateAsync(params);

      setPaperAbstractZh(abstractZh);
      setIsDetailVisible(true);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.content_card}>
      <div className={styles.content_card_title}>
        {props.checkedPapers.includes(paperId) ? (
          <Image
            alt=""
            className={styles.content_card_check}
            src={CheckIcon}
            onClick={() => {
              const newCheckedPapers = props.checkedPapers.filter(
                (item) => item !== paperId
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
              const newCheckedPapers = [...props.checkedPapers, paperId];
              props.setCheckedPapers(newCheckedPapers);
            }}
          />
        )}
        <Tooltip title={title}>
          <span>{title}</span>
        </Tooltip>
        <Popover
          content={
            <Button
              danger
              onClick={() => {
                props.setShowPapers(
                  props.showPapers.filter((item) => item.paperId !== paperId)
                );
              }}
            >
              确认本项研究⽆关，不再显⽰
            </Button>
          }
          trigger="click"
        >
          <Button type="text" icon={<CloseOutlined />} size="small" />
        </Popover>
      </div>

      <div className={styles.content_card_footer}>
        <div className={styles.content_card_footer_journal}>
          <Image src={BookIcon.src} width={16} height={16} alt="BookIcon" />
        </div>

        <Tooltip title={journal.name}>
          <div className={styles.content_card_footer_journal_text}>
            {journal.name}
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
          被引{citationCount}次
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

      <div className={styles.content_card_response}>
        {responseZh ||
          '在数字时代的浪潮中，虚拟与现实交织，科技的脚步从未停歇。在这个信息爆炸的时代，每个人都是知识的追寻者，也是信息的传递者。我们漫步在这片广阔的网络世界，寻找着自己的位置，探索着未知的领域。无数的数据像繁星一般'}
      </div>

      <div className={styles.content_card_btn}>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#00A650',
            },
            components: {
              Button: {
                paddingInlineSM: 34,
                defaultColor: '#00A650',
                defaultBg: '#F1F1F1',
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
              colorPrimary: '#00A650',
            },
            components: {
              Button: {
                paddingInlineSM: 48,
                defaultColor: '#00A650',
                defaultBg: '#F1F1F1',
              },
            },
          }}
        >
          <Button
            size="small"
            loading={isLoading}
            onClick={() => {
              translate(paperAbstract);
            }}
          >
            {isDetailVisible ? '收起' : '查看摘要'}

            {isDetailVisible ? (
              <UpOutlined style={{ color: '#00A650', fontSize: '8px' }} />
            ) : (
              <DownOutlined style={{ color: '#00A650', fontSize: '8px' }} />
            )}
          </Button>
        </ConfigProvider>
      </div>

      {isDetailVisible && (
        <div
          className={styles.content_card_paperAbstract}
          style={{
            height: isDetailVisible && isAllDetailVisible ? 'auto' : '',
          }}
        >
          <span>摘要：{paperAbstractZh || paperAbstract}</span>
          <span>
            {`摘要(原文)：`}
            {paperAbstract}
          </span>
          {!isAllDetailVisible && (
            <b
              className={styles.content_card_paperAbstract_all_button}
              onClick={() => {
                setIsAllDetailVisible(true);
              }}
            >
              查看全部
            </b>
          )}
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
        {bibtexDataText}

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: '#6F9EC1',
              },
            }}
          >
            <Button
              type="primary"
              onClick={() => {
                textCopy(bibtexDataText, '复制成功！！！');
              }}
              size="large"
            >
              复制到剪贴板
            </Button>
          </ConfigProvider>
        </div>
      </Modal>
    </div>
  );
}
