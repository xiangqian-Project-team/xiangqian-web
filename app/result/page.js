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
import MainSummary from './mainSummary';
import ModeButtons from './modeButtons';
import styles from './page.module.scss';
import PageManager from './pageManager';
import Summary from './summary';

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
  const isLoadingPapers = state.matches({
    viewing: { fetchingPapers: 'fetching' },
  });
  const isLoadingFundPapers = state.matches({
    viewing: { fetchingFund: 'fetching' },
  });
  const isLoadingSummary = state.matches({
    viewing: { fetchingSummaryAnswer: 'fetching' },
  });
  const isFetchPapersSuccess = state.matches({
    viewing: { fetchingPapers: 'success' },
  });
  const isFetchFundPapersSuccess = state.matches({
    viewing: { fetchingFund: 'success' },
  });
  const isFetchSummarySuccess = state.matches({
    viewing: { fetchingSummaryAnswer: 'success' },
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
      !isLoadingPapers &&
      !isLoadingFundPapers &&
      !showPapers.length
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
    return (
      isInitialed &&
      showPapers.length === 0 &&
      !isLoadingPapers &&
      !isLoadingFundPapers
    );
  }, [isInitialed, showPapers.length, isLoadingPapers, isLoadingFundPapers]);

  // reset all state when quit
  useEffect(() => {
    return () => {
      searchActor.send({ type: 'RESET_FETCH_PAPERS' });
      searchActor.send({ type: 'RESET_FETCH_SUMMARY_CONCEPT' });
      searchActor.send({ type: 'RESET_FETCH_SUMMARY_QUERY_TERMS' });
      searchActor.send({ type: 'RESET_FETCH_SUMMARY_BACKGROUND' });
      // searchActor.send({ type: 'RESET_FETCH_LITERATURE_REVIEW' });
      searchActor.send({ type: 'RESET_FETCH_RELATED' });
      searchActor.send({ type: 'RESET' });
    };
  }, []);

  useEffect(() => {
    searchActor.send({ type: 'SET_QUESTION', value: question });
    searchActor.send({ type: 'CHANGE_PAGE_INDEX', value: 1 });
    searchActor.send({ type: 'RESET_FETCH_PAPERS' });
    searchActor.send({ type: 'RESET_FETCH_SUMMARY_CONCEPT' });
    searchActor.send({ type: 'RESET_FETCH_SUMMARY_QUERY_TERMS' });
    searchActor.send({ type: 'RESET_FETCH_SUMMARY_BACKGROUND' });
    // searchActor.send({ type: 'RESET_FETCH_LITERATURE_REVIEW' });
    searchActor.send({ type: 'RESET_FETCH_RELATED' });
    searchActor.send({ type: 'RESET' });
    searchActor.send({ type: 'INIT_FETCH' });
    if (mode === 'fund') {
      searchActor.send({ type: 'FETCH_FUND' });
    } else {
      searchActor.send({ type: 'FETCH_PAPERS' });
    }
    searchActor.send({ type: 'FETCH_SUMMARY_CONCEPT' });
    searchActor.send({ type: 'FETCH_SUMMARY_QUERY_TERMS' });
    searchActor.send({ type: 'FETCH_SUMMARY_BACKGROUND' });
  }, [question]);

  useEffect(() => {
    if (isFetchPapersSuccess) {
      searchActor.send({ type: 'FETCH_SUMMARY_ANALYSIS' });
      searchActor.send({ type: 'FETCH_SUMMARY_BULLET_POINTS' });
      searchActor.send({ type: 'FETCH_RELATED_SEARCH' });
      searchActor.send({ type: 'FETCH_RESPONSE' });
    }
  }, [isFetchPapersSuccess]);

  useEffect(() => {
    if (isFetchFundPapersSuccess) {
      searchActor.send({ type: 'FETCH_RESPONSE' });
    }
  }, [isFetchFundPapersSuccess]);

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
          <SearchTextArea isLoading={isLoadingPapers || isLoadingSummary} />
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
            <>
              <MainSummary />
              <div className={styles.content_button}>
                <ModeButtons disabled={isLoadingPapers || isLoadingSummary} />
              </div>
              <div className={styles.search_content_data}>
                <div className={styles.search_content_data_summary}>
                  <Summary
                    setIsNoEnoughModalVisible={setIsNoEnoughModalVisible}
                  />
                  <FAQList />
                </div>
                <div className={styles.search_content_data_papers}>
                  {mode !== 'fund' &&
                    isLoadingPapers &&
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
                  {mode === 'fund' &&
                    isLoadingFundPapers &&
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
                            mode={mode}
                            key={item.id}
                            data={item}
                            isBorderVisible={true}
                          />
                        );
                      })}
                      {isInitialed &&
                        !isLoadingPapers &&
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
            </>
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
