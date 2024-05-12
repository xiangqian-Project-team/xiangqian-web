import { Popover, Skeleton } from 'antd';
import Image from 'next/image';
import { useMemo } from 'react';
import ResultPaperItem from '../components/resultPaperItem';
import RefreshIcon from '../icons/refresh_icon.svg';
import RoundedArrow from '../icons/rounded_arrow.svg';
import { getResponsePedia as getResponsePediaAsync } from '../service';
import styles from './page.module.scss';

interface ISummaryProps {
  mode: string;
  summary: string;
  summaryZh: string;
  bulletPoints: string;
  bulletPointsZH: string;
  selectedSummary: string;
  selectedBulletPoints: string;
  papers: any[];
  papersZH: any[];
  setPapers: (papers: any[]) => void;
  setPapersZH: (papers: any[]) => void;
  checkedPapers: string[];
  setCheckedPapers: (papers: string[]) => void;
  getAnalysisPedia: (params: any, mode: string) => void;
  setIsNoEnoughModalVisible: (visible: boolean) => void;
  isLoadingSummary: boolean;
  queryRef: any;
}

export default function Summary(props: ISummaryProps) {
  const {
    mode,
    summary,
    papers,
    papersZH,
    bulletPoints,
    summaryZh,
    bulletPointsZH,
    selectedSummary,
    selectedBulletPoints,
    setPapersZH,
    setPapers,
    getAnalysisPedia,
    checkedPapers,
    setCheckedPapers,
    queryRef,
    isLoadingSummary,
    setIsNoEnoughModalVisible,
  } = props;

  const showSummary = useMemo(() => {
    switch (mode) {
      case 'en':
        return {
          summary,
          bulletPoints,
        };
      case 'zh-cn':
        return { summary: summaryZh, bulletPoints: bulletPointsZH };
      case 'selected':
        return {
          summary: selectedSummary,
          bulletPoints: selectedBulletPoints,
        };
    }
    return {};
  }, [
    summary,
    summaryZh,
    bulletPoints,
    bulletPointsZH,
    selectedSummary,
    selectedBulletPoints,
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
          return { ...item, response: processedMap.get(item.id).response };
        }
        return item;
      });
      setPapersZH(newPapers);
      return;
    }

    const newPapers = papers.map((item) => {
      if (processedMap.has(item.id)) {
        return { ...item, response: processedMap.get(item.id).response };
      }
      return item;
    });
    setPapers(newPapers);
  };

  const getReplacedSummary = (text: string) => {
    const pattern = /(\[.*?\])/g;
    const splitText = (text || '').split(pattern);

    if (splitText.length <= 1) {
      return <pre>{text}</pre>;
    }
    const matches = text.match(pattern);

    const formattedStr = splitText.reduce((arr, element) => {
      if (matches.includes(element)) {
        const id = element.replace(/^\[(.+)\]$/, '$1');
        const paper = [...papers, ...papersZH].find((item) => item.id === id);
        const authors = paper?.authors[0] || '';
        const year = paper?.year || '';
        return [
          ...arr,
          <Popover
            key={Math.random()}
            placement="rightTop"
            trigger="click"
            overlayStyle={{ padding: 0, maxWidth: 790 }}
            onOpenChange={(visible) => {
              if (visible) {
                if (paper.response) {
                  return;
                }
                getPopoverResponsePedia(paper);
              }
            }}
            content={
              <ResultPaperItem
                data={paper}
                checkedPapers={checkedPapers}
                setCheckedPapers={setCheckedPapers}
              />
            }
          >
            <span className={styles.mark_author_year}>
              （{authors} ，{year}）
            </span>
          </Popover>,
        ];
      }
      return [...arr, element];
    }, []);

    return <pre>{formattedStr}</pre>;
  };

  return (
    <div className={styles.search_content_data_summary}>
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
                      getAnalysisPedia(
                        {
                          papers: thePapers,
                          queryEn: queryRef.current.queryEn,
                          queryZh: queryRef.current.queryZh,
                        },
                        'selected'
                      );
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
                      {getReplacedSummary(showSummary.summary)}
                    </div>
                    <div className={styles.content_summaryZh}>
                      {getReplacedSummary(showSummary.bulletPoints)}
                    </div>
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
