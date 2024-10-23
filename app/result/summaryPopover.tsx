import { DownOutlined } from '@ant-design/icons';
import { useSelector } from '@xstate/react';
import { Button, ConfigProvider, Modal, Skeleton } from 'antd';
import { useMemo, useState } from 'react';
import { IPopoverInfo, searchActor } from '../models/searchMachine';
import {
  getBulletPointsExpansion,
  getBulletPointsLiteraturePreview,
} from '../service';
import { handlePopoverContentExtension } from '../utils/dataHandler';
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
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [preview, setPreview] = useState('');
  const allPapers = useSelector(searchActor, (state) =>
    state.context.paperInfo.papers.concat(state.context.paperZHInfo.papers)
  );

  const previewPopoverList = useMemo(() => {
    return handlePopoverContentExtension(preview, allPapers);
  }, [allPapers, preview]);

  const fetchBulletPointsLiteraturePreview = async () => {
    if (preview) {
      setIsPreviewVisible(true);
      return;
    }

    try {
      setIsLoadingPreview(true);

      const idSet = new Set((data.paperList || []).map((item) => item.id));
      const thePapers = allPapers.filter((item) => {
        return idSet.has(`${item.id}`);
      });
      const res = await getBulletPointsLiteraturePreview({
        bltpt: `${data.title.text}:${data.desc.text}`,
        papers: thePapers,
      });
      if (!res.ok) {
        throw new Error('Failed get literature preview');
      }
      const resData: string = await res.json();

      setPreview(resData);
      setIsPreviewVisible(true);
    } finally {
      setIsLoadingPreview(false);
    }
  };

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
              // @ts-ignore
              <DownOutlined
                className={styles.down_icon_active}
                onClick={() => {
                  setIsOpen(!isOpen);
                }}
              />
            ) : (
              // @ts-ignore
              <DownOutlined
                className={styles.down_icon}
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
          <>
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
            {!isLoading && (
              <div className={styles.generate_review}>
                <ConfigProvider
                  theme={{
                    token: {
                      colorPrimary: '#6F9EC1',
                      borderRadius: 50,
                      colorBorder: '#000',
                    },
                  }}
                >
                  <Button
                    loading={isLoadingPreview}
                    onClick={async () => {
                      fetchBulletPointsLiteraturePreview();
                    }}
                  >
                    生成综述
                  </Button>
                </ConfigProvider>
              </div>
            )}
          </>
        )}
      </div>
      <Modal
        title="综述"
        open={isPreviewVisible}
        onCancel={() => {
          setIsPreviewVisible(false);
        }}
        footer={null}
        width={552}
        wrapClassName={styles.previewModal}
      >
        <div>
          {previewPopoverList.map((item) => (
            <PopoverItem
              key={item.key}
              item={item}
              getPopoverResponsePedia={getPopoverResponsePedia}
            />
          ))}
        </div>
      </Modal>
    </div>
  );
}
