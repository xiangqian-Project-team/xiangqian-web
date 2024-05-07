/*
 * @Author: 何泽颖 hezeying@autowise.ai
 * @Date: 2024-03-03 01:22:56
 * @LastEditors: 何泽颖 hezeying@autowise.ai
 * @LastEditTime: 2024-03-20 21:23:38
 * @FilePath: /xiangqian-web/app/result/page.js
 * @Description:
 */
'use client';

import { Button, ConfigProvider, Modal, Popover, Skeleton } from 'antd';
import { useAtom, useSetAtom } from 'jotai';
import { useRouter } from 'next-nprogress-bar';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import LoginBtn from '../components/loginBtn';
import ResultPaperItem from '../components/resultPaperItem';
import SearchTextArea from '../components/searchTextArea';
import ErrorIcon from '../icons/error_icon.svg';
import LangCNIcon from '../icons/lang_cn.svg';
import LangCNActiveIcon from '../icons/lang_cn_active.svg';
import LangENIcon from '../icons/lang_en.svg';
import LangENActiveIcon from '../icons/lang_en_active.svg';
import LogoIcon2 from '../icons/main_logo.svg';
import RefreshIcon from '../icons/refresh_icon.svg';
import RoundedArrow from '../icons/rounded_arrow.svg';
import SelectedActiveButtonIcon from '../icons/selected_active_button_icon.svg';
import SelectedButtonIcon from '../icons/selected_button_icon.svg';
import SortIcon from '../icons/sort_icon.svg';
import userExpendIcon from '../icons/user_expend_icon.svg';
import { modeAtom, searchValueAtom } from '../models/search';
import {
  getAnalysisPedia as getAnalysisPediaAsync,
  getPartPedia as getPartPediaAsync,
  getResponsePedia as getResponsePediaAsync,
} from '../service';
import styles from './page.module.scss';
import PageManager from './pageManager';

function ModeButtons(props) {
  const [mode, setMode] = useAtom(modeAtom);

  return (
    <>
      {mode === 'en' ? (
        <Button className={styles.en_button_active} disabled={props.disabled}>
          <Image src={LangENActiveIcon.src} width={18} height={18} />
          英文文献
        </Button>
      ) : (
        <Button
          className={styles.en_button}
          disabled={props.disabled}
          onClick={() => {
            setMode('en');
            props.onModeChangeClick();
          }}
        >
          <Image src={LangENIcon.src} width={18} height={18} />
          英文文献
        </Button>
      )}
      {mode === 'zh-cn' ? (
        <Button className={styles.cn_button_active} disabled={props.disabled}>
          <Image src={LangCNActiveIcon.src} width={18} height={18} />
          中文文献
        </Button>
      ) : (
        <Button
          className={styles.cn_button}
          disabled={props.disabled}
          onClick={() => {
            setMode('zh-cn');
            props.onModeChangeClick();
          }}
        >
          <Image src={LangCNIcon.src} width={18} height={18} />
          中文文献
        </Button>
      )}
      {mode === 'selected' ? (
        <Button
          className={styles.selected_button_active}
          disabled={props.disabled}
        >
          <Image src={SelectedActiveButtonIcon.src} width={18} height={18} />
          我选中的
        </Button>
      ) : (
        <Button
          className={styles.selected_button}
          disabled={props.disabled}
          onClick={() => {
            setMode('selected');
            props.onModeChangeClick();
          }}
        >
          <Image src={SelectedButtonIcon.src} width={18} height={18} />
          我选中的
        </Button>
      )}
    </>
  );
}

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
  const [summary, setSummary] = useState('');
  const [bulletPoints, setBulletPoints] = useState('');
  const [summaryZh, setSummaryZh] = useState('');
  const [bulletPointsZH, setBulletPointsZH] = useState('');
  const [papers, setPapers] = useState([]);
  const [papersZH, setPapersZH] = useState([]);
  const setSearchValue = useSetAtom(searchValueAtom);
  const [checkedPapers, setCheckedPapers] = useState([]);
  const [selectedSummary, setSelectedSummary] = useState('');
  const [selectedBulletPoints, setSelectedBulletPoints] = useState('');
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

  const getPopoverResponsePedia = async (paper) => {
    if (!paper) {
      return;
    }
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
      !showPapers.length
    );
  }, [isLoadingList, isLoadingSummary, summary, showPapers]);

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
      setMode('en');
      currMode = 'en';
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
      const listRes = await getPartPediaAsync({ query: queryText }, currMode);
      setIsInitialed(true);
      if (!listRes.ok) {
        throw new Error('Failed search');
      }
      setIsLoadingList(false);
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

  const getReplacedSummary = (text) => {
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

          <div className={styles.search_content_data}>
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
                        <div
                          className={
                            styles.fetch_selected_summary_button_container
                          }
                        >
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
                              className={
                                styles.fetch_selected_summary_button_icon
                              }
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

            <div className={styles.search_content_data_papers}>
              <div className={styles.content_button}>
                <ConfigProvider
                  theme={{
                    token: {
                      colorPrimary: '#000',
                    },
                    components: {
                      Button: {
                        paddingInlineSM: 34,
                        defaultColor: '#000',
                        defaultBg: '#FFF',
                        defaultHoverBg: '#99E0ED',
                        defaultHoverBorderColor: '#EEE',
                      },
                    },
                  }}
                >
                  <ModeButtons
                    disabled={isLoadingList || isLoadingSummary}
                    mode={mode}
                    setMode={setMode}
                    onModeChangeClick={() => {
                      setPageIndex(1);
                    }}
                  />
                  {isSortActive ? (
                    <Button
                      className={styles.sort_button_active}
                      disabled={isLoadingList || isLoadingSummary}
                      onClick={() => {
                        onResultSortByTimeClick();
                      }}
                    >
                      近期发表
                      <Image
                        className={styles.sort_button_icon}
                        src={SortIcon}
                      />
                    </Button>
                  ) : (
                    <Button
                      className={styles.sort_button}
                      disabled={isLoadingList || isLoadingSummary}
                      onClick={() => {
                        onResultSortByTimeClick();
                      }}
                    >
                      近期发表
                      <Image
                        className={styles.sort_button_icon}
                        src={SortIcon}
                      />
                    </Button>
                  )}
                </ConfigProvider>
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
