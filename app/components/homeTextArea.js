/*
 * @Author: 何泽颖 hezeying@autowise.ai
 * @Date: 2024-02-23 10:47:08
 * @LastEditors: 何泽颖 hezeying@autowise.ai
 * @LastEditTime: 2024-03-05 19:55:50
 * @FilePath: /xiangqian-web/app/components/homeTextArea.js
 * @Description:
 */
'use client';
import { ArrowRightOutlined } from '@ant-design/icons';
import { Button, Input, message } from 'antd';
// import { useRouter } from 'next/navigation';
import { useSelector } from '@xstate/react';
import { useRouter } from 'next-nprogress-bar';
import { useEffect } from 'react';
import withTheme from '../../theme';
import { searchActor } from '../models/searchMachine';
import styles from './homeTextArea.module.scss';

const { TextArea } = Input;

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
        placeholder="支持中英文搜索......"
        style={{
          height: 138,
          width: 744,
          resize: 'none',
        }}
        classNames={{
          wrapper: styles.homeTextAreaInput,
        }}
        value={searchValue}
        onChange={(e) => {
          searchActor.send({ type: 'SET_QUESTION', value: e.target.value });
        }}
        onKeyDown={(e) => {
          if (e.code === 'Enter') {
            e.preventDefault();
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
                '由于版权原因，中文搜索暂时不可用，有需求请联系微信hello_xiangqian',
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
          icon={
            <ArrowRightOutlined
              style={{ color: !searchValue ? '#A3B7AF' : '#194731' }}
            />
          }
          onClick={() => {
            router.push(`./result?q=${searchValue}`);
          }}
        />
      </div>
    </div>
  );
}

const HomeTextAreaCom = () => {
  return withTheme(<HomeTextArea />);
};

export default HomeTextAreaCom;
