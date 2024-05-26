import { DownOutlined } from '@ant-design/icons';
import { useSelector } from '@xstate/react';
import { Popover, Skeleton } from 'antd';
import { useAtomValue } from 'jotai';
import { useState } from 'react';
import ResultPaperItem from '../components/resultPaperItem';
import { papersAtom, papersAtomZH } from '../models/search';
import { searchActor } from '../models/searchMachine';
import styles from './page.module.scss';

// function PopoverItemSon(props: {
//   paper: any;
//   authors: string;
//   year: string;
//   getPopoverResponsePedia: (paper: any) => void;
// }) {
//   const [checkedPapers, setCheckedPapers] = useAtom(checkedPapersAtom);
//   // const [visibleSummaryPopoverID, setVisibleSummaryPopoverID] = useAtom(
//   //   visibleSummaryPopoverIDAtom
//   // );

//   const {
//     paper,
//     authors,
//     year,
//     getPopoverResponsePedia,
//   } = props;

//   return (
//     <>
//       <Popover
//         // key={paper.id}
//         placement="rightTop"
//         trigger="click"
//         // open={visibleSummaryPopoverID === paper.id}
//         overlayStyle={{ padding: 0, maxWidth: 790 }}
//         onOpenChange={(visible) => {
//           if (!visible) {
//             return;
//           }
//           // setVisibleSummaryPopoverID(paper.id);
//           if (paper.response) {
//             return;
//           }
//           getPopoverResponsePedia(paper);
//         }}
//         // content={
//         //   <ResultPaperItem
//         //     data={paper}
//         //     checkedPapers={checkedPapers}
//         //     setCheckedPapers={setCheckedPapers}
//         //   />
//         // }
//       >
//         <span className={styles.mark_author_year}>
//           （{authors}，{year}）
//         </span>
//       </Popover>
//     </>
//   );
// }

function PopoverItem(props: {
  item: {
    type: 'text' | 'popover';
    text: string;
    id?: string;
    key: number;
    isVisible: boolean;
  };
  getPopoverResponsePedia: (paper: any) => void;
}) {
  const { item, getPopoverResponsePedia } = props;
  const papers = useSelector(
    searchActor,
    (state) => state.context.paperInfo.papers
  );
  const papersZH = useSelector(
    searchActor,
    (state) => state.context.paperZHInfo.papers
  );
  // const [visibleSummaryPopoverID, setVisibleSummaryPopoverID] = useState(
  //   visibleSummaryPopoverIDAtom
  // );

  if (item.type === 'popover') {
    const paper = [...papers, ...papersZH].find(
      (paper) => paper.id === item.id
    );
    // const paper = [...papers, ...papersZH].find((item) => item.id === item.id);

    return (
      <Popover
        placement="rightTop"
        trigger="click"
        open={item.isVisible}
        // open={visibleSummaryPopoverID === paper.id}
        overlayStyle={{ padding: 0, maxWidth: 790 }}
        onOpenChange={(visible) => {
          searchActor.send({
            type: 'TOGGLE_POPOVER_VISIBLE',
            value: { key: item.key, isVisible: visible },
          });
          if (!visible) {
            return;
          }
          // setVisibleSummaryPopoverID(paper.id);
          if (paper.response) {
            return;
          }
          getPopoverResponsePedia(paper);
        }}
        content={
          <ResultPaperItem
            data={paper}
            // checkedPapers={[]}
            // setCheckedPapers={() => {}}
            // checkedPapers={checkedPapers}
            // setCheckedPapers={setCheckedPapers}
          />
        }
      >
        <span className={styles.mark_author_year}>{item.text}</span>
      </Popover>
    );
  }

  return item.text;
}

export default function SummaryPopover(props: {
  list: {
    type: 'text' | 'popover';
    text: string;
    id?: string;
    key: number;
    isVisible: boolean;
  }[];
  getPopoverResponsePedia: any;
}) {
  const { list, getPopoverResponsePedia } = props;
  const [openList, setOpenList] = useState<string[]>([]);
  const papers = useAtomValue(papersAtom);
  const papersZH = useAtomValue(papersAtomZH);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [expensionText, setExpensionText] = useState<string | undefined>(
    undefined
  );

  const fetchBulletPointsExpansion = async () => {
    // if (expensionText) {
    //   return;
    // }
    // const pattern = /\[(.*?)\]/g;
    // const matches = Array.from(text.matchAll(pattern));
    // let idSet = new Set();
    // for (let match of matches) {
    //   idSet.add(match[1]);
    // }
    // const thePapers = [...papers, ...papersZH].filter((item) => {
    //   return idSet.has(`${item.id}`);
    // });
    // setIsLoading(true);
    // try {
    //   const res = await getBulletPointsExpansion({
    //     bltpt: props.text,
    //     papers: thePapers,
    //   });
    //   if (!res.ok) {
    //     throw new Error('Failed get response');
    //   }
    //   const data = await res.json();
    //   setExpensionText(data.bltptExpansion);
    // } finally {
    //   setIsLoading(false);
    // }
  };

  // const splitText = useMemo(() => {
  //   const pattern = /(\[.*?\])/g;
  //   const splitText = (text || '').split(pattern);
  //   return splitText;
  // }, [text]);

  if (list.length <= 1) {
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
        {list.map((item) => item.text)}
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
      {list.map((item) => (
        <PopoverItem
          key={item.key}
          // text={text}
          item={item}
          getPopoverResponsePedia={getPopoverResponsePedia}
        />
      ))}

      {/* {isOpen && (
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
      )} */}
    </div>
  );
}
