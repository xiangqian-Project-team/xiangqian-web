import { useSelector } from '@xstate/react';
import { Skeleton } from 'antd';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import ArrowIcon from '../icons/right_arrow_icon.svg';
import { searchActor } from '../models/searchMachine';
import styles from './mainSummary.module.scss';

const MainSummary = (props: {}) => {
  const [isContentOpen, setIsContentOpen] = useState(true);
  const state = useSelector(searchActor, (state) => state);
  const mode = useSelector(searchActor, (state) => state.context.mode);
  const isLoadingPapers = state.matches({
    viewing: {
      fetchingPapers: 'fetching',
    },
  });
  const isLoadingLiteratureReview = state.matches({
    viewing: {
      fetchingLiteratureReview: 'fetching',
    },
  });
  const summaryInfo = useSelector(
    searchActor,
    (state) => state.context.summaryInfo
  );
  const summaryZHInfo = useSelector(
    searchActor,
    (state) => state.context.summaryZHInfo
  );

  const isLoadingSummaryAnswer = state.matches({
    viewing: {
      fetchingSummaryAnswer: 'fetching',
    },
  });

  const showSummary = useMemo(() => {
    switch (mode) {
      case 'en':
        return summaryInfo;
      case 'zh-cn':
        return summaryZHInfo;
    }
  }, [mode, summaryInfo, summaryZHInfo]);

  return (
    <div
      className={styles.main_summary}
      style={{
        maxHeight: `${isContentOpen ? '2000px' : '100px'}`,
        paddingBottom: `${isContentOpen ? '15px' : '0px'}`,
      }}
    >
      {!isLoadingSummaryAnswer &&
        !isLoadingPapers &&
        !isLoadingLiteratureReview && (
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
        <div>
          <Skeleton
            active
            loading={
              isLoadingSummaryAnswer ||
              isLoadingPapers ||
              isLoadingLiteratureReview
            }
            style={{ padding: '10px' }}
            paragraph={{ rows: 3 }}
          >
            <div className={styles.main_summary_content_text}>
              {showSummary.summary}
            </div>
          </Skeleton>
        </div>
      </div>
    </div>
  );
};

export default MainSummary;
