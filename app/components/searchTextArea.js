/*
 * @Author: 何泽颖 hezeying@autowise.ai
 * @Date: 2024-02-23 10:47:08
 * @LastEditors: 何泽颖 hezeying@autowise.ai
 * @LastEditTime: 2024-03-09 23:41:14
 * @FilePath: /xiangqian-web/app/components/searchTextArea.js
 * @Description:
 */
'use client';
import { ArrowRightOutlined } from '@ant-design/icons';
import { Button, Input } from 'antd';
import { useAtom } from 'jotai';
// import { useRouter } from 'next/navigation';
import { useRouter } from 'next-nprogress-bar';
import withTheme from '../../theme';
import { searchValueAtom } from '../models/search';
import styles from './searchTextArea.module.scss';
const { TextArea } = Input;

function SearchTextArea(props) {
  const router = useRouter();

  const [searchValue, setSearchValue] = useAtom(searchValueAtom);

  return (
    <div className={styles.searchContainer}>
      <div className={styles.searchTextArea}>
        <TextArea
          // showCount
          maxLength={50}
          placeholder="请输入您的问题......"
          className={styles.searchTextArea_input}
          value={searchValue}
          onChange={(e) => {
            setSearchValue(e.target.value);
          }}
        />

        <div className={styles.searchTextArea_btn}>
          <Button
            type="primary"
            shape="circle"
            loading={props.loading}
            icon={<ArrowRightOutlined style={{ color: '#194731' }} />}
            disabled={!searchValue}
            onClick={() => {
              router.push(`./result?q=${searchValue}`);
            }}
          />
        </div>

        <div className={styles.searchTextArea_count}>
          {searchValue.length}/50
        </div>
      </div>
    </div>
  );
}

const SearchTextAreaCom = (props) => {
  return withTheme(<SearchTextArea loading={props.isLoading} />);
};

export default SearchTextAreaCom;
