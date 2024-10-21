'use client';
import { useSelector } from '@xstate/react';
import { useMemo, useState } from 'react';
import { searchActor } from '../models/searchMachine';
import styles from './pageManager.module.scss';

export default function PageManager(props) {
  const [typeCount] = useState(5);
  const pageIndex = useSelector(
    searchActor,
    (state) => state.context.pageIndex
  );
  const pageSize = useSelector(searchActor, (state) => state.context.pageSize);
  const context = useSelector(searchActor, (state) => state.context);
  const total = useMemo(() => {
    switch (context.mode) {
      case 'en':
        return context.paperInfo.papers.length;
      case 'zh-cn':
        return context.paperZHInfo.papers.length;
      case 'fund':
        return context.fundInfo.papers.length;
      default:
        return 0;
    }
  }, [
    context.mode,
    context.fundInfo.papers.length,
    context.paperInfo.papers.length,
    context.paperZHInfo.papers.length,
  ]);

  const totalPage = useMemo(() => {
    return pageSize > 0 ? Math.ceil(total / pageSize) : 0;
  }, [total, pageSize]);

  const isGoFirstVisible = useMemo(() => {
    if (pageIndex >= typeCount) {
      return true;
    }
    return false;
  }, [pageIndex, typeCount]);

  const isPrevMore = useMemo(() => {
    if (pageIndex >= typeCount) {
      return true;
    }
    return false;
  }, [pageIndex, typeCount]);

  const isNextMore = useMemo(() => {
    if (pageIndex < totalPage) {
      return true;
    }
    return false;
  }, [pageIndex, totalPage]);

  const pageList = useMemo(() => {
    const list = [];
    let visiblePage = typeCount;
    if (visiblePage > totalPage) {
      visiblePage = totalPage;
    }

    if (pageIndex < visiblePage) {
      for (let i = 0; i < visiblePage; i++) {
        list.push(i + 1);
      }
      return list;
    }

    if (pageIndex - 1 > 0) {
      list.push(pageIndex - 1);
    }
    list.push(pageIndex);

    if (pageIndex + 1 <= totalPage) {
      list.push(pageIndex + 1);
    }

    return list;
  }, [typeCount, totalPage, pageIndex]);

  return (
    <>
      <button
        className={styles.page_prev_button}
        onClick={() => {
          if (pageIndex <= 1) {
            return;
          }
          searchActor.send({ type: 'CHANGE_PAGE_INDEX', value: pageIndex - 1 });
          searchActor.send({ type: 'FETCH_RESPONSE' });
        }}
        data-umami-event="prev page button"
      >
        上一页
      </button>
      {isGoFirstVisible && (
        <button
          className={styles.page_index}
          onClick={() => {
            searchActor.send({ type: 'CHANGE_PAGE_INDEX', value: 1 });
          }}
        >
          1
        </button>
      )}
      {isPrevMore && <span>...</span>}
      {pageList.map((item) =>
        pageIndex === item ? (
          <button key={Math.random()} className={styles.page_index_active}>
            {item}
          </button>
        ) : (
          <button
            key={Math.random()}
            className={styles.page_index}
            onClick={() => {
              searchActor.send({ type: 'CHANGE_PAGE_INDEX', value: item });
              searchActor.send({ type: 'FETCH_RESPONSE' });
            }}
          >
            {item}
          </button>
        )
      )}
      {isNextMore && <span>...</span>}
      <button
        className={styles.page_next_button}
        onClick={() => {
          if (pageIndex + 1 > totalPage) {
            return;
          }
          searchActor.send({ type: 'CHANGE_PAGE_INDEX', value: pageIndex + 1 });
          searchActor.send({ type: 'FETCH_RESPONSE' });
        }}
        data-umami-event="next page button"
      >
        下一页
      </button>
    </>
  );
}
