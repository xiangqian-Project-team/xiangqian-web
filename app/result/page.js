/*
 * @Author: 何泽颖 hezeying@autowise.ai
 * @Date: 2024-03-03 01:22:56
 * @LastEditors: 何泽颖 hezeying@autowise.ai
 * @LastEditTime: 2024-03-20 21:23:38
 * @FilePath: /xiangqian-web/app/result/page.js
 * @Description:
 */
'use client';

import { Modal, Skeleton } from 'antd';
import { useAtom, useSetAtom } from 'jotai';
import { useRouter } from 'next-nprogress-bar';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import LoginBtn from '../components/loginBtn';
import ResultPaperItem from '../components/resultPaperItem';
import SearchTextArea from '../components/searchTextArea';
import ErrorIcon from '../icons/error_icon.svg';
import LogoIcon2 from '../icons/main_logo.svg';
import userExpendIcon from '../icons/user_expend_icon.svg';
import {
  bulletPointsAtom,
  bulletPointsZHAtom,
  checkedPapersAtom,
  modeAtom,
  papersAtom,
  papersAtomZH,
  searchValueAtom,
  selectedBulletPointsAtom,
  selectedSummaryAtom,
  summaryAtom,
  summaryZHAtom,
} from '../models/search';
import {
  getAnalysisPedia as getAnalysisPediaAsync,
  getPartPedia as getPartPediaAsync,
  getResponsePedia as getResponsePediaAsync,
} from '../service';
import ModeButtons from './modeButtons';
import styles from './page.module.scss';
import PageManager from './pageManager';
import Summary from './summary';

function Search() {
  const router = useRouter();
  const [pageSize] = useState(10);
  const [isInitialed, setIsInitialed] = useState(false);
  const [isNoEnoughModalVisible, setIsNoEnoughModalVisible] = useState(false);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [mode, setMode] = useAtom(modeAtom); // en | zh-cn | selected
  const queryRef = useRef({ queryEn: '', queryZh: '' });
  const paperSkeletons = useMemo(
    () =>
      Array.from({ length: 3 }).map((item) => (item = { id: Math.random() })),
    []
  );
  const [isSortActive, setIsSortActive] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const [summary, setSummary] = useAtom(summaryAtom);
  const [bulletPoints, setBulletPoints] = useAtom(bulletPointsAtom);
  const [summaryZh, setSummaryZh] = useAtom(summaryZHAtom);
  const [bulletPointsZH, setBulletPointsZH] = useAtom(bulletPointsZHAtom);
  const [papers, setPapers] = useAtom(papersAtom);
  const [papersZH, setPapersZH] = useAtom(papersAtomZH);
  const setSearchValue = useSetAtom(searchValueAtom);
  const [checkedPapers, setCheckedPapers] = useAtom(checkedPapersAtom);
  const setSelectedSummary = useSetAtom(selectedSummaryAtom);
  const setSelectedBulletPoints = useSetAtom(selectedBulletPointsAtom);
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const searchParams = useSearchParams();
  const [prevQuestion, setPrevQuestion] = useState(searchParams.get('q'));

  useEffect(() => {
    setPrevQuestion((prevQuestion) => searchParams.get('q'));
  }, [searchParams]);

  useEffect(() => {
    const question = searchParams.get('q');
    setSearchValue(question);
    let clear = false;
    if (prevQuestion !== question) {
      clear = true;
    }
    getPedia(question, { clear });
  }, [searchParams, mode]);

  const onResultSortByTimeClick = () => {
    setIsSortActive(!isSortActive);
    setPageIndex(1);
  };

  const getAnalysisPedia = async (params, mode) => {
    const { papers, queryEn, queryZh } = params;
    const currentMode = mode;
    const res = await getAnalysisPediaAsync({
      papers,
      queryEn,
      queryZh,
    });
    if (!res.ok) {
      throw new Error('Failed get summary');
    }

    const data = await res.json();
    switch (currentMode) {
      case 'en':
        setSummary(data.answer);
        setBulletPoints(data.bulletPoints);
        break;
      case 'zh-cn':
        setSummaryZh(data.answer);
        setBulletPointsZH(data.bulletPoints);
        break;
      case 'selected':
        setSelectedSummary(data.answer);
        setSelectedBulletPoints(data.bulletPoints);
        break;
    }
    setIsLoadingSummary(false);
  };

  const getResponsePedia = async () => {
    const currMode = mode;
    const fetchList = [];
    showPapers.forEach((element) => {
      if (element.response) {
        return;
      }
      fetchList.push(element);
    });
    if (fetchList.length === 0) {
      return;
    }
    const res = await getResponsePediaAsync({
      papers: fetchList,
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

  const showPapers = useMemo(() => {
    let newList = [];
    switch (mode) {
      case 'en':
        newList = [...papers];
        break;
      case 'zh-cn':
        newList = [...papersZH];
        break;
      case 'selected':
        newList = [...papers, ...papersZH].filter((item) =>
          checkedPapers.includes(item.id)
        );
        break;
    }

    if (isSortActive) {
      return newList
        .sort((a, b) => b.year - a.year)
        .slice((pageIndex - 1) * pageSize, pageIndex * pageSize);
    }
    return newList.slice((pageIndex - 1) * pageSize, pageIndex * pageSize);
  }, [papers, papersZH, pageIndex, isSortActive, mode, checkedPapers]);

  const isSearchPapersVisible = useMemo(() => {
    return isInitialed && showPapers.length === 0 && !isLoadingList;
  }, [showPapers, isLoadingList]);

  const isPapersEmptyErrorVisible = useMemo(() => {
    return (
      isInitialed &&
      !isLoadingList &&
      !isLoadingSummary &&
      !summary &&
      !summaryZh &&
      !showPapers.length
    );
  }, [
    isInitialed,
    isLoadingList,
    isLoadingSummary,
    summary,
    summaryZh,
    showPapers,
  ]);

  const totalPapers = useMemo(() => {
    switch (mode) {
      case 'en':
        return papers.length;
      case 'zh-cn':
        return papersZH.length;
      case 'selected':
        return checkedPapers.length;
    }
    return 0;
  }, [mode, papers, papersZH, checkedPapers]);

  useEffect(() => {
    getResponsePedia();
  }, [showPapers]);

  const getPedia = async (queryText, options) => {
    if (isLoadingList || isLoadingSummary) return;
    let currMode = mode;

    if (options.clear) {
      setSummary('');
      setSummaryZh('');
      setBulletPoints('');
      setBulletPointsZH('');
      setCheckedPapers([]);
      setPapers([]);
      setPapersZH([]);
      setSelectedSummary('');
      setPageIndex(1);
      if (mode === 'selected') {
        setMode('en');
        currMode = 'en';
      }
    } else {
      if (currMode === 'selected') {
        return;
      }
      if (currMode === 'zh-cn' && papersZH.length) {
        return;
      }
      if (currMode === 'en' && papers.length) {
        return;
      }
    }
    setIsLoadingSummary(true);
    setIsLoadingList(true);

    let queryEn, queryZh, nextPapers;
    try {
      setIsInitialed(true);
      const listRes = await getPartPediaAsync({ query: queryText }, currMode);
      if (!listRes.ok) {
        throw new Error('Failed search');
      }
      const data = await listRes.json();
      queryRef.current = { queryEn: data.queryEn, queryZh: data.queryZh };
      queryEn = data.queryEn;
      queryZh = data.queryZh;
      nextPapers = data.papers;
      switch (currMode) {
        case 'en':
          setPapers(nextPapers || []);
          break;
        case 'zh-cn':
          setPapersZH(nextPapers || []);
          break;
      }
      setIsLoadingList(false);
      await getAnalysisPedia(
        { papers: nextPapers, queryEn, queryZh },
        currMode
      );
      setIsLoadingSummary(false);
    } catch (e) {
      setIsLoadingList(false);
      setIsLoadingSummary(false);
    }
  };

  return (
    <div className={styles.search}>
      <div className={styles.search_main}>
        <div
          className={styles.search_main_sidebar}
          style={{ width: isSideBarOpen ? 310 : 80 }}
        >
          <div className={styles.search_main_sidebar_logo_container}>
            <Image
              className={styles.search_main_sidebar_logo}
              src={LogoIcon2.src}
              width={60}
              height={26.5}
              alt="logo"
              onClick={() => {
                router.push('/');
              }}
            />

            <LoginBtn
              style={{
                marginTop: 30,
                // position: 'absolute',
                // bottom: 24,
                // left: getItem('token') ? 20 : 8,
              }}
              isOpen={isSideBarOpen}
              // style={{
              //   position: 'absolute',
              //   bottom: 24,
              //   left: getItem('token') ? 20 : 8,
              // }}
            />
            {isSideBarOpen && (
              <button
                className={styles.closeButton}
                onClick={() => {
                  setIsSideBarOpen(!isSideBarOpen);
                }}
              >
                <Image src={userExpendIcon} alt="userIcon" />
              </button>
            )}
            {!isSideBarOpen && (
              <button
                className={styles.openButton}
                onClick={() => {
                  setIsSideBarOpen(!isSideBarOpen);
                }}
              >
                <Image src={userExpendIcon} alt="userIcon" />
              </button>
            )}
          </div>
        </div>

        <div className={styles.search_content}>
          <SearchTextArea isLoading={isLoadingList || isLoadingSummary} />

          {isPapersEmptyErrorVisible && (
            <div className={styles.search_content_empty}>
              <div className={styles.search_content_empty_card}>
                <div className={styles.text}>
                  <h2>抱歉，这里好像出错了</h2>
                  <h3>可能是这个问题太复杂了，换个问题再试试吧</h3>
                </div>
              </div>
              <div className={styles.search_content_empty_contact}>
                仍无法解决？请联系「镶嵌」用户服务：hello_xiangqian
              </div>
            </div>
          )}

          {!isPapersEmptyErrorVisible && (
            <div className={styles.search_content_data}>
              <Summary
                mode={mode}
                papersZH={papersZH}
                papers={papers}
                setPapersZH={setPapersZH}
                setPapers={setPapers}
                summary={summary}
                bulletPoints={bulletPoints}
                summaryZh={summaryZh}
                bulletPointsZH={bulletPointsZH}
                checkedPapers={checkedPapers}
                setCheckedPapers={setCheckedPapers}
                getAnalysisPedia={getAnalysisPedia}
                setIsNoEnoughModalVisible={setIsNoEnoughModalVisible}
                isLoadingSummary={isLoadingSummary}
                queryRef={queryRef}
              />

              <div className={styles.search_content_data_papers}>
                <div className={styles.content_button}>
                  <ModeButtons
                    disabled={isLoadingList || isLoadingSummary}
                    mode={mode}
                    setMode={setMode}
                    onModeChangeClick={() => {
                      setPageIndex(1);
                    }}
                    onResultSortByTimeClick={onResultSortByTimeClick}
                  />
                </div>
                {isLoadingList &&
                  paperSkeletons.map((item) => (
                    <div
                      style={{
                        background: 'white',
                        margin: '0 0 10px',
                        padding: '20px',
                        borderRadius: '12px',
                      }}
                      key={item.id}
                    >
                      <Skeleton active />
                    </div>
                  ))}

                <div>
                  <div>
                    {isSearchPapersVisible && (
                      <div className={styles.no_papers_tip}>
                        <Image
                          className={styles.no_papers_tip_icon}
                          src={ErrorIcon}
                        />
                        <div className={styles.no_papers_tip_desc}>
                          该主题没有检测到{mode === 'en' ? '英文' : '中文'}
                          文献，尝试更换输入后再试试吧
                        </div>
                      </div>
                    )}
                    {showPapers.map((item) => {
                      return (
                        <>
                          <ResultPaperItem
                            key={item.id}
                            data={item}
                            isBorderVisible={true}
                            checkedPapers={checkedPapers}
                            setCheckedPapers={setCheckedPapers}
                          />
                        </>
                      );
                    })}
                  </div>
                  {isInitialed &&
                    !isLoadingList &&
                    !isPapersEmptyErrorVisible && (
                      <div>
                        <PageManager
                          pageIndex={pageIndex}
                          total={totalPapers}
                          pageSize={pageSize}
                          setPageIndex={setPageIndex}
                        />
                      </div>
                    )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Modal
        title="使用方法提示"
        open={isNoEnoughModalVisible}
        onCancel={() => {
          setIsNoEnoughModalVisible(false);
        }}
        footer={null}
        width={552}
        wrapClassName={styles.not_enough_select_paper_modal}
      >
        <p>选中文献过少，选择10-20篇文献以获得更好的重写效果。</p>
      </Modal>
    </div>
  );
}

export default Search;
