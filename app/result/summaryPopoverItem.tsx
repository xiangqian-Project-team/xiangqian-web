import { useSelector } from '@xstate/react';
import { Popover } from 'antd';
import ResultPaperItem from '../components/resultPaperItem';
import { searchActor } from '../models/searchMachine';
import styles from './page.module.scss';

export default function PopoverItem(props: {
  item: {
    type: 'text' | 'popover';
    text: string;
    id?: string;
    key: number;
    isVisible: boolean;
  };
  getPopoverResponsePedia: (paper: any, queryZh: string) => void;
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
  const queryZh = useSelector(
    searchActor,
    (state) => state.context.paperInfo.queryZh
  );

  if (item.type === 'popover') {
    const paper = [...papers, ...papersZH].find(
      (paper) => paper.id === item.id
    );

    return (
      <Popover
        placement="rightTop"
        trigger="click"
        open={item.isVisible}
        overlayStyle={{ padding: 0, maxWidth: 790 }}
        onOpenChange={(visible) => {
          searchActor.send({
            type: 'TOGGLE_POPOVER_VISIBLE',
            value: { key: item.key, isVisible: visible },
          });
          if (!visible) {
            return;
          }
          umami.track('Popover Opened');
          if (paper.response) {
            return;
          }
          getPopoverResponsePedia(paper, queryZh);
        }}
        content={<ResultPaperItem data={paper} />}
      >
        <span className={styles.mark_author_year}>{item.text}</span>
      </Popover>
    );
  }

  return item.text;
}
