import { useSelector } from '@xstate/react';
import { Button, ConfigProvider, message } from 'antd';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import LangCNIcon from '../icons/lang_cn.svg';
import LangCNActiveIcon from '../icons/lang_cn_active.svg';
import LangENIcon from '../icons/lang_en.svg';
import LangENActiveIcon from '../icons/lang_en_active.svg';
import SortIcon from '../icons/sort_icon.svg';
import { SortMode, searchActor } from '../models/searchMachine';
import styles from './page.module.scss';

interface IModeButtonsProps {
  disabled: boolean;
}

export default function ModeButtons(props: IModeButtonsProps) {
  const sortMode = useSelector(searchActor, (state) => state.context.sortMode);
  const mode = useSelector(searchActor, (state) => state.context.mode);
  const [isSortMenuVisible, setIsSortMenuVisible] = useState(false);

  const sortModeText = useMemo(() => {
    switch (sortMode) {
      case 'relevance':
        return '相关程度';
      case 'time':
        return '发表时间';
      case 'level':
        return '期刊级别';
      case 'quote':
        return '引用数量';
    }
    return '推荐排序';
  }, [sortMode]);

  return (
    <>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#000',
          },
          components: {
            Button: {
              paddingInlineSM: 34,
              defaultColor: '#000',
              defaultBg: '#FFF',
              defaultHoverBg: '#99E0ED',
              defaultHoverBorderColor: '#EEE',
            },
          },
        }}
      >
        {mode === 'en' ? (
          <Button className={styles.en_button_active} disabled={props.disabled}>
            <Image src={LangENActiveIcon.src} width={18} height={18} alt={''} />
            英文文献
          </Button>
        ) : (
          <Button
            className={styles.en_button}
            disabled={props.disabled}
            onClick={() => {
              // setMode('en');
              // setSortMode('default');
              // props.onModeChangeClick();
              searchActor.send({ type: 'CHANGE_MODE.EN' });
              searchActor.send({
                type: 'CHANGE_SORT_MODE',
                value: SortMode.DEFAULT,
              });
              searchActor.send({ type: 'CHANGE_PAGE_INDEX', value: 1 });
              searchActor.send({ type: 'FETCH_PAPERS' });
            }}
          >
            <Image src={LangENIcon.src} width={18} height={18} alt={''} />
            英文文献
          </Button>
        )}
        {mode === 'zh-cn' ? (
          <Button className={styles.cn_button_active} disabled={props.disabled}>
            <Image src={LangCNActiveIcon.src} width={18} height={18} alt={''} />
            中文文献
          </Button>
        ) : (
          <Button
            className={styles.cn_button}
            disabled={props.disabled}
            onClick={() => {
              searchActor.send({ type: 'CHANGE_MODE.ZH_CN' });
              searchActor.send({
                type: 'CHANGE_SORT_MODE',
                value: SortMode.DEFAULT,
              });
              searchActor.send({ type: 'CHANGE_PAGE_INDEX', value: 1 });
              searchActor.send({ type: 'FETCH_PAPERS' });
            }}
          >
            <Image src={LangCNIcon.src} width={18} height={18} alt={''} />
            中文文献
          </Button>
        )}
        <Button
          className={styles.right_button}
          disabled={props.disabled}
          onClick={() => {
            message.info({ content: '即将上线', duration: 5 });
          }}
        >
          基金课题
        </Button>
        {/* {mode === 'selected' ? (
          <Button
            className={styles.selected_button_active}
            disabled={props.disabled}
          >
            <Image
              src={SelectedActiveButtonIcon.src}
              width={18}
              height={18}
              alt={''}
            />
            我选中的
          </Button>
        ) : (
          <Button
            className={styles.selected_button}
            disabled={props.disabled}
            onClick={() => {
              // setMode('selected');
              // setSortMode('default');
              // props.onModeChangeClick();
              // searchActor.send({
              //   type: 'CHANGE_MODE',
              //   value: SearchMode.SELECTED,
              // });
              searchActor.send({ type: 'CHANGE_MODE.SELECTED' });
              searchActor.send({
                type: 'CHANGE_SORT_MODE',
                value: SortMode.DEFAULT,
              });
              searchActor.send({ type: 'CHANGE_PAGE_INDEX', value: 1 });
            }}
          >
            <Image
              src={SelectedButtonIcon.src}
              width={18}
              height={18}
              alt={''}
            />
            我选中的
          </Button>
        )} */}
        <Button
          className={styles.sort_button}
          disabled={props.disabled}
          onClick={() => {
            setIsSortMenuVisible(!isSortMenuVisible);
          }}
        >
          {sortModeText}
          <Image className={styles.sort_button_icon} src={SortIcon} alt={''} />
        </Button>
        {isSortMenuVisible && (
          <div className={styles.popup_sort_buttons}>
            <button
              className={
                sortMode === 'default' ? styles.popup_sort_button_active : ''
              }
              onClick={() => {
                // setSortMode('default');
                // props.onModeChangeClick();
                searchActor.send({
                  type: 'CHANGE_SORT_MODE',
                  value: SortMode.DEFAULT,
                });
                setIsSortMenuVisible(false);
                searchActor.send({ type: 'CHANGE_PAGE_INDEX', value: 1 });
              }}
            >
              推荐排序
            </button>
            <button
              className={
                sortMode === 'relevance' ? styles.popup_sort_button_active : ''
              }
              onClick={() => {
                searchActor.send({
                  type: 'CHANGE_SORT_MODE',
                  value: SortMode.RELEVANCE,
                });
                setIsSortMenuVisible(false);
                searchActor.send({ type: 'CHANGE_PAGE_INDEX', value: 1 });
                searchActor.send({ type: 'FETCH_RESPONSE' });
              }}
            >
              相关程度
            </button>
            <button
              className={
                sortMode === 'time' ? styles.popup_sort_button_active : ''
              }
              onClick={() => {
                searchActor.send({
                  type: 'CHANGE_SORT_MODE',
                  value: SortMode.TIME,
                });
                setIsSortMenuVisible(false);
                searchActor.send({ type: 'CHANGE_PAGE_INDEX', value: 1 });
                searchActor.send({ type: 'FETCH_RESPONSE' });
              }}
            >
              发表时间
            </button>
            {/* <button
              className={
                sortMode === 'level' ? styles.popup_sort_button_active : ''
              }
              onClick={() => {
                setSortMode('level');
                setIsSortMenuVisible(false);
              }}
            >
              期刊级别
            </button> */}
            <button
              className={
                sortMode === 'quote' ? styles.popup_sort_button_active : ''
              }
              onClick={() => {
                searchActor.send({
                  type: 'CHANGE_SORT_MODE',
                  value: SortMode.QUOTE,
                });
                setIsSortMenuVisible(false);
                searchActor.send({ type: 'CHANGE_PAGE_INDEX', value: 1 });
                searchActor.send({ type: 'FETCH_RESPONSE' });
              }}
            >
              引用数量
            </button>
          </div>
        )}
      </ConfigProvider>
    </>
  );
}
