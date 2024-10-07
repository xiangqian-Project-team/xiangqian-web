import { useSelector } from '@xstate/react';
import { Skeleton } from 'antd';
import Image from 'next/image';
import { useMemo } from 'react';
import RefreshIcon from '../icons/refresh_icon.svg';
import { searchActor } from '../models/searchMachine';
import { getResponsePedia as getResponsePediaAsync } from '../service';
import styles from './page.module.scss';
import SummaryPopover from './summaryPopover';
import PopoverItem from './summaryPopoverItem';

export default function Summary(props: {
  setIsNoEnoughModalVisible: (isVisible: boolean) => void;
}) {
  const state = useSelector(searchActor, (state) => state);
  const isLoadingPapers = state.matches({
    viewing: {
      fetchingPapers: 'fetching',
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
  const isLoadingLiteratureReview = state.matches({
    viewing: {
      fetchingLiteratureReview: 'fetching',
    },
  });
  const mode = useSelector(searchActor, (state) => state.context.mode);
  const paperInfo = useSelector(
    searchActor,
    (state) => state.context.paperInfo
  );
  const paperZHInfo = useSelector(
    searchActor,
    (state) => state.context.paperZHInfo
  );
  const summaryInfo = useSelector(
    searchActor,
    (state) => state.context.summaryInfo
  );
  const summaryZHInfo = useSelector(
    searchActor,
    (state) => state.context.summaryZHInfo
  );
  const summarySelectedInfo = useSelector(
    searchActor,
    (state) => state.context.summarySelectedInfo
  );

  const showSummary = useMemo(() => {
    switch (mode) {
      case 'en':
        return summaryInfo;
      case 'zh-cn':
        return summaryZHInfo;
    }
    // switch (mode) {
    //   case 'en':
    //     return {
    //       summary,
    //       bulletPoints,
    //       bulletPointsPrefix,
    //     };
    //   case 'zh-cn':
    //     return {
    //       summary: summaryZh,
    //       bulletPoints: bulletPointsZH,
    //       bulletPointsPrefix: bulletPointsZHPrefix,
    //     };
    //   case 'selected':
    //     return {
    //       summary: selectedSummary,
    //     };
    // }
    // return {};
  }, [mode, summaryInfo, summaryZHInfo]);

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
            {mode === 'selected' &&
              summarySelectedInfo.bulletPoints.length === 0 && (
                <div className={styles.fetch_selected_summary_button_container}>
                  <button
                    onClick={() => {
                      const thePapers = [
                        ...paperInfo.papers,
                        ...paperZHInfo.papers,
                      ].filter((item) => item.selected);
                      if (thePapers.length < 10) {
                        props.setIsNoEnoughModalVisible(true);
                        return;
                      }
                      searchActor.send({ type: 'FETCH_LITERATURE_REVIEW' });
                    }}
                  >
                    <Image
                      alt=""
                      className={styles.fetch_selected_summary_button_icon}
                      width={18}
                      height={18}
                      src={RefreshIcon.src}
                    />
                    用选中的文章生成总结，以获取更优结果
                  </button>
                </div>
              )}
            <div className={styles.content}>
              <div>
                <Skeleton
                  active
                  loading={
                    isLoadingSummaryAnalysis ||
                    isLoadingPapers ||
                    isLoadingLiteratureReview
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
                    isLoadingLiteratureReview
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
              {mode === 'selected' &&
                summarySelectedInfo.bulletPoints.length > 0 && (
                  <div className={styles.content_summary}>
                    {summarySelectedInfo.bulletPoints.map((info) =>
                      info.popoverList.map((item) => (
                        <PopoverItem
                          key={item.key}
                          item={item}
                          getPopoverResponsePedia={getPopoverResponsePedia}
                        />
                      ))
                    )}
                  </div>
                )}
            </div>
          </div>
        </div>
      }
    </div>
  );
}
