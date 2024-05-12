import { Button, ConfigProvider } from 'antd';
import { useAtom } from 'jotai';
import Image from 'next/image';
import LangCNIcon from '../icons/lang_cn.svg';
import LangCNActiveIcon from '../icons/lang_cn_active.svg';
import LangENIcon from '../icons/lang_en.svg';
import LangENActiveIcon from '../icons/lang_en_active.svg';
import SelectedActiveButtonIcon from '../icons/selected_active_button_icon.svg';
import SelectedButtonIcon from '../icons/selected_button_icon.svg';
import { modeAtom } from '../models/search';
import SortIcon from '../icons/sort_icon.svg';
import styles from './page.module.scss';

interface IModeButtonsProps {
  mode: string;
  setMode: (mode: string) => void;
  disabled: boolean;
  onModeChangeClick: () => void;
  onResultSortByTimeClick: () => void;
  isLoadingList: boolean;
  isLoadingSummary: boolean;
  isSortActive: boolean;
  setPageIndex: (index: number) => void;
}

export default function ModeButtons(props: IModeButtonsProps) {
  const [mode, setMode] = useAtom(modeAtom);

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
        {props.isSortActive ? (
          <Button
            className={styles.sort_button_active}
            disabled={props.isLoadingList || props.isLoadingSummary}
            onClick={() => {
              props.onResultSortByTimeClick();
            }}
          >
            近期发表
            <Image className={styles.sort_button_icon} src={SortIcon} alt={''} />
          </Button>
        ) : (
          <Button
            className={styles.sort_button}
            disabled={props.isLoadingList || props.isLoadingSummary}
            onClick={() => {
              props.onResultSortByTimeClick();
            }}
          >
            近期发表
            <Image className={styles.sort_button_icon} src={SortIcon} alt={''} />
          </Button>
        )}
      </ConfigProvider>
    </>
  );
}
