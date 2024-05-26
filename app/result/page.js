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
import { useRouter } from 'next-nprogress-bar';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import LoginBtn from '../components/loginBtn';
import ResultPaperItem from '../components/resultPaperItem';
import SearchTextArea from '../components/searchTextArea';
import ErrorIcon from '../icons/error_icon.svg';
import LogoIcon2 from '../icons/main_logo.svg';
import userExpendIcon from '../icons/user_expend_icon.svg';
import FAQList from './faqList';
import ModeButtons from './modeButtons';
import styles from './page.module.scss';
import PageManager from './pageManager';
import Summary from './summary';

// import { useEffect, useMemo, useRef, useState } from 'react';
// import {
//   bulletPointsAtom,
//   bulletPointsPrefixAtom,
//   bulletPointsZHAtom,
//   bulletPointsZHPrefixAtom,
//   checkedPapersAtom,
//   modeAtom,
//   papersAtom,
//   papersAtomZH,
//   searchValueAtom,
//   selectedSummaryAtom,
//   sortModeAtom,
//   summaryAtom,
//   summaryZHAtom,
// } from '../models/search';
// import {
//   getAnalysisPedia as getAnalysisPediaAsync,
//   getLiteratureReview as getLiteratureReviewAsync,
//   getPartPedia as getPartPediaAsync,
//   getResponsePedia as getResponsePediaAsync,
// } from '../service';
// import ModeButtons from './modeButtons';
// import styles from './page.module.scss';
// import PageManager from './pageManager';
// import Summary from './summary';
// import searchMachine from '../models/searchMachine';

// function Search() {
//   const router = useRouter();
//   const [pageSize] = useState(10);
//   const [isInitialed, setIsInitialed] = useState(false);
//   const [isNoEnoughModalVisible, setIsNoEnoughModalVisible] = useState(false);
//   const [isLoadingSummary, setIsLoadingSummary] = useState(false);
//   const [isLoadingList, setIsLoadingList] = useState(false);
//   // const [mode, setMode] = useAtom(modeAtom); // en | zh-cn | selected
//   const queryRef = useRef({ queryEn: '', queryZh: '' });
//   const paperSkeletons = useMemo(
//     () =>
//       Array.from({ length: 3 }).map((item) => (item = { id: Math.random() })),
//     []
//   );
//   const setBulletPointsPrefix = useSetAtom(bulletPointsPrefixAtom);
//   const [summaryZh, setSummaryZh] = useAtom(summaryZHAtom);
//   const setBulletPointsZH = useSetAtom(bulletPointsZHAtom);
//   const setBulletPointsZHPrefix = useSetAtom(bulletPointsZHPrefixAtom);
//   const [papers, setPapers] = useAtom(papersAtom);
//   const [papersZH, setPapersZH] = useAtom(papersAtomZH);
//   const setSearchValue = useSetAtom(searchValueAtom);
//   const [checkedPapers, setCheckedPapers] = useAtom(checkedPapersAtom);
//   const setSelectedSummary = useSetAtom(selectedSummaryAtom);
//   const [isSideBarOpen, setIsSideBarOpen] = useState(false);
//   const searchParams = useSearchParams();
//   const [prevQuestion, setPrevQuestion] = useState(searchParams.get('q'));

//   useEffect(() => {
//     setPrevQuestion((prevQuestion) => searchParams.get('q'));
//   }, [searchParams]);

//   useEffect(() => {
//     const question = searchParams.get('q');
//     setSearchValue(question);
//     let clear = false;
//     if (prevQuestion !== question || !isInitialed) {
//       clear = true;
//     }
//     getPedia(question, { clear });
//   }, [searchParams, mode, prevQuestion]);

//   const getAnalysisPedia = async (params, mode) => {
//     const { papers, queryEn, queryZh } = params;
//     const currentMode = mode;
//     setIsLoadingSummary(true);
//     const res = await getAnalysisPediaAsync({
//       papers,
//       queryEn,
//       queryZh,
//     });
//     if (!res.ok) {
//       throw new Error('Failed get summary');
//     }

//     const data = await res.json();
//     switch (currentMode) {
//       case 'en':
//         setSummary(data.answer);
//         setBulletPoints(data.bltpts);
//         setBulletPointsPrefix(data.bltptsPrefix);
//         break;
//       case 'zh-cn':
//         setSummaryZh(data.answer);
//         setBulletPointsZH(data.bltpts);
//         setBulletPointsZHPrefix(data.bltptsPrefix);
//         break;
//     }
//     setIsLoadingSummary(false);
//   };

//   const getLiteratureReview = async (params) => {
//     const { papers, queryEn, queryZh } = params;
//     setIsLoadingSummary(true);
//     const res = await getLiteratureReviewAsync({
//       papers,
//       queryEn,
//       queryZh,
//     });
//     if (!res.ok) {
//       throw new Error('Failed get summary');
//     }

//     const data = await res.json();
//     setSelectedSummary(data.review);
//     setIsLoadingSummary(false);
//   };

//   const getResponsePedia = async () => {
//     const currMode = mode;
//     const fetchList = [];
//     showPapers.forEach((element) => {
//       if (element.response) {
//         return;
//       }
//       fetchList.push(element);
//     });
//     if (fetchList.length === 0) {
//       return;
//     }
//     const res = await getResponsePediaAsync({
//       papers: fetchList,
//     });
//     if (!res.ok) {
//       throw new Error('Failed get response');
//     }
//     const { papers: processedPapers } = await res.json();
//     const processedMap = new Map(
//       processedPapers.map((item) => [item.id, item])
//     );
//     if (currMode === 'zh-cn') {
//       const newPapers = papersZH.map((item) => {
//         if (processedMap.has(item.id)) {
//           return { ...item, response: processedMap.get(item.id).response };
//         }
//         return item;
//       });
//       setPapersZH(newPapers);
//       return;
//     }

//     const newPapers = papers.map((item) => {
//       if (processedMap.has(item.id)) {
//         return { ...item, response: processedMap.get(item.id).response };
//       }
//       return item;
//     });
//     setPapers(newPapers);
//   };

//   const showPapers = useMemo(() => {
//     let newList = [];
//     switch (mode) {
//       case 'en':
//         newList = [...papers];
//         break;
//       case 'zh-cn':
//         newList = [...papersZH];
//         break;
//       case 'selected':
//         newList = [...papers, ...papersZH].filter((item) =>
//           checkedPapers.includes(item.id)
//         );
//         break;
//     }

//     switch (sortMode) {
//       case 'time':
//         return newList
//           .sort((a, b) => b.year - a.year)
//           .slice((pageIndex - 1) * pageSize, pageIndex * pageSize);
//       case 'relevance':
//         return newList
//           .sort((a, b) => b.relevance - a.relevance)
//           .slice((pageIndex - 1) * pageSize, pageIndex * pageSize);
//       case 'quote':
//         return newList
//           .sort((a, b) => b.citationCount - a.citationCount)
//           .slice((pageIndex - 1) * pageSize, pageIndex * pageSize);
//     }
//     return newList.slice((pageIndex - 1) * pageSize, pageIndex * pageSize);
//   }, [papers, papersZH, pageIndex, sortMode, mode, checkedPapers]);

//   const isSearchPapersVisible = useMemo(() => {
//     return isInitialed && showPapers.length === 0 && !isLoadingList;
//   }, [showPapers, isLoadingList]);

//   const isPapersEmptyErrorVisible = useMemo(() => {
//     return (
//       isInitialed &&
//       !isLoadingList &&
//       !isLoadingSummary &&
//       !summary &&
//       !summaryZh &&
//       !showPapers.length
//     );
//   }, [
//     isInitialed,
//     isLoadingList,
//     isLoadingSummary,
//     summary,
//     summaryZh,
//     showPapers,
//   ]);

//   const totalPapers = useMemo(() => {
//     switch (mode) {
//       case 'en':
//         return papers.length;
//       case 'zh-cn':
//         return papersZH.length;
//       case 'selected':
//         return checkedPapers.length;
//     }
//     return 0;
//   }, [mode, papers, papersZH, checkedPapers]);

//   useEffect(() => {
//     getResponsePedia();
//   }, [showPapers]);

//   const getPedia = async (queryText, options) => {
//     if (isLoadingList || isLoadingSummary) return;
//     let currMode = mode;

//     if (options.clear) {
//       setSummary('');
//       setSummaryZh('');
//       setBulletPoints('');
//       setBulletPointsZH('');
//       setBulletPointsPrefix('');
//       setBulletPointsZHPrefix('');
//       setCheckedPapers([]);
//       setPapers([]);
//       setPapersZH([]);
//       setSelectedSummary('');
//       setPageIndex(1);
//       setSortMode('default');
//       if (mode === 'selected') {
//         setMode('en');
//         currMode = 'en';
//       }
//     } else {
//       if (currMode === 'selected') {
//         return;
//       }
//       if (currMode === 'zh-cn' && papersZH.length) {
//         return;
//       }
//       if (currMode === 'en' && papers.length) {
//         return;
//       }
//     }
//     setIsLoadingSummary(true);
//     setIsLoadingList(true);

//     let queryEn, queryZh, nextPapers;
//     try {
//       setIsInitialed(true);
//       const listRes = await getPartPediaAsync({ query: queryText }, currMode);
//       if (!listRes.ok) {
//         throw new Error('Failed search');
//       }
//       const data = await listRes.json();
//       queryRef.current = { queryEn: data.queryEn, queryZh: data.queryZh };
//       queryEn = data.queryEn;
//       queryZh = data.queryZh;
//       nextPapers = data.papers;
//       switch (currMode) {
//         case 'en':
//           setPapers(nextPapers || []);
//           break;
//         case 'zh-cn':
//           setPapersZH(nextPapers || []);
//           break;
//       }
//       setIsLoadingList(false);
//       await getAnalysisPedia(
//         { papers: nextPapers, queryEn, queryZh },
//         currMode
//       );
//       setIsLoadingSummary(false);
//     } catch (e) {
//       setIsLoadingList(false);
//       setIsLoadingSummary(false);
//     }
//   };

//   return (
//     <div className={styles.search}>
//       <div className={styles.search_main}>
//         <div
//           className={styles.search_main_sidebar}
//           style={{ width: isSideBarOpen ? 310 : 80 }}
//         >
//           <div className={styles.search_main_sidebar_logo_container}>
//             <Image
//               className={styles.search_main_sidebar_logo}
//               src={LogoIcon2.src}
//               width={60}
//               height={26.5}
//               alt="logo"
//               onClick={() => {
//                 router.push('/');
//               }}
//             />

//             <LoginBtn
//               style={{
//                 marginTop: 30,
//                 // position: 'absolute',
//                 // bottom: 24,
//                 // left: getItem('token') ? 20 : 8,
//               }}
//               isOpen={isSideBarOpen}
//               // style={{
//               //   position: 'absolute',
//               //   bottom: 24,
//               //   left: getItem('token') ? 20 : 8,
//               // }}
//             />
//             {isSideBarOpen && (
//               <button
//                 className={styles.closeButton}
//                 onClick={() => {
//                   setIsSideBarOpen(!isSideBarOpen);
//                 }}
//               >
//                 <Image src={userExpendIcon} alt="userIcon" />
//               </button>
//             )}
//             {!isSideBarOpen && (
//               <button
//                 className={styles.openButton}
//                 onClick={() => {
//                   setIsSideBarOpen(!isSideBarOpen);
//                 }}
//               >
//                 <Image src={userExpendIcon} alt="userIcon" />
//               </button>
//             )}
//           </div>
//         </div>

//         <div className={styles.search_content}>
//           <SearchTextArea isLoading={isLoadingList || isLoadingSummary} />

//           {isPapersEmptyErrorVisible && (
//             <div className={styles.search_content_empty}>
//               <div className={styles.search_content_empty_card}>
//                 <div className={styles.text}>
//                   <h2>抱歉，这里好像出错了</h2>
//                   <h3>可能是这个问题太复杂了，换个问题再试试吧</h3>
//                 </div>
//               </div>
//               <div className={styles.search_content_empty_contact}>
//                 仍无法解决？请联系「镶嵌」用户服务：hello_xiangqian
//               </div>
//             </div>
//           )}

//           {!isPapersEmptyErrorVisible && (
//             <div className={styles.search_content_data}>
//               <div className={styles.search_content_data_summary}>
//                 <Summary
//                   getLiteratureReview={getLiteratureReview}
//                   setIsNoEnoughModalVisible={setIsNoEnoughModalVisible}
//                   isLoadingSummary={isLoadingSummary}
//                   queryRef={queryRef}
//                 />
//                 <FAQList />
//               </div>

//               <div className={styles.search_content_data_papers}>
//                 <div className={styles.content_button}>
//                   <ModeButtons
//                     disabled={isLoadingList || isLoadingSummary}
//                     mode={mode}
//                     setMode={setMode}
//                     onModeChangeClick={() => {
//                       setPageIndex(1);
//                     }}
//                   />
//                 </div>
//                 {isLoadingList &&
//                   paperSkeletons.map((item) => (
//                     <div
//                       style={{
//                         background: 'white',
//                         margin: '0 0 10px',
//                         padding: '20px',
//                         borderRadius: '12px',
//                       }}
//                       key={item.id}
//                     >
//                       <Skeleton active />
//                     </div>
//                   ))}

//                 <div>
//                   <div>
//                     {isSearchPapersVisible && (
//                       <div className={styles.no_papers_tip}>
//                         <Image
//                           className={styles.no_papers_tip_icon}
//                           src={ErrorIcon}
//                         />
//                         <div className={styles.no_papers_tip_desc}>
//                           该主题没有检测到{mode === 'en' ? '英文' : '中文'}
//                           文献，尝试更换输入后再试试吧
//                         </div>
//                       </div>
//                     )}
//                     {showPapers.map((item) => {
//                       return (
//                         <>
//                           <ResultPaperItem
//                             key={item.id}
//                             data={item}
//                             isBorderVisible={true}
//                             checkedPapers={checkedPapers}
//                             setCheckedPapers={setCheckedPapers}
//                           />
//                         </>
//                       );
//                     })}
//                   </div>
//                   {isInitialed &&
//                     !isLoadingList &&
//                     !isPapersEmptyErrorVisible && (
//                       <div>
//                         <PageManager
//                           pageIndex={pageIndex}
//                           total={totalPapers}
//                           pageSize={pageSize}
//                           setPageIndex={setPageIndex}
//                         />
//                       </div>
//                     )}
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//       <Modal
//         title="使用方法提示"
//         open={isNoEnoughModalVisible}
//         onCancel={() => {
//           setIsNoEnoughModalVisible(false);
//         }}
//         footer={null}
//         width={552}
//         wrapClassName={styles.not_enough_select_paper_modal}
//       >
//         <p>选中文献过少，选择10-20篇文献以获得更好的重写效果。</p>
//       </Modal>
//     </div>
//   );
// }

import { useSelector } from '@xstate/react';
import { searchActor } from '../models/searchMachine';

function Search() {
  const [isNoEnoughModalVisible, setIsNoEnoughModalVisible] = useState(false);
  const router = useRouter();
  const state = useSelector(searchActor, (state) => state);
  const mode = useSelector(searchActor, (state) => state.context.mode);
  const showPapers = useSelector(
    searchActor,
    (state) => state.context.showPapers
  );
  const isLoadingList = state.matches({
    viewing: { fetchingPapers: 'fetching' },
  });
  const isLoadingSummary = state.matches({
    viewing: { fetchingSummary: 'fetching' },
  });
  const isFetchPapersSuccess = state.matches({
    viewing: { fetchingPapers: 'success' },
  });
  const isFetchSummarySuccess = state.matches({
    viewing: { fetchingSummary: 'success' },
  });
  const isFetchRelatedSearchSuccess = state.matches({
    viewing: { fetchingRelatedSearch: 'success' },
  });
  const isInitialed = !state.matches('init');
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const isPapersEmptyErrorVisible = useSelector(searchActor, (state) => {
    return (
      isInitialed &&
      !isLoadingSummary &&
      !isLoadingList &&
      !showPapers.length &&
      mode !== 'selected'
    );
  });
  const searchParams = useSearchParams();
  const question = searchParams.get('q');
  const paperSkeletons = useMemo(
    () =>
      Array.from({ length: 3 }).map((item) => (item = { id: Math.random() })),
    []
  );
  const isSearchPapersVisible = useMemo(() => {
    return isInitialed && showPapers.length === 0 && !isLoadingList;
  }, [isInitialed, showPapers.length, isLoadingList]);

  console.log('question1',question)
  useEffect(() => {
    console.log('question2',question)
    searchActor.send({ type: 'SET_QUESTION', value: question });
    searchActor.send({ type: 'RESET' });
    searchActor.send({ type: 'INIT_FETCH' });
    searchActor.send({ type: 'FETCH_PAPERS' });
  }, [question]);

  useEffect(() => {
    if (isFetchPapersSuccess) {
      searchActor.send({ type: 'FETCH_SUMMARY' });
      searchActor.send({ type: 'FETCH_RESPONSE' });
    }
  }, [isFetchPapersSuccess]);

  useEffect(() => {
    if (isFetchRelatedSearchSuccess) {
      return;
    }
    if (isFetchSummarySuccess) {
      searchActor.send({ type: 'FETCH_RELATED_SEARCH' });
    }
  }, [isFetchSummarySuccess, isFetchRelatedSearchSuccess]);

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
              <div className={styles.search_content_data_summary}>
                <Summary
                  setIsNoEnoughModalVisible={setIsNoEnoughModalVisible}
                />
                <FAQList />
              </div>
              <div className={styles.search_content_data_papers}>
                <div className={styles.content_button}>
                  <ModeButtons disabled={isLoadingList || isLoadingSummary} />
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
                    {isSearchPapersVisible && mode !== 'selected' && (
                      <div className={styles.no_papers_tip}>
                        <Image
                          className={styles.no_papers_tip_icon}
                          src={ErrorIcon}
                          alt=""
                        />
                        <div className={styles.no_papers_tip_desc}>
                          该主题没有检测到{mode === 'en' ? '英文' : '中文'}
                          文献，尝试更换输入后再试试吧
                        </div>
                      </div>
                    )}
                    {showPapers.map((item) => {
                      return (
                        <ResultPaperItem
                          key={item.id}
                          data={item}
                          isBorderVisible={true}
                        />
                      );
                    })}
                    {isInitialed &&
                      !isLoadingList &&
                      !isPapersEmptyErrorVisible &&
                      showPapers.length > 0 && (
                        <div>
                          <PageManager />
                        </div>
                      )}
                  </div>
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
