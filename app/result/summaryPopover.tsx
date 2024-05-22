import { DownOutlined } from '@ant-design/icons';
import { Popover, Skeleton } from 'antd';
import { useAtom, useAtomValue } from 'jotai';
import { ReactElement, useMemo, useState } from 'react';
import ResultPaperItem from '../components/resultPaperItem';
import {
  checkedPapersAtom,
  papersAtom,
  papersAtomZH,
  visibleSummaryPopoverIDAtom,
} from '../models/search';
import { getBulletPointsExpansion } from '../service';
import styles from './page.module.scss';

function PopoverItemSon(props: {
  paper: any;
  authors: string;
  year: string;
  getPopoverResponsePedia: (paper: any) => void;
}) {
  const [checkedPapers, setCheckedPapers] = useAtom(checkedPapersAtom);
  const [visibleSummaryPopoverID, setVisibleSummaryPopoverID] = useAtom(
    visibleSummaryPopoverIDAtom
  );

  const {
    paper,
    authors,
    year,
    getPopoverResponsePedia,
  } = props;

  return (
    <>
      <Popover
        key={paper.id}
        placement="rightTop"
        trigger="click"
        open={visibleSummaryPopoverID === paper.id}
        overlayStyle={{ padding: 0, maxWidth: 790 }}
        onOpenChange={(visible) => {
          if (!visible) {
            return;
          }
          setVisibleSummaryPopoverID(paper.id);
          if (paper.response) {
            return;
          }
          getPopoverResponsePedia(paper);
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
          （{authors}，{year}）
        </span>
      </Popover>
    </>
  );
}

function PopoverItem(props: {
  text: string;
  getPopoverResponsePedia: (paper: any) => void;
}) {
  const { text, getPopoverResponsePedia } = props;
  const papers = useAtomValue(papersAtom);
  const papersZH = useAtomValue(papersAtomZH);

  const pattern = /(\[.*?\])/g;
  const matches = text.match(pattern) || [];
  const splitText = text.split(pattern);
  const formattedStr = splitText.reduce<(string | ReactElement)[]>(
    (arr, element) => {
      // @ts-ignore
      if (matches.includes(element)) {
        const id = element.replace(/^\[(.+)\]$/, '$1');
        const paper = [...papers, ...papersZH].find((item) => item.id === id);
        const authors = paper?.authors[0] || '';
        const year = paper?.year || '';
        return [
          ...arr,
          <PopoverItemSon
            key={id}
            paper={paper}
            authors={authors}
            year={year}
            getPopoverResponsePedia={getPopoverResponsePedia}
          />,
        ];
      }
      return [...arr, element];
    },
    []
  );

  return formattedStr;
}

export default function SummaryPopover(props: {
  text: string;
  getPopoverResponsePedia: any;
}) {
  const { text, getPopoverResponsePedia } = props;
  const [openList, setOpenList] = useState<string[]>([]);
  const papers = useAtomValue(papersAtom);
  const papersZH = useAtomValue(papersAtomZH);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [expensionText, setExpensionText] = useState<string | undefined>(
    undefined
  );

  const fetchBulletPointsExpansion = async () => {
    if (expensionText) {
      return;
    }
    const pattern = /\[(.*?)\]/g;
    const matches = Array.from(text.matchAll(pattern));
    let idSet = new Set();
    for (let match of matches) {
      idSet.add(match[1]);
    }
    const thePapers = [...papers, ...papersZH].filter((item) => {
      return idSet.has(`${item.id}`);
    });
    setIsLoading(true);
    try {
      const res = await getBulletPointsExpansion({
        bltpt: props.text,
        papers: thePapers,
      });
      if (!res.ok) {
        throw new Error('Failed get response');
      }
      const data = await res.json();
      setExpensionText(data.bltptExpansion);
    } finally {
      setIsLoading(false);
    }
  };

  const splitText = useMemo(() => {
    const pattern = /(\[.*?\])/g;
    const splitText = (text || '').split(pattern);
    return splitText;
  }, [text]);

  if (splitText.length <= 1) {
    return (
      <div
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        {isOpen ? (
          <DownOutlined
            className={styles.down_icon_active}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
            onClick={() => {
              setIsOpen(!isOpen);
            }}
          />
        ) : (
          <DownOutlined
            className={styles.down_icon}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
            onClick={() => {
              setIsOpen(!isOpen);
              fetchBulletPointsExpansion();
            }}
          />
        )}
        {text}
        {isOpen && (
          <div className={styles.expension_text}>
            <Skeleton
              active
              title={false}
              style={{ width: '80%' }}
              loading={isLoading}
            >
              {/* {expensionText} */}
            </Skeleton>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className="summary_item_container"
      onClick={(e) => {
        // @ts-ignore TODO fix typo
        if (e.target.class !== 'summary_item_container') {
          return;
        }
        setIsOpen(!isOpen);
        if (!isOpen) {
          fetchBulletPointsExpansion();
        }
      }}
    >
      {isOpen ? (
        <DownOutlined
          className={styles.down_icon_active}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
          onClick={() => {
            setIsOpen(!isOpen);
          }}
        />
      ) : (
        <DownOutlined
          className={styles.down_icon}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
          onClick={() => {
            setIsOpen(!isOpen);
            fetchBulletPointsExpansion();
          }}
        />
      )}
      <PopoverItem
        text={text}
        getPopoverResponsePedia={getPopoverResponsePedia}
      />
      {isOpen && (
        <div className={styles.expension_text}>
          <Skeleton
            active
            title={false}
            style={{ width: '80%' }}
            loading={isLoading}
          >
            <PopoverItem
              text={expensionText}
              getPopoverResponsePedia={getPopoverResponsePedia}
            />
          </Skeleton>
        </div>
      )}
    </div>
  );
}
