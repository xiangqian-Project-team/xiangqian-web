import { DownOutlined } from '@ant-design/icons';
import { useSelector } from '@xstate/react';
import { Skeleton } from 'antd';
import { useState } from 'react';
import { IPopoverInfo, searchActor } from '../models/searchMachine';
import { getBulletPointsExpansion } from '../service';
import styles from './page.module.scss';
import PopoverItem from './summaryPopoverItem';

declare const umami: any;

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
    const idSet = new Set((data.paperList || []).map((item) => item.id));
    const thePapers = allPapers.filter((item) => {
      return idSet.has(`${item.id}`);
    });
    setIsLoading(true);
    try {
      umami.track('Bullet Point Expanded');
      const res = await getBulletPointsExpansion({
        bltpt: `${data.title.text}:${data.desc.text}`,
        papers: thePapers,
      });
      if (!res.ok) {
        throw new Error('Failed get response');
      }
      const resData: string = await res.json();
      searchActor.send({
        type: 'SET_EXPENSION_TEXT',
        value: {
          text: resData,
          key: data.key,
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.summary_item_container_bg}>
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
        {data.title.text !== '其他' && (
          <>
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
          </>
        )}
        <div className={styles.summary_item_title}>{data.title.text}</div>
        <div className={styles.summary_item_authors}>
          {list.map((item) => (
            <PopoverItem
              key={item.key}
              item={item}
              getPopoverResponsePedia={getPopoverResponsePedia}
            />
          ))}
        </div>
        <div>{data.desc.text}</div>
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
    </div>
  );
}
