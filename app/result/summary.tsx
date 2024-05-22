import { Skeleton } from 'antd';
import { useAtom, useAtomValue } from 'jotai';
import Image from 'next/image';
import { useMemo } from 'react';
import RefreshIcon from '../icons/refresh_icon.svg';
import RoundedArrow from '../icons/rounded_arrow.svg';
import {
  bulletPointsAtom,
  bulletPointsPrefixAtom,
  bulletPointsZHAtom,
  bulletPointsZHPrefixAtom,
  checkedPapersAtom,
  modeAtom,
  papersAtom,
  papersAtomZH,
  selectedSummaryAtom,
  summaryAtom,
  summaryZHAtom,
} from '../models/search';
import { getResponsePedia as getResponsePediaAsync } from '../service';
import styles from './page.module.scss';
import SummaryPopover from './summaryPopover';

interface ISummaryProps {
  getLiteratureReview: (params: any) => void;
  setIsNoEnoughModalVisible: (visible: boolean) => void;
  isLoadingSummary: boolean;
  queryRef: any;
}

export default function Summary(props: ISummaryProps) {
  const {
    getLiteratureReview,
    queryRef,
    isLoadingSummary,
    setIsNoEnoughModalVisible,
  } = props;

  const mode = useAtomValue(modeAtom); // en | zh-cn | selected
  const summary = useAtomValue(summaryAtom);
  const summaryZh = useAtomValue(summaryZHAtom);
  const [papers, setPapers] = useAtom(papersAtom);
  const [papersZH, setPapersZH] = useAtom(papersAtomZH);
  const bulletPoints = useAtomValue(bulletPointsAtom);
  const bulletPointsPrefix = useAtomValue(bulletPointsPrefixAtom);
  const bulletPointsZH = useAtomValue(bulletPointsZHAtom);
  const bulletPointsZHPrefix = useAtomValue(bulletPointsZHPrefixAtom);
  const selectedSummary = useAtomValue(selectedSummaryAtom);
  const checkedPapers = useAtomValue(checkedPapersAtom);

  const showSummary = useMemo(() => {
    switch (mode) {
      case 'en':
        return {
          summary,
          bulletPoints,
          bulletPointsPrefix,
        };
      case 'zh-cn':
        return {
          summary: summaryZh,
          bulletPoints: bulletPointsZH,
          bulletPointsPrefix: bulletPointsZHPrefix,
        };
      case 'selected':
        return {
          summary: selectedSummary,
        };
    }
    return {};
  }, [
    summary,
    summaryZh,
    bulletPoints,
    bulletPointsZH,
    selectedSummary,
    bulletPointsZHPrefix,
    bulletPointsPrefix,
    mode,
  ]);

  const getPopoverResponsePedia = async (paper) => {
    if (!paper) {
      return;
    }
    const currMode = mode;
    const res = await getResponsePediaAsync({
      papers: [paper],
    });
    if (!res.ok) {
      throw new Error('Failed get response');
    }
    const { papers: processedPapers } = await res.json();
    const processedMap = new Map(
      processedPapers.map((item) => [item.id, item])
    );
    if (currMode === 'zh-cn') {
      const newPapers = papersZH.map((item) => {
        if (processedMap.has(item.id)) {
          // @ts-ignore
          return { ...item, response: processedMap.get(item.id).response };
        }
        return item;
      });
      setPapersZH(newPapers);
      return;
    }

    const newPapers = papers.map((item) => {
      if (processedMap.has(item.id)) {
        // @ts-ignore
        return { ...item, response: processedMap.get(item.id).response };
      }
      return item;
    });
    setPapers(newPapers);
  };

  return (
    <div className={styles.search_content_data_summary_content}>
      {
        <div>
          <Skeleton
            active
            loading={isLoadingSummary}
            style={{ padding: '20px' }}
            paragraph={{ rows: 16 }}
          >
            <>
              <div className={styles.header}>
                <Image
                  alt=""
                  className={styles.header_triangle}
                  src={RoundedArrow}
                />
                总结
              </div>
              {mode === 'selected' && !showSummary.summary && (
                <div className={styles.fetch_selected_summary_button_container}>
                  <button
                    onClick={() => {
                      const thePapers = [...papers, ...papersZH].filter(
                        (item) => checkedPapers.includes(item.id)
                      );
                      if (thePapers.length < 10) {
                        setIsNoEnoughModalVisible(true);
                        return;
                      }
                      getLiteratureReview({
                        papers: thePapers,
                        queryEn: queryRef.current.queryEn,
                        queryZh: queryRef.current.queryZh,
                      });
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
                {showSummary.summary && (
                  <>
                    <div className={styles.content_summary}>
                      {showSummary.summary}
                    </div>
                    {showSummary.bulletPointsPrefix && (
                      <div className={styles.content_bullet_points_prefix}>
                        {showSummary.bulletPointsPrefix}
                      </div>
                    )}
                    {showSummary.bulletPoints && (
                      <ul className={styles.content_bullet_points}>
                        {showSummary.bulletPoints.map((item) => (
                          <li>
                            <SummaryPopover
                              key={Math.random()}
                              text={item}
                              getPopoverResponsePedia={getPopoverResponsePedia}
                            />
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                )}
              </div>
            </>
          </Skeleton>
        </div>
      }
    </div>
  );
}
