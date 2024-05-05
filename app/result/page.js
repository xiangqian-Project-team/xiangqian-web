/*
 * @Author: 何泽颖 hezeying@autowise.ai
 * @Date: 2024-03-03 01:22:56
 * @LastEditors: 何泽颖 hezeying@autowise.ai
 * @LastEditTime: 2024-03-20 21:23:38
 * @FilePath: /xiangqian-web/app/result/page.js
 * @Description:
 */
'use client';

import { Button, ConfigProvider, Popover, Skeleton } from 'antd';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useRouter } from 'next-nprogress-bar';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import LoginBtn from '../components/loginBtn';
import ResultPaperItem from '../components/resultPaperItem';
import SearchTextArea from '../components/searchTextArea';
import LangCNIcon from '../icons/lang_cn.svg';
import LangCNActiveIcon from '../icons/lang_cn_active.svg';
import LangENIcon from '../icons/lang_en.svg';
import LangENActiveIcon from '../icons/lang_en_active.svg';
import LogoIcon2 from '../icons/main_logo.svg';
import RoundedArrow from '../icons/rounded_arrow.svg';
import SelectedActiveButtonIcon from '../icons/selected_active_button_icon.svg';
import SelectedButtonIcon from '../icons/selected_button_icon.svg';
import SortIcon from '../icons/sort_icon.svg';
import userExpendIcon from '../icons/user_expend_icon.svg';
import EmptyIcon from '../img/empty.png';
import {
  searchValueAtom,
  languageAtom,
} from '../models/search';
import {
  getAnalysisPedia as getAnalysisPediaAsync,
  getPartPedia as getPartPediaAsync,
  getResponsePedia as getResponsePediaAsync,
} from '../service';
import styles from './page.module.scss';
import PageManager from './pageManager';

function LanguageButtons(props) {
  const [language, setLanguage] = useAtom(languageAtom);

  switch (language) {
    case 'en':
      return (
        <>
          <Button className={styles.en_button_active}>
            <Image src={LangENActiveIcon.src} width={18} height={18} />
            英文文献
          </Button>
          <Button
            className={styles.cn_button}
            onClick={() => {
              setLanguage('zh-cn');
              props.onLanguageChangeClick();
            }}
          >
            <Image src={LangCNIcon.src} width={18} height={18} />
            中文文献
          </Button>
        </>
      );
    case 'zh-cn':
      return (
        <>
          <Button
            className={styles.en_button}
            onClick={() => {
              setLanguage('en');
              props.onLanguageChangeClick();
            }}
          >
            <Image src={LangENIcon.src} width={18} height={18} />
            英文文献
          </Button>
          <Button className={styles.cn_button_active}>
            <Image src={LangCNActiveIcon.src} width={18} height={18} />
            中文文献
          </Button>
        </>
      );
    default:
      return null;
  }
}

function Search() {
  const router = useRouter();
  const [pageSize] = useState(10);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [isSelectedPapersActive, setIsSelectedPapersActive] = useState(false);
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
  const language = useAtomValue(languageAtom);
  const [checkedPapers, setCheckedPapers] = useState([]);
  const [checkedPapersZH, setCheckedPapersZH] = useState([]);
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
  }, [searchParams, language]);

  const onResultSortByTimeClick = () => {
    setIsSortActive(!isSortActive);
    setPageIndex(1);
  };

  const getAnalysisPedia = async (params, lang) => {
    const { papers, queryEn, queryZh } = params;
    const res = await getAnalysisPediaAsync({
      papers,
      queryEn,
      queryZh,
    });
    if (!res.ok) {
      throw new Error('Failed get summary');
    }

    const data = await res.json();
    if (lang === 'en') {
      setSummary(data.answer);
      setBulletPoints(data.bulletPoints);
    } else {
      setSummaryZh(data.answer);
      setBulletPointsZH(data.bulletPoints);
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
    const newPapers = papers.map((item) => {
      if (processedMap.has(item.id)) {
        return { ...item, response: processedMap.get(item.id).response };
      }
      return item;
    });
    setPapers(newPapers);
  };

  const getResponsePedia = async () => {
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
    const newPapers = papers.map((item) => {
      if (processedMap.has(item.id)) {
        return { ...item, response: processedMap.get(item.id).response };
      }
      return item;
    });
    setPapers(newPapers);
  };

  const showSummary = useMemo(() => {
    if (language === 'zh-cn') {
      return { summary: summaryZh, bulletPoints: bulletPointsZH };
    }
    return {
      summary,
      bulletPoints,
    };
  }, [summary, summaryZh, bulletPoints, bulletPointsZH, language]);

  const showPapers = useMemo(() => {
    let newList = [...papers];
    if (language === 'zh-cn') {
      newList = [...papersZH];
      if (isSelectedPapersActive) {
        newList = newList.filter((item) => checkedPapersZH.includes(item.id));
      }
    } else {
      if (isSelectedPapersActive) {
        newList = newList.filter((item) => checkedPapers.includes(item.id));
      }
    }

    if (isSortActive) {
      return newList
        .sort((a, b) => b.year - a.year)
        .slice((pageIndex - 1) * pageSize, pageIndex * pageSize);
    }
    return newList.slice((pageIndex - 1) * pageSize, pageIndex * pageSize);
  }, [
    papers,
    papersZH,
    pageIndex,
    isSortActive,
    language,
    isSelectedPapersActive,
    checkedPapers,
  ]);

  const totalPapers = useMemo(() => {
    if (language === 'zh-cn') {
      if (isSelectedPapersActive) {
        return checkedPapersZH.length;
      }
      return papersZH.length;
    }
    if (isSelectedPapersActive) {
      return checkedPapers.length;
    }
    return papers.length;
  });

  useEffect(() => {
    getResponsePedia();
  }, [showPapers]);

  const getPedia = async (queryText, options) => {
    if (isLoadingList || isLoadingSummary) return;
    const currLanguage = language;

    if (options.clear) {
      setSummary('');
      setSummaryZh('');
      setBulletPoints('');
      setBulletPointsZH('');
      setCheckedPapersZH([]);
      setCheckedPapers([]);
      setPapers([]);
      setPapersZH([]);
      setPageIndex(1);
    } else {
      if (currLanguage === 'zh-cn' && papersZH.length) {
        return;
      }
      if (currLanguage === 'en' && papers.length) {
        return;
      }
    }
    setIsLoadingSummary(true);
    setIsLoadingList(true);

    let queryEn, queryZh, nextPapers;
    try {
      const listRes = await getPartPediaAsync(
        { query: queryText },
        currLanguage
      );
      if (!listRes.ok) {
        throw new Error('Failed search');
      }
      setIsLoadingList(false);

      const data = await listRes.json();
      queryEn = data.queryEn;
      queryZh = data.queryZh;
      nextPapers = data.papers;
      if (currLanguage === 'en') {
        setPapers(nextPapers);
      } else {
        setPapersZH(nextPapers);
      }
      await getAnalysisPedia(
        { papers: nextPapers, queryEn, queryZh },
        currLanguage
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
        const paper = papers.find((item) => item.id === id);
        const authors = paper?.authors[0] || '';
        const year = paper?.year || '';
        return [
          ...arr,
          <Popover
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
              language === 'zh-cn' ? (
                <ResultPaperItem
                  data={papersZH}
                  checkedPapers={checkedPapersZH}
                  setCheckedPapers={setCheckedPapersZH}
                />
              ) : (
                <ResultPaperItem
                  data={paper}
                  checkedPapers={checkedPapers}
                  setCheckedPapers={setCheckedPapers}
                />
              )
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

          {!isLoadingList &&
            !isLoadingSummary &&
            !summary &&
            !showPapers.length && (
              <div className={styles.search_content_empty}>
                <div className={styles.search_content_empty_card}>
                  <Image
                    src={EmptyIcon.src}
                    width={64}
                    height={46}
                    alt="EmptyIcon"
                  />

                  <div className={styles.text}>
                    很抱歉，暂时无法找到合适的答案，请换个问题再试一次。
                  </div>
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
                      <div className={styles.content}>
                        <div className={styles.content_summary}>
                          {getReplacedSummary(showSummary.summary)}
                        </div>
                        <div className={styles.content_summaryZh}>
                          {getReplacedSummary(showSummary.bulletPoints)}
                        </div>
                      </div>
                    </>
                  </Skeleton>
                </div>
              }
            </div>

            <div className={styles.search_content_data_papers}>
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

              {!isLoadingList && (
                <div>
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
                      <LanguageButtons
                        onLanguageChangeClick={() => {
                          setPageIndex(1);
                        }}
                      />
                      {!isSelectedPapersActive && (
                        <Button
                          className={styles.selected_button}
                          onClick={() => {
                            setIsSelectedPapersActive(!isSelectedPapersActive);
                            setPageIndex(1);
                          }}
                        >
                          <Image
                            src={SelectedButtonIcon.src}
                            width={18}
                            height={18}
                          />
                          我选中的
                        </Button>
                      )}
                      {isSelectedPapersActive && (
                        <Button
                          className={styles.selected_button_active}
                          onClick={() => {
                            setIsSelectedPapersActive(!isSelectedPapersActive);
                            setPageIndex(1);
                          }}
                        >
                          <Image
                            src={SelectedActiveButtonIcon.src}
                            width={18}
                            height={18}
                          />
                          我选中的
                        </Button>
                      )}

                      <Button
                        className={styles.sort_button}
                        onClick={() => {
                          onResultSortByTimeClick();
                        }}
                      >
                        最新发表
                        <Image
                          className={styles.sort_button_icon}
                          src={SortIcon}
                        />
                      </Button>
                    </ConfigProvider>
                  </div>
                  <div>
                    {showPapers.map((item) => {
                      return (
                        <>
                          {language === 'zh-cn' ? (
                            <ResultPaperItem
                              key={item.id}
                              data={item}
                              isBorderVisible={true}
                              checkedPapers={checkedPapersZH}
                              setCheckedPapers={setCheckedPapersZH}
                            />
                          ) : (
                            <ResultPaperItem
                              key={item.id}
                              data={item}
                              isBorderVisible={true}
                              checkedPapers={checkedPapers}
                              setCheckedPapers={setCheckedPapers}
                            />
                          )}
                        </>
                      );
                    })}
                  </div>
                  <div>
                    <PageManager
                      pageIndex={pageIndex}
                      total={totalPapers}
                      pageSize={pageSize}
                      setPageIndex={setPageIndex}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Search;
