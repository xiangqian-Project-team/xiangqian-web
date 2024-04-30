'use client';
import { useMemo, useState } from 'react';
import styles from './pageManager.module.scss';

export default function PageManager(props: {
  pageIndex: number;
  total: number;
  pageSize: number;
  setPageIndex: (pageIndex: number) => void;
}) {
  const [typeCount] = useState(5)
  const { pageIndex, total, pageSize, setPageIndex } = props;

  const totalPage = useMemo(() => {
    return pageSize > 0 ? Math.ceil(total / pageSize) : 0;
  }, [total, pageSize]);

  const isGoFirstVisible = useMemo(() => {
    if (pageIndex >= typeCount) {
      return true;
    }
    return false;
  }, [pageIndex]);

  const isPrevMore = useMemo(() => {
    if (pageIndex >= typeCount) {
      return true;
    }
    return false;
  }, [pageIndex]);

  const isNextMore = useMemo(() => {
    if (pageIndex < totalPage) {
      return true;
    }
    return false;
  }, [pageIndex, total, pageSize]);

  const pageList = useMemo(() => {
    const list: number[] = [];
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

    list.push(pageIndex - 1, pageIndex);

    if (pageIndex + 1 <= totalPage) {
      list.push(pageIndex + 1);
    }

    return list;
  }, [pageIndex, total, pageSize]);

    return (
      <>
        <button
          className={styles.page_prev_button}
          onClick={() => {
            if (pageIndex <= 1) {
              return;
            }
            setPageIndex(pageIndex - 1);
          }}
        >
          上一页
        </button>
        {isGoFirstVisible && (
          <button
            className={styles.page_index}
            onClick={() => {
              setPageIndex(1);
            }}
          >
            1
          </button>
        )}
        {isPrevMore && <span>...</span>}
        {pageList.map((item) =>
          pageIndex === item ? (
            <button className={styles.page_index_active}>{item}</button>
          ) : (
            <button
              className={styles.page_index}
              onClick={() => {
                setPageIndex(item);
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
            setPageIndex(pageIndex + 1);
          }}
        >
          下一页
        </button>
      </>
    );
}
