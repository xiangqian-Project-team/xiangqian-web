import { DownOutlined } from '@ant-design/icons';
import { useSelector } from '@xstate/react';
import { Skeleton } from 'antd';
import { useState } from 'react';
import { IPopoverInfo, searchActor } from '../models/searchMachine';
import { getBulletPointsExpansion } from '../service';
import styles from './page.module.scss';
import PopoverItem from './summaryPopoverItem';

export default function SummaryPopover(props: {
  data: IPopoverInfo;
  getPopoverResponsePedia: any;
}) {
  const { data, getPopoverResponsePedia } = props;
  const list = data.popoverList;
  const expensionPopoverList = data.expensionPopoverList;
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const allPapers = useSelector(searchActor, (state) =>
    state.context.paperInfo.papers.concat(state.context.paperZHInfo.papers)
  );

  const fetchBulletPointsExpansion = async () => {
    if (expensionPopoverList.length) {
      return;
    }
    const idSet = new Set(list.map((item) => item.id));
    const thePapers = allPapers.filter((item) => {
      return idSet.has(`${item.id}`);
    });
    const bltpt = list.map((item) => item.text).join('');
    setIsLoading(true);
    try {
      const res = await getBulletPointsExpansion({
        bltpt,
        papers: thePapers,
      });
      if (!res.ok) {
        throw new Error('Failed get response');
      }
      const resData = (await res.json()) as { bltptExpansion: string };
      searchActor.send({
        type: 'SET_EXPENSION_TEXT',
        value: {
          text: resData.bltptExpansion,
          key: data.key,
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  // const splitText = useMemo(() => {
  //   const pattern = /(\[.*?\])/g;
  //   const splitText = (text || '').split(pattern);
  //   return splitText;
  // }, [text]);

  // if (list.length <= 1) {
  //   return (
  //     <div
  //       onClick={() => {
  //         setIsOpen(!isOpen);
  //       }}
  //     >
  //       {isOpen ? (
  //         <DownOutlined
  //           className={styles.down_icon_active}
  //           onPointerEnterCapture={undefined}
  //           onPointerLeaveCapture={undefined}
  //           onClick={() => {
  //             setIsOpen(!isOpen);
  //           }}
  //         />
  //       ) : (
  //         <DownOutlined
  //           className={styles.down_icon}
  //           onPointerEnterCapture={undefined}
  //           onPointerLeaveCapture={undefined}
  //           onClick={() => {
  //             setIsOpen(!isOpen);
  //             fetchBulletPointsExpansion();
  //           }}
  //         />
  //       )}
  //       {list.map((item) => item.text)}
  //       {isOpen && (
  //         <div className={styles.expension_text}>
  //           <Skeleton
  //             active
  //             title={false}
  //             style={{ width: '80%' }}
  //             loading={isLoading}
  //           >
  //             {expensionText}
  //           </Skeleton>
  //         </div>
  //       )}
  //     </div>
  //   );
  // }

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
          item={item}
          getPopoverResponsePedia={getPopoverResponsePedia}
        />
      ))}

      {isOpen && (
        <div className={styles.expension_text}>
          <Skeleton
            active
            title={false}
            style={{ width: '80%' }}
            loading={isLoading}
          >
            {expensionPopoverList.map((item) => (
              <PopoverItem
                key={item.key}
                item={item}
                getPopoverResponsePedia={getPopoverResponsePedia}
              />
            ))}
          </Skeleton>
        </div>
      )}
    </div>
  );
}
