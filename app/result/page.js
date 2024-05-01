/*
 * @Author: 何泽颖 hezeying@autowise.ai
 * @Date: 2024-03-03 01:22:56
 * @LastEditors: 何泽颖 hezeying@autowise.ai
 * @LastEditTime: 2024-03-20 21:23:38
 * @FilePath: /xiangqian-web/app/result/page.js
 * @Description:
 */
'use client';

import { Button, ConfigProvider, Skeleton } from 'antd';
import { useAtom } from 'jotai';
import { useRouter } from 'next-nprogress-bar';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState, useRef } from 'react';
import LoginBtn from '../components/loginBtn';
import PageManager from './pageManager';
import ResultPaperItem from '../components/resultPaperItem';
import SearchTextArea from '../components/searchTextArea';
import LogoIcon2 from '../icons/main_logo.svg';
import RoundedArrow from '../icons/rounded_arrow.svg';
import SortIcon from '../icons/sort_icon.svg';
import userExpendIcon from '../icons/user_expend_icon.svg';
import EmptyIcon from '../img/empty.png';
import {
  papersAtom,
  searchValueAtom,
  summaryAtom,
  summaryZhAtom,
} from '../models/search';
import {
  getAnalysisPedia as getAnalysisPediaAsync,
  getPartPedia as getPartPediaAsync,
  getResponsePedia as getResponsePediaAsync,
} from '../service';
import styles from './page.module.scss';

function Search() {
  const router = useRouter();
  const [pageSize] = useState(10);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [isLoadingList, setIsLoadingList] = useState(false);
  const paperSkeletons = useMemo(
    () =>
      Array.from({ length: 3 }).map((item) => (item = { id: Math.random() })),
    []
  );
  const [isSortActive, setIsSortActive] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const [summary, setSummary] = useAtom(summaryAtom);
  const [summaryZh, setSummaryZh] = useAtom(summaryZhAtom);
  const [papers, setPapers] = useAtom(papersAtom);
  const [searchValue, setSearchValue] = useAtom(searchValueAtom);
  const [checkedPapers, setCheckedPapers] = useState([]);
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    const queryText = searchParams.get('q');
    setSearchValue(queryText);
    getPedia(queryText);
  }, [searchParams]);

  const onResultSortByTimeClick = () => {
    setIsSortActive(!isSortActive);
    setPageIndex(1)
  };

  const getAnalysisPedia = async (params) => {
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
    setSummary(data.bulletPoints);
    setSummaryZh(data.answer);
    setIsLoadingSummary(false);
  };

  const getResponsePedia = async () => {
    const fetchList = [];
    showPapers.forEach(element => {
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
    const processedMap = new Map(processedPapers.map((item) => [item.id, item]));
    const newPapers = papers.map((item) => {
      if (processedMap.has(item.id)) {
        return {...item, response: processedMap.get(item.id).response};
      }
      return item
    })
    setPapers(newPapers);
  };


  const showPapers = useMemo(() => {
    const newList = [...papers];
    if (isSortActive) {
      return newList
        .sort((a, b) => b.year - a.year)
        .slice((pageIndex - 1) * pageSize, pageIndex * pageSize);
    }
    return newList.slice((pageIndex - 1) * pageSize, pageIndex * pageSize);
  }, [papers, pageIndex, isSortActive]);


  useEffect(() => {
    getResponsePedia();
  }, [showPapers]);

  const getPedia = async (queryText) => {
    if (isLoadingList || isLoadingSummary) return;

    setSummary('');
    setSummaryZh('');
    setPapers([]);
    setPageIndex(1);
    setIsLoadingSummary(true);
    setIsLoadingList(true);

    let queryEn, queryZh, papers;
    try {
      const listRes = await getPartPediaAsync({ query: queryText });
      if (!listRes.ok) {
        throw new Error('Failed search');
      }
      setIsLoadingList(false);

      const data = await listRes.json();
      queryEn = data.queryEn;
      queryZh = data.queryZh;
      papers = data.papers;
      setPapers(data.papers);
      await getAnalysisPedia({ papers, queryEn, queryZh });
      setIsLoadingSummary(false);
    } catch (e) {
      setIsLoadingList(false);
      setIsLoadingSummary(false);
    }
  };

  const getReplacedSummary = (str) => {
    const formattedStr = str.replace(/\[(.*?)\]/g, function (match, i) {
      const citedItemId = match.replace(/^\[(.+)\]$/, '$1');

      const papersIndex = papers.findIndex((item) => item.id === citedItemId);

      const showpapersIndex = showPapers.findIndex(
        (item) => item.id === citedItemId
      );

      const authors = papers[papersIndex]?.authors[0] || '';
      const year = papers[papersIndex]?.year || '';

      return `<span onclick="

      const cardList = document.getElementById('cardList');

      for (let j = 0; j < cardList.childNodes.length; j++) {
        cardList.childNodes[j].style.borderWidth= '1px';
        cardList.childNodes[j].style.borderColor= '#84C4B5';
      }

      const index = ${showpapersIndex}

      let scrollTop = 0;
      for (let j = 0; j < index; j++) {
        cardList.childNodes[j].style.borderWidth= '1px';
        cardList.childNodes[j].style.borderColor= '#84C4B5';
        scrollTop += cardList.childNodes[j].clientHeight;
      }
      scrollTop += (index - 1) * 10;
      if (cardList) cardList.scrollTop = scrollTop + 2;

      cardList.childNodes[index].style.borderWidth= '2px';
      cardList.childNodes[index].style.borderColor= '#03A097';

      "style="text-decoration: none; color: #03A097; cursor: pointer;">（${authors} ，${year}）</span>`;
    });

    return `<pre>${formattedStr}</pre>`;
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
                        <div
                          className={styles.content_summary}
                          dangerouslySetInnerHTML={{
                            // __html: getReplacedSummary(answerZh),
                            __html: getReplacedSummary(summaryZh),
                          }}
                        />
                        <div
                          className={styles.content_summaryZh}
                          dangerouslySetInnerHTML={{
                            // __html: getReplacedSummary(BltptsZh),
                            __html: getReplacedSummary(summary),
                          }}
                        />
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
                      {/* <Button className={styles.en_button}>英文文献</Button>
                      <Button className={styles.cn_button}>中文文献</Button>
                      <Button className={styles.selected_button}>
                        我选中的
                      </Button> */}
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
                        <ResultPaperItem
                          key={item.id}
                          data={item}
                          checkedPapers={checkedPapers}
                          setCheckedPapers={setCheckedPapers}
                        />
                      );
                    })}
                  </div>
                  <div>
                    <PageManager
                      pageIndex={pageIndex}
                      total={papers.length}
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
