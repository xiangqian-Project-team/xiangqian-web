import { useSelector } from '@xstate/react';
import { Skeleton } from 'antd';
import { useMemo } from 'react';
import { searchActor } from '../models/searchMachine';
import { getResponsePedia as getResponsePediaAsync } from '../service';
import styles from './page.module.scss';
import SummaryPopover from './summaryPopover';

export default function Summary(props: {
  setIsNoEnoughModalVisible: (isVisible: boolean) => void;
}) {
  const state = useSelector(searchActor, (state) => state);
  const isLoadingPapers = state.matches({
    viewing: {
      fetchingPapers: 'fetching',
    },
  });
  const isLoadingFundPapers = state.matches({
    viewing: {
      fetchingFund: 'fetching',
    },
  });
  const isLoadingSummaryAnalysis = state.matches({
    viewing: {
      fetchingSummaryAnalysis: 'fetching',
    },
  });
  const isLoadingSummaryBulletPoints = state.matches({
    viewing: {
      fetchingSummaryBulletPoints: 'fetching',
    },
  });
  const mode = useSelector(searchActor, (state) => state.context.mode);
  const summaryInfo = useSelector(
    searchActor,
    (state) => state.context.summaryInfo
  );
  const summaryZHInfo = useSelector(
    searchActor,
    (state) => state.context.summaryZHInfo
  );
  const summaryFundInfo = useSelector(
    searchActor,
    (state) => state.context.summaryFundInfo
  );

  const showSummary = useMemo(() => {
    switch (mode) {
      case 'en':
        return summaryInfo;
      case 'zh-cn':
        return summaryZHInfo;
      case 'fund':
        return summaryFundInfo;
      default:
        return summaryZHInfo;
    }
  }, [mode, summaryFundInfo, summaryInfo, summaryZHInfo]);

  const getPopoverResponsePedia = async (paper: any, queryZh: string) => {
    if (!paper) {
      return;
    }
    const currMode = mode;
    const res = await getResponsePediaAsync({
      queryZh,
      papers: [paper],
    });
    if (!res.ok) {
      throw new Error('Failed get response');
    }
    const { papers: processedPapers } = await res.json();
    if (currMode === 'zh-cn') {
      searchActor.send({ type: 'SET_RESPONSE_PEDIA', value: processedPapers });
      return;
    }

    searchActor.send({ type: 'SET_RESPONSE_PEDIA', value: processedPapers });
  };

  return (
    <div className={styles.search_content_data_summary_content}>
      {
        <div>
          <div>
            <div className={styles.content}>
              <div>
                <Skeleton
                  active
                  loading={
                    isLoadingSummaryAnalysis ||
                    isLoadingPapers ||
                    isLoadingFundPapers
                  }
                  style={{ padding: '20px' }}
                  paragraph={{ rows: 3 }}
                >
                  <div className={styles.header}>总结</div>
                  <div className={styles.content_bullet_points_prefix}>
                    {showSummary.bulletPointsPrefix}
                  </div>
                </Skeleton>
                <Skeleton
                  active
                  loading={
                    isLoadingSummaryBulletPoints ||
                    isLoadingPapers ||
                    isLoadingFundPapers
                  }
                  style={{ padding: '20px' }}
                  paragraph={{ rows: 3 }}
                >
                  <ul className={styles.content_bullet_points}>
                    {showSummary.bulletPoints.map((item) => (
                      <li key={item.key}>
                        <SummaryPopover
                          data={item}
                          getPopoverResponsePedia={getPopoverResponsePedia}
                        />
                      </li>
                    ))}
                  </ul>
                </Skeleton>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  );
}
