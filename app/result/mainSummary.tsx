import { useSelector } from '@xstate/react';
import { Skeleton } from 'antd';
import Image from 'next/image';
import { useState } from 'react';
import ArrowIcon from '../icons/right_arrow_icon.svg';
import { searchActor } from '../models/searchMachine';
import styles from './mainSummary.module.scss';

const MainSummary = (props: {}) => {
  const [isContentOpen, setIsContentOpen] = useState(true);
  const state = useSelector(searchActor, (state) => state);
  const summaryConcept = useSelector(
    searchActor,
    (state) => state.context.summaryConcept
  );
  const summaryQueryTerms = useSelector(
    searchActor,
    (state) => state.context.summaryQueryTerms
  );
  const summaryBackground = useSelector(
    searchActor,
    (state) => state.context.summaryBackground
  );
  const isLoadingPapers = state.matches({
    viewing: {
      fetchingPapers: 'fetching',
    },
  });

  const isLoadingSummaryConcept = state.matches({
    viewing: {
      fetchingSummaryConcept: 'fetching',
    },
  });

  const isLoadingSummaryQueryTerms = state.matches({
    viewing: {
      fetchingSummaryQueryTerms: 'fetching',
    },
  });

  const isLoadingSummaryBackground = state.matches({
    viewing: {
      fetchingSummaryBackground: 'fetching',
    },
  });

  return (
    <div
      className={styles.main_summary}
      style={{
        maxHeight: `${isContentOpen ? '2000px' : '100px'}`,
        paddingBottom: `${isContentOpen ? '15px' : '0px'}`,
      }}
    >
      {!isLoadingSummaryConcept && !isLoadingPapers && (
        <div
          className={styles.main_summary_content_mask}
          onClick={() => {
            setIsContentOpen(!isContentOpen);
          }}
        >
          {isContentOpen ? (
            <Image
              alt=""
              className={styles.main_summary_content_switch_close}
              width={20}
              height={20}
              src={ArrowIcon.src}
            />
          ) : (
            <Image
              alt=""
              className={styles.main_summary_content_switch_open}
              width={20}
              height={20}
              src={ArrowIcon.src}
            />
          )}
        </div>
      )}
      <div className={styles.main_summary_content}>
        <div className={styles.main_summary_content_container}>
          <div className={styles.main_summary_content_left}>
            <Skeleton
              active
              loading={isLoadingSummaryConcept}
              style={{ padding: '10px' }}
              paragraph={{ rows: 2 }}
            >
              <div className={styles.main_summary_content_title}>概念</div>
              <div className={styles.main_summary_content_text}>
                {summaryConcept}
              </div>
            </Skeleton>
          </div>
          <div className={styles.main_summary_content_right}>
            <Skeleton
              active
              loading={isLoadingSummaryBackground}
              style={{ padding: '10px' }}
              paragraph={{ rows: 2 }}
            >
              <div className={styles.main_summary_content_title}>背景</div>
              <div className={styles.main_summary_content_text}>
                {summaryBackground}
              </div>
            </Skeleton>
          </div>
        </div>
        <div className={styles.main_summary_content_sub}>
          <Skeleton
            active
            loading={isLoadingSummaryQueryTerms}
            style={{ padding: '10px' }}
            paragraph={{ rows: 2 }}
          >
            <b>相关术语</b>
            {summaryQueryTerms}
          </Skeleton>
        </div>
      </div>
    </div>
  );
};

export default MainSummary;
