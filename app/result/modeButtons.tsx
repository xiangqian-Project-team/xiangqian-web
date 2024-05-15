import { Button, ConfigProvider } from 'antd';
import { useAtom } from 'jotai';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import LangCNIcon from '../icons/lang_cn.svg';
import LangCNActiveIcon from '../icons/lang_cn_active.svg';
import LangENIcon from '../icons/lang_en.svg';
import LangENActiveIcon from '../icons/lang_en_active.svg';
import SelectedActiveButtonIcon from '../icons/selected_active_button_icon.svg';
import SelectedButtonIcon from '../icons/selected_button_icon.svg';
import SortIcon from '../icons/sort_icon.svg';
import { modeAtom, sortModeAtom } from '../models/search';
import styles from './page.module.scss';

interface IModeButtonsProps {
  disabled: boolean;
  onModeChangeClick: () => void;
  setPageIndex: (index: number) => void;
}

export default function ModeButtons(props: IModeButtonsProps) {
  const [mode, setMode] = useAtom(modeAtom);
  const [isSortMenuVisible, setIsSortMenuVisible] = useState(false);
  const [sortMode, setSortMode] = useAtom(sortModeAtom);

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
              setMode('en');
              setSortMode('default');
              props.onModeChangeClick();
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
              setMode('zh-cn');
              setSortMode('default');
              props.onModeChangeClick();
            }}
          >
            <Image src={LangCNIcon.src} width={18} height={18} alt={''} />
            中文文献
          </Button>
        )}
        {mode === 'selected' ? (
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
              setMode('selected');
              setSortMode('default');
              props.onModeChangeClick();
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
        )}
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
                setSortMode('default');
                setIsSortMenuVisible(false);
                props.onModeChangeClick();
              }}
            >
              推荐排序
            </button>
            <button
              className={
                sortMode === 'relevance' ? styles.popup_sort_button_active : ''
              }
              onClick={() => {
                setSortMode('relevance');
                setIsSortMenuVisible(false);
                props.onModeChangeClick();
              }}
            >
              相关程度
            </button>
            <button
              className={
                sortMode === 'time' ? styles.popup_sort_button_active : ''
              }
              onClick={() => {
                setSortMode('time');
                setIsSortMenuVisible(false);
                props.onModeChangeClick();
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
                setSortMode('quote');
                setIsSortMenuVisible(false);
                props.onModeChangeClick();
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
