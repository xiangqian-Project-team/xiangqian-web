/*
 * @Author: 何泽颖 hezeying@autowise.ai
 * @Date: 2024-03-03 01:22:56
 * @LastEditors: 何泽颖 hezeying@autowise.ai
 * @LastEditTime: 2024-03-20 21:23:38
 * @FilePath: /xiangqian-web/app/result/page.js
 * @Description:
 */
'use client';

import { Pagination, Skeleton } from 'antd';
import { useAtom } from 'jotai';
import { useRouter } from 'next-nprogress-bar';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import LoginBtn from '../components/loginBtn';
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
  getFinalPartPedia as getFinalPartPediaAsync,
  getPartPedia as getPartPediaAsync,
} from '../service';
import styles from './page.module.scss';

function Search() {
  const router = useRouter();

  // const timeId = useRef({ id: -1 });

  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [isLoadingList, setIsLoadingList] = useState(false);
  const paperSkeletons = useMemo(
    () =>
      Array.from({ length: 3 }).map((item) => (item = { id: Math.random() })),
    []
  );
  const [pageIndex, setPageIndex] = useState(1);
  // const [showPapers, setShowPapers] = useState([]);
  const [summary, setSummary] = useAtom(summaryAtom);
  const [summaryZh, setSummaryZh] = useAtom(summaryZhAtom);
  const [papers, setPapers] = useAtom(papersAtom);
  const [searchValue, setSearchValue] = useAtom(searchValueAtom);
  const [checkedPapers, setCheckedPapers] = useState([]);
  // const [meter, setMeter] = useState(0);
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  // const [visibleCount, setVisibleCount] = useState(10);
  const [isLoadingMorePapers, setIsLoadingMorePapers] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    const queryText = searchParams.get('q');
    setSearchValue(queryText);
    getPedia(queryText);
  }, [searchParams]);

  // const showMoreItems = async () => {
  //   const nextVisibleCount = Math.min(visibleCount + 5, papers.length);
  //   const papersToShow = papers.slice(visibleCount, nextVisibleCount);
  //   setIsLoadingMorePapers(true);
  //   let requireFetchResponse = false;
  //   for (const paper of papersToShow) {
  //     if (!paper.response) {
  //       requireFetchResponse = true;
  //       break;
  //     }
  //   }
  //   if (requireFetchResponse) {
  //     try {
  //       const res = await fetchResponsesAsync({ papers: papersToShow });
  //       if (!res.ok) {
  //         throw new Error('Failed search');
  //       }
  //       const { papers: processedPapers } = await res.json();
  //       setPapers((papers) => [
  //         ...papers.slice(0, visibleCount),
  //         ...processedPapers,
  //         ...papers.slice(nextVisibleCount),
  //       ]);
  //     } catch (error) {
  //       setIsLoadingMorePapers(false);
  //       console.log(error);
  //     }
  //   }

  //   setVisibleCount(nextVisibleCount);
  //   setIsLoadingMorePapers(false);
  // };

  // const getResultList = async () => {
  //   try {
  //     const res = await getPartPediaAsync({ query: queryText });
  //     if (!res.ok) {
  //       throw new Error('Failed search');
  //     }
  //     const { papers, queryEn, queryZh } = await res.json();

  //     setPapers(papers);
  // }

  const getSammury = async (params) => {
    const { papers, queryEn, queryZh } = params;
    const res = await getFinalPartPediaAsync({
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

  const showPapers = useMemo(() => {
    return papers.slice((pageIndex - 1) * 10, pageIndex * 10);
  }, [papers, pageIndex]);

  const getPedia = async (queryText) => {
    if (isLoadingList || isLoadingSummary) return;

    setSummary('');
    setSummaryZh('');
    setPapers([]);
    setPageIndex(1);
    setIsLoadingSummary(true);
    setIsLoadingList(true);
    // setVisibleCount(10);
    // 开启倒计时
    // timeId.current.id = setInterval(() => {
    //   setMeter((meter) => {
    //     if (meter >= 99.9) return 99.9;
    //     return meter + 0.1;
    //   });
    // }, 50);
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
      getSammury({ papers, queryEn, queryZh });
    } catch (e) {
      setIsLoadingSummary(false);
    }

    // setTimeout(() => {
    //   setIsLoadingSummary(false);
    // clearInterval(timeId.current.id);
    // setMeter(0);
    // }, 500);
    // } catch (error) {
    //   console.log(error);
    //   setIsLoadingSummary(false);
    //   setIsLoadingList(false);
    //   // clearInterval(timeId.current.id);
    //   // setMeter(0);
    // }
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

  // useEffect(() => {
  //   setShowPapers(papers.slice(0, visibleCount));
  // }, [papers, visibleCount]);

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
              {/* {!loading && summary && (
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
              )} */}
            </div>

            <div className={styles.search_content_data_papers}>
              <div className={styles.content_scroll}>
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
                {!isLoadingList &&
                  showPapers.map((item) => {
                    return (
                      // <Skeleton
                      //   key={item.id}
                      //   active
                      //   loading={isLoadingList}
                      //   paragraph={{ rows: 16 }}
                      // >
                      <ResultPaperItem
                        key={item.id}
                        data={item}
                        checkedPapers={checkedPapers}
                        setCheckedPapers={setCheckedPapers}
                      />
                      // </Skeleton>
                    );
                  })}
                {!isLoadingList && (
                  <Pagination
                    total={papers.length}
                    pageSize={10}
                    pageIndex={pageIndex}
                    onChange={(page) => {
                      setPageIndex(page);
                    }}
                  />
                )}
                {/* {!isLoadingList && (
                  <div className={styles.content_button}>
                    <Button
                      type="primary"
                      size="large"
                      loading={isLoadingMorePapers}
                      onClick={() => {
                        showMoreItems();
                      }}
                    >
                      查看更多
                    </Button>
                  </div>
                )} */}
              </div>
              {/* )} */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Search;
