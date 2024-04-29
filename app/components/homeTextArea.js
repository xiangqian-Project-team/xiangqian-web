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
import { Button, Input, Radio } from 'antd';
import { useAtom } from 'jotai';
// import { useRouter } from 'next/navigation';
import { useRouter } from 'next-nprogress-bar';
import withTheme from '../../theme';
import { searchValueAtom } from '../models/search';
import styles from './homeTextArea.module.scss';

const { TextArea } = Input;

function HomeTextArea() {
  const router = useRouter();

  const [searchValue, setSearchValue] = useAtom(searchValueAtom);

  return (
    <div className={styles.homeTextArea}>
      <TextArea
        maxLength={150}
        placeholder="支持中英文输入。观点或是问题，都有基于文献的回应..."
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
          setSearchValue(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.code === 'Enter') {
            e.preventDefault();
            router.push(`./result?q=${searchValue}`);
          }
        }}
      />

      {/* <div className={styles.searchTextArea_language_select}>
        <Radio.Group value={'zh-cn'}>
          <Radio value={'en'}>英文文献</Radio>
          <Radio value={'zh-cn'}>中文文献</Radio>
        </Radio.Group>
      </div> */}

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
