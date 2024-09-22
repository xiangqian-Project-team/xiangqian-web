/*
 * @Author: 何泽颖 hezeying@autowise.ai
 * @Date: 2024-02-23 10:47:08
 * @LastEditors: 何泽颖 hezeying@autowise.ai
 * @LastEditTime: 2024-03-05 19:55:50
 * @FilePath: /xiangqian-web/app/components/homeTextArea.js
 * @Description:
 */
'use client';
import Icon from '@ant-design/icons';
import { Button, Input, message } from 'antd';
// import { useRouter } from 'next/navigation';
import { useSelector } from '@xstate/react';
import { useRouter } from 'next-nprogress-bar';
import { useEffect } from 'react';
import withTheme from '../../theme';
import { searchActor } from '../models/searchMachine';
import styles from './homeTextArea.module.scss';

const { TextArea } = Input;

const ArrowIcon = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g opacity="0.6">
      <circle cx="16" cy="16" r="16" fill="black" />
      <path
        d="M11 16.0084C10.7239 16.0084 10.5 16.2323 10.5 16.5084C10.5 16.7846 10.7239 17.0084 11 17.0084V16.0084ZM21.3536 16.862C21.5488 16.6667 21.5488 16.3501 21.3536 16.1549L18.1716 12.9729C17.9763 12.7776 17.6597 12.7776 17.4645 12.9729C17.2692 13.1682 17.2692 13.4847 17.4645 13.68L20.2929 16.5084L17.4645 19.3368C17.2692 19.5321 17.2692 19.8487 17.4645 20.044C17.6597 20.2392 17.9763 20.2392 18.1716 20.044L21.3536 16.862ZM11 17.0084H21V16.0084H11V17.0084Z"
        fill="white"
      />
    </g>
  </svg>
);

function HomeTextArea() {
  const router = useRouter();

  const mode = useSelector(searchActor, (state) => state.context.mode);
  const searchValue = useSelector(
    searchActor,
    (state) => state.context.question
  );

  useEffect(() => {
    if (mode === 'selected') {
      searchActor.send({ type: 'CHANGE_MODE.EN' });
    }
  }, []);

  return (
    <div className={styles.homeTextArea}>
      <TextArea
        maxLength={150}
        placeholder="支持中英文输入，一键获取文献和总结..."
        style={{
          height: 138,
          width: 744,
          resize: 'none',
          fontFamily: `PingFang SC, Microsoft YaHei`,
          fontWeight: 400,
          fontSize: 14,
        }}
        value={searchValue}
        onChange={(e) => {
          searchActor.send({ type: 'SET_QUESTION', value: e.target.value });
        }}
        onKeyDown={(e) => {
          if (e.code === 'Enter') {
            e.preventDefault();
            umami.track('search button', { item: searchValue });
            router.push(`./result?q=${searchValue}`);
          }
        }}
      />

      <div className={styles.searchTextArea_language_select}>
        <label
          htmlFor="en"
          className={mode === 'en' ? styles.lang_button_active : ''}
        >
          英文文献
        </label>
        <input
          type="radio"
          id="en"
          name="mode"
          value="en"
          checked={mode === 'en'}
          onChange={(e) => {
            searchActor.send({ type: 'CHANGE_MODE.EN' });
          }}
        />
        <label
          htmlFor="zh-cn"
          className={mode === 'zh-cn' ? styles.lang_button_active : ''}
        >
          中文文献
        </label>
        <input
          type="radio"
          id="zh-cn"
          name="mode"
          value="zh-cn"
          checked={mode === 'zh-cn'}
          onChange={(e) => {
            // searchActor.send({ type: 'CHANGE_MODE.ZH_CN' });
            message.warning({
              content:
                '中文搜索功能预计九月下旬回归！目前由于版权原因，暂时下线，有需求请联系微信hello_xiangqian',
              duration: 10,
            });
          }}
        />
      </div>

      <div className={styles.homeTextArea_btn}>
        <Button
          type="primary"
          shape="circle"
          disabled={!searchValue}
          style={{
            background: 'none',
            border: 'none',
          }}
          onClick={() => {
            umami.track('search button', { item: searchValue });
            router.push(`./result?q=${searchValue}`);
          }}
        >
          <Icon component={ArrowIcon} />
        </Button>
      </div>
    </div>
  );
}

const HomeTextAreaCom = () => {
  return withTheme(<HomeTextArea />);
};

export default HomeTextAreaCom;
