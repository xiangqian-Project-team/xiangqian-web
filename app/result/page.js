/*
 * @Author: 何泽颖 hezeying@autowise.ai
 * @Date: 2024-03-03 01:22:56
 * @LastEditors: 何泽颖 hezeying@autowise.ai
 * @LastEditTime: 2024-03-05 21:55:19
 * @FilePath: /xiangqian-web/app/result/page.js
 * @Description:
 */
'use client';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { Button, ConfigProvider } from 'antd';
import { useAtom } from 'jotai';
import { useRouter } from 'next-nprogress-bar';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Footer from '../components/footer';
import LoginBtn from '../components/loginBtn';
import SearchTextArea from '../components/searchTextArea';
import ArticleIcon from '../img/article.png';
import BookIcon from '../img/book.png';
import LockIcon from '../img/lock.png';
import LogoIcon from '../img/logo.png';
import QuoteIcon from '../img/quote.png';
import UserIcon from '../img/user.png';
import {
  papersAtom,
  searchValueAtom,
  summaryAtom,
  summaryZhAtom,
} from '../models/search';
import { getPedia as getPediaAsync } from '../service';
import styles from './page.module.scss';

function Search() {
  const router = useRouter();

  const [summary, setSummary] = useAtom(summaryAtom);
  const [summaryZh, setSummaryZh] = useAtom(summaryZhAtom);
  const [papers, setPapers] = useAtom(papersAtom);
  const [searchValue, setSearchValue] = useAtom(searchValueAtom);
  const [paperAbstractOpenList, setPaperAbstractOpenList] = useState([]);

  const searchParams = useSearchParams();

  const getPedia = async () => {
    try {
      const queryText = searchParams.get('q');
      const params = { queryText };
      const { papers, summary, summaryZh } = await getPediaAsync(params);
      setPapers(papers);
      setSummary(summary);
      setSummaryZh(summaryZh);
      setSearchValue(queryText);
    } catch (error) {}
  };

  const getReplacedSummary = (str) =>
    str.replace(/\[citation:(\d+)\]/g, function (match, i) {
      return `<a target="_blank" href="${papers[i].url}" style="text-decoration: none; color: #00A650">（ 
        ${papers[i].authors.join()} 
        ，
        ${papers[i].years || ''} 
        ）</a>`;
    });

  useEffect(() => {
    getPedia();
  }, []);

  return (
    <div className={styles.search}>
      <div className={styles.search_content}>
        <LoginBtn right={0} />
        <div className={styles.search_content_header}>
          <Image
            src={LogoIcon.src}
            width={86}
            height={36}
            alt="logo"
            onClick={() => {
              router.push('/');
            }}
          />
        </div>

        <SearchTextArea />

        <div className={styles.search_content_data}>
          <div className={styles.search_content_data_summary}>
            <div className={styles.header}>
              <div className={styles.header_triangle} />
              总结
            </div>
            <div className={styles.content}>
              <div
                className={styles.content_summary}
                dangerouslySetInnerHTML={{
                  __html: getReplacedSummary(summaryZh),
                }}
              />
              <div
                className={styles.content_summaryZh}
                dangerouslySetInnerHTML={{
                  __html: getReplacedSummary(summary),
                }}
              />
            </div>
          </div>
          <div className={styles.search_content_data_papers}>
            <div className={styles.header}>
              <div className={styles.header_text}>
                参考文献：{papers.length}篇
              </div>
              <ConfigProvider
                theme={{
                  token: {
                    colorPrimary: '#6F9EC1',
                  },
                  components: {
                    Button: {
                      paddingInlineLG: 24,
                    },
                  },
                }}
              >
                <Button
                  size="large"
                  type="primary"
                  //   onClick={() => {
                  //     router.push('/login');
                  //   }}
                >
                  查看选中文献
                </Button>
              </ConfigProvider>
            </div>

            <div className={styles.content}>
              {papers.map(
                (
                  {
                    paperAbstractZh,
                    paperAbstract,
                    authors,
                    citationCount,
                    jcr,
                    journal,
                    title,
                    url,
                    years,
                    responseZh,
                  },
                  i
                ) => (
                  <div key={i} className={styles.content_card}>
                    <div className={styles.content_card_header}>
                      <Image
                        src={ArticleIcon.src}
                        width={12}
                        height={12}
                        alt="ArticleIcon"
                      />
                      <span>article</span>
                      <Image
                        src={LockIcon.src}
                        width={12}
                        height={12}
                        alt="LockIcon"
                      />
                      <span>open access</span>
                    </div>
                    <div className={styles.content_card_title}>{title}</div>
                    <div className={styles.content_card_response}>
                      {responseZh}
                    </div>

                    <div className={styles.content_card_btn}>
                      <ConfigProvider
                        theme={{
                          token: {
                            colorPrimary: '#00A650',
                          },
                          components: {
                            Button: {
                              defaultColor: '#00A650',
                              defaultBg: '#F1F1F1',
                            },
                          },
                        }}
                      >
                        <Button
                          onClick={() => {
                            setPaperAbstractOpenList(
                              paperAbstractOpenList.includes(i)
                                ? paperAbstractOpenList.filter(
                                    (item) => item !== i
                                  )
                                : [...paperAbstractOpenList, i]
                            );
                          }}
                        >
                          {paperAbstractOpenList.includes(i)
                            ? '收起'
                            : '查看摘要'}

                          {paperAbstractOpenList.includes(i) ? (
                            <UpOutlined
                              style={{ color: '#00A650', fontSize: '10px' }}
                            />
                          ) : (
                            <DownOutlined
                              style={{ color: '#00A650', fontSize: '10px' }}
                            />
                          )}
                        </Button>
                      </ConfigProvider>
                    </div>

                    {paperAbstractOpenList.includes(i) && (
                      <div className={styles.content_card_paperAbstract}>
                        <span>摘要：{paperAbstractZh || paperAbstract}</span>
                        <span>
                          {`摘要(原文)：`}
                          {paperAbstract}
                        </span>
                      </div>
                    )}

                    <div className={styles.content_card_crossline} />

                    <div className={styles.content_card_footer}>
                      <div className={styles.content_card_footer_journal}>
                        <Image
                          src={BookIcon.src}
                          width={16}
                          height={16}
                          alt="BookIcon"
                        />
                        <div
                          className={styles.content_card_footer_journal_text}
                        >
                          {journal}
                        </div>
                      </div>
                      <div className={styles.content_card_footer_division} />
                      <div className={styles.content_card_footer_authors}>
                        <Image
                          src={UserIcon.src}
                          width={16}
                          height={16}
                          alt="UserIcon"
                        />
                        {authors[0]}等
                      </div>
                      <div className={styles.content_card_footer_division} />
                      <div className={styles.content_card_footer_years}>
                        {years || 2000}
                      </div>
                      <div className={styles.content_card_footer_division} />
                      <div className={styles.content_card_footer_jcr}>
                        JCR Q{jcr}
                      </div>
                      <div className={styles.content_card_footer_division} />
                      <div className={styles.content_card_footer_citationCount}>
                        被引{citationCount} 次
                      </div>
                      <div className={styles.content_card_footer_division} />
                      <div className={styles.content_card_footer_url}>
                        <Image
                          src={QuoteIcon.src}
                          width={16}
                          height={16}
                          alt="QuoteIcon"
                        />
                        引用
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Search;
