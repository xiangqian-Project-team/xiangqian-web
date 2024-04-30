/*
 * @Author: 何泽颖 hezeying@autowise.ai
 * @Date: 2024-03-03 01:22:56
 * @LastEditors: 何泽颖 hezeying@autowise.ai
 * @LastEditTime: 2024-03-20 21:23:38
 * @FilePath: /xiangqian-web/app/result/page.js
 * @Description:
 */
'use client';

import { Skeleton } from 'antd';
import { useAtom } from 'jotai';
import { useRouter } from 'next-nprogress-bar';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import LoginBtn from '../components/loginBtn';
import PageManager from './pageManager';
import ResultPaperItem from '../components/resultPaperItem';
import SearchTextArea from '../components/searchTextArea';
import LogoIcon2 from '../icons/main_logo.svg';
import RoundedArrow from '../icons/rounded_arrow.svg';
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
  const [responseList, setResponseList] = useState([]);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [isLoadingList, setIsLoadingList] = useState(false);
  const paperSkeletons = useMemo(
    () =>
      Array.from({ length: 3 }).map((item) => (item = { id: Math.random() })),
    []
  );
  const [pageIndex, setPageIndex] = useState(1);
  const [summary, setSummary] = useAtom(summaryAtom);
  const [summaryZh, setSummaryZh] = useAtom(summaryZhAtom);
  const [papers, setPapers] = useAtom(papersAtom);
  const [searchValue, setSearchValue] = useAtom(searchValueAtom);
  const [checkedPapers, setCheckedPapers] = useState([]);
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  // const [isLoadingMorePapers, setIsLoadingMorePapers] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    const queryText = searchParams.get('q');
    setSearchValue(queryText);
    getPedia(queryText);
  }, [searchParams]);

  useEffect(() => {
    getResponsePedia({ papers });
  }, [pageIndex]);

  const onResultSortByTimeClick = () => {
    const newList = [...papers];
    newList.sort((a, b) => {
      return b.year - a.year;
    });
    setPapers(newList);
    getResponsePedia({ papers: newList });
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

  const getResponsePedia = async (params) => {
    const { papers: lastPapers } = params;
    const start = (pageIndex - 1) * pageSize;
    const end = pageIndex * pageSize;
    const filteredPapers = lastPapers.slice(start, end);
    const fetchedResponseSet = new Set(responseList.map((item) => item.id));
    filteredPapers.filter((item) => !fetchedResponseSet.has(item.id));
    if (!filteredPapers.length) {
      return;
    }
    const res = await getResponsePediaAsync({
      papers: filteredPapers,
    });
    if (!res.ok) {
      throw new Error('Failed get response');
    }
    const data = await res.json();
    const currentPapersMap = new Map(lastPapers.map((item) => [item.id, item]));
    const currentList = new Set(responseList);
    data.papers.forEach((element) => {
      currentList.add(element.id);
      currentPapersMap.set(element.id, element);
    });
    setPapers(Array.from(currentPapersMap.values()));
    setResponseList(Array.from(currentList));
  };

  const showPapers = useMemo(() => {
    return papers.slice((pageIndex - 1) * pageSize, pageIndex * pageSize);
  }, [papers, pageIndex]);

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
    } catch (e) {
      setIsLoadingSummary(false);
      setIsLoadingList(false);
      return;
    }

    try {
      getAnalysisPedia({ papers, queryEn, queryZh });
      getResponsePedia({ papers });
    } catch (e) {
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

          {/* {loading && (
            <div className={styles.search_content_loading}>
              <div className={styles.search_content_loading_card}>
                <div className={styles.text}>我们正在努力寻找答案……</div>
                <meter min="0" max="100" value={meter} />
              </div>
            </div>
          )} */}

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
                  {/* <div className={styles.content_button}>
                    <Button className={styles.en_button}>英文文献</Button>
                    <Button className={styles.cn_button}>中文文献</Button>
                    <Button className={styles.selected_button}>我选中的</Button>
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
                  </div> */}
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
