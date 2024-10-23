'use client';
import { Modal, Skeleton, Tooltip } from 'antd';
import Image from 'next/image';
import { useState } from 'react';
import BookIcon from '../img/book.png';
import LockIcon from '../img/lock.png';
import UserIcon from '../img/user.png';
import { fetchJournalInfo as fetchJournalInfoAsync } from '../service';
import styles from './resultPaperSubInfo.module.scss';

const ResultPaperSubInfo = ({ paper, mode, isGuideLoading }) => {
  const {
    authors,
    journal,
    journalRank,
    year,
    citationCount,
    isOpenAccess,
    fundGrantNumber,
    affiliation,
    subject,
    dataType,
  } = paper;

  const [isJournalInfoModalVisible, setIsJournalInfoModalVisible] =
    useState(false);
  const [isJournalInfoLoading, setIsJournalInfoLoading] = useState(false);
  const [journalInfo, setJournalInfo] = useState('');

  const fetchJournalInfo = async (paper) => {
    try {
      setIsJournalInfoLoading(true);
      const res = await fetchJournalInfoAsync(paper);
      if (!res.ok) {
        throw new Error('Failed search');
      }
      const data = await res.json();
      setJournalInfo(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsJournalInfoLoading(false);
    }
  };

  return (
    <div className={styles.content_card_footer}>
      <div className={styles.content_card_footer_journal}>
        <Image src={BookIcon.src} width={16} height={16} alt="BookIcon" />
      </div>
      {dataType != 'fund_cn' && (
        <Tooltip title={journal}>
          <div
            className={styles.content_card_footer_journal_text}
            onClick={() => {
              if (!isGuideLoading) {
                fetchJournalInfo(paper);
              }
              setIsJournalInfoModalVisible(true);
            }}
          >
            {journal}
          </div>
        </Tooltip>
      )}
      {dataType === 'fund_cn' && (
        <>
          <div className={styles.content_card_footer_journal_text_fund}>
            {journal}
          </div>
          {journalRank && (
            <>
              <div className={styles.content_card_footer_division} />
              <div className={styles.content_card_footer_jcr}>
                {journalRank}
              </div>
            </>
          )}
          <div className={styles.content_card_footer_division} />
          <div className={styles.content_card_footer_fund_grant_number}>
            {subject}
          </div>
          <div className={styles.content_card_footer_division} />
          <div className={styles.content_card_footer_fund_grant_number}>
            {fundGrantNumber}
          </div>
          <div className={styles.content_card_footer_division} />
          <div className={styles.content_card_footer_affiliation}>
            {affiliation}
          </div>
        </>
      )}
      <Modal
        title={journal}
        open={isJournalInfoModalVisible}
        footer={null}
        wrapClassName={styles.quoteModal}
        onCancel={() => {
          setIsJournalInfoModalVisible(false);
        }}
      >
        <Skeleton
          active
          loading={isJournalInfoLoading}
          style={{ padding: '20px' }}
          paragraph={{ rows: 3 }}
        >
          <div>{journalInfo}</div>
        </Skeleton>
      </Modal>
      <div className={styles.content_card_footer_division} />
      <div className={styles.content_card_footer_authors}>
        <Image src={UserIcon.src} width={16} height={16} alt="UserIcon" />
        {dataType === 'fund_cn' ? authors[0] : authors[0] + '等'}
      </div>
      <div className={styles.content_card_footer_division} />
      <div className={styles.content_card_footer_years}>{year || 2000}</div>
      {mode !== 'fund' && (
        <>
          <div className={styles.content_card_footer_division} />
          <div className={styles.content_card_footer_jcr}>{journalRank}</div>
          <div className={styles.content_card_footer_division} />
          <div className={styles.content_card_footer_citationCount}>
            被引
            <span className={styles.b}>{citationCount}</span>次
          </div>
          <>
            {isOpenAccess && (
              <>
                <div className={styles.content_card_footer_division} />

                <div className={styles.content_card_footer_openAccess}>
                  <Image
                    src={LockIcon.src}
                    width={12}
                    height={12}
                    alt="LockIcon"
                  />
                  <span>open access</span>
                </div>
              </>
            )}
          </>
        </>
      )}
    </div>
  );
};

export default ResultPaperSubInfo;
