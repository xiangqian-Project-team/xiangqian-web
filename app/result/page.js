/*
 * @Author: 何泽颖 hezeying@autowise.ai
 * @Date: 2024-03-03 01:22:56
 * @LastEditors: 何泽颖 hezeying@autowise.ai
 * @LastEditTime: 2024-03-12 21:22:35
 * @FilePath: /xiangqian-web/app/result/page.js
 * @Description:
 */
'use client';
import Icon, {
  CloseOutlined,
  DownOutlined,
  UpOutlined,
} from '@ant-design/icons';
import { Button, ConfigProvider, Popover, Tooltip } from 'antd';
import { useAtom } from 'jotai';
import { useRouter } from 'next-nprogress-bar';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import Footer from '../components/footer';
import LoginBtn from '../components/loginBtn';
import SearchTextArea from '../components/searchTextArea';
import CheckIcon from '../icons/icon_check.svg';
import NoneCheckIcon from '../icons/icon_none_check.svg';
import RoundedArrow from '../icons/rounded_arrow.svg';
import BookIcon from '../img/book.png';
import EmptyIcon from '../img/empty.png';
import LockIcon from '../img/lock.png';
import LogoIcon2 from '../img/logo2.png';
import UserIcon from '../img/user.png';
import {
  papersAtom,
  searchValueAtom,
  summaryAtom,
  summaryZhAtom,
} from '../models/search';
import {
  getPedia as getPediaAsync,
  translate as translateAsync,
} from '../service';
import { getItem } from '../utils/storage';
import styles from './page.module.scss';

const QuoteSvg = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="3"
      y="4"
      width="4"
      height="4"
      stroke="#00A650"
      stroke-width="1.2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M7 8V8C7 9.22573 6.30747 10.3463 5.21115 10.8944L5 11"
      stroke="#00A650"
      stroke-width="1.2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <rect
      x="9"
      y="4"
      width="4"
      height="4"
      stroke="#00A650"
      stroke-width="1.2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M13 8V8C13 9.22573 12.3075 10.3463 11.2111 10.8944L11 11"
      stroke="#00A650"
      stroke-width="1.2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

function ContentCart(props) {
  const {
    paperAbstract,
    authors,
    citationCount,
    jcr,
    journal,
    title,
    url,
    years,
    responseZh,
  } = props.data;
  const [paperAbstractZh, setPaperAbstractZh] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const [isAllDetailVisible, setIsAllDetailVisible] = useState(false);

  const translate = async (queryText) => {
    try {
      if (isDetailVisible) {
        setIsDetailVisible(false);
        setIsAllDetailVisible(false);
        return;
      }

      setIsLoading(true);

      const params = { queryText };
      const { abstractZh } = await translateAsync(params);

      setPaperAbstractZh(abstractZh);
      setIsDetailVisible(true);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.content_card}>
      <div className={styles.content_card_title}>
        {props.checkedPapers.includes(title) ? (
          <Image
            className={styles.content_card_check}
            src={CheckIcon}
            onClick={() => {
              const newCheckedPapers = props.checkedPapers.filter(
                (item) => item !== title
              );
              props.setCheckedPapers(newCheckedPapers);
            }}
          />
        ) : (
          <Image
            className={styles.content_card_check}
            src={NoneCheckIcon}
            onClick={() => {
              const newCheckedPapers = [...props.checkedPapers, title];
              props.setCheckedPapers(newCheckedPapers);
            }}
          />
        )}
        <Tooltip title={title}>
          <span>{title}</span>
        </Tooltip>
        <Popover
          content={<Button danger>确认本项研究⽆关，不再显⽰</Button>}
          trigger="click"
        >
          <Button type="text" icon={<CloseOutlined />} size="small" />
        </Popover>
      </div>

      <div className={styles.content_card_footer}>
        <div className={styles.content_card_footer_journal}>
          <Image src={BookIcon.src} width={16} height={16} alt="BookIcon" />
        </div>

        <Tooltip title={journal.name}>
          <div className={styles.content_card_footer_journal_text}>
            {journal.name}
          </div>
        </Tooltip>

        <div className={styles.content_card_footer_division} />
        <div className={styles.content_card_footer_authors}>
          <Image src={UserIcon.src} width={16} height={16} alt="UserIcon" />
          {authors[0]}等
        </div>
        <div className={styles.content_card_footer_division} />
        <div className={styles.content_card_footer_years}>{years || 2000}</div>
        <div className={styles.content_card_footer_division} />
        <div className={styles.content_card_footer_jcr}>JCR Q{jcr}</div>
        <div className={styles.content_card_footer_division} />
        <div className={styles.content_card_footer_citationCount}>
          被引{citationCount} 次
        </div>
        <div className={styles.content_card_footer_division} />

        <div className={styles.content_card_footer_openAccess}>
          <Image src={LockIcon.src} width={12} height={12} alt="LockIcon" />
          <span>open access</span>
        </div>
      </div>

      <div className={styles.content_card_crossline} />

      <div className={styles.content_card_response}>
        {responseZh ||
          '在数字时代的浪潮中，虚拟与现实交织，科技的脚步从未停歇。在这个信息爆炸的时代，每个人都是知识的追寻者，也是信息的传递者。我们漫步在这片广阔的网络世界，寻找着自己的位置，探索着未知的领域。无数的数据像繁星一般'}
      </div>

      <div className={styles.content_card_btn}>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#00A650',
            },
            components: {
              Button: {
                paddingInlineSM: 34,
                defaultColor: '#00A650',
                defaultBg: '#F1F1F1',
              },
            },
          }}
        >
          <Button
            size="small"
            // onClick={() => { }}
          >
            <div className={styles.content_card_btn_quote}>
              <Icon component={QuoteSvg} />
              引用
            </div>
          </Button>
        </ConfigProvider>

        <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#00A650',
            },
            components: {
              Button: {
                paddingInlineSM: 48,
                defaultColor: '#00A650',
                defaultBg: '#F1F1F1',
              },
            },
          }}
        >
          <Button
            size="small"
            loading={isLoading}
            onClick={() => {
              translate(paperAbstract);
            }}
          >
            {isDetailVisible ? '收起' : '查看摘要'}

            {isDetailVisible ? (
              <UpOutlined style={{ color: '#00A650', fontSize: '8px' }} />
            ) : (
              <DownOutlined style={{ color: '#00A650', fontSize: '8px' }} />
            )}
          </Button>
        </ConfigProvider>
      </div>

      {isDetailVisible && (
        <div
          className={styles.content_card_paperAbstract}
          style={{
            height: isDetailVisible && isAllDetailVisible ? 'auto' : '',
          }}
        >
          <span>摘要：{paperAbstractZh || paperAbstract}</span>
          <span>
            {`摘要(原文)：`}
            {paperAbstract}
          </span>
          {!isAllDetailVisible && (
            <b
              className={styles.content_card_paperAbstract_all_button}
              onClick={() => {
                setIsAllDetailVisible(true);
              }}
            >
              查看全部
            </b>
          )}
        </div>
      )}
    </div>
  );
}

function Search() {
  const router = useRouter();

  const timeId = useRef({ id: -1 });

  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useAtom(summaryAtom);
  const [summaryZh, setSummaryZh] = useAtom(summaryZhAtom);
  const [papers, setPapers] = useAtom(papersAtom);
  const [searchValue, setSearchValue] = useAtom(searchValueAtom);
  const [checkedPapers, setCheckedPapers] = useState([]);
  const [meter, setMeter] = useState(0);

  const searchParams = useSearchParams();

  const summaryRef = useRef(null);

  const contentHeight = useMemo(() => {
    return summaryRef?.current?.clientHeight;
  }, [summaryRef]);

  const getPedia = async () => {
    try {
      // 开启倒计时
      timeId.current.id = setInterval(() => {
        setMeter((meter) => {
          if (meter >= 95) return 95;
          return meter + 1;
        });
      }, 100);

      const queryText = searchParams.get('q');
      const params = { queryText };

      const { papers, summary, summaryZh } = await getPediaAsync(params);

      setPapers(papers);
      setSummary(summary);
      setSummaryZh(summaryZh);
      setSearchValue(queryText);

      setTimeout(() => {
        setLoading(false);
        clearInterval(timeId.current.id);
        setMeter(0);
      }, 500);
    } catch (error) {
      setLoading(false);
      clearInterval(timeId.current.id);
      setMeter(0);
    }
  };

  const getReplacedSummary = (str) =>
    str.replace(/\[citation:(\d+)\]/g, function (match, i) {
      return `<span onclick="
      
      const cardList = document.getElementById('cardList');

      for (let j = 0; j < cardList.childNodes.length; j++) {
        cardList.childNodes[j].style.borderWidth= '1px';
        cardList.childNodes[j].style.borderColor= '#84C4B5';
      }

      const index = ${i - 1}

      let scrollTop = 0;
      for (let j = 0; j < index; j++) {
        cardList.childNodes[j].style.borderWidth= '1px';
        cardList.childNodes[j].style.borderColor= '#84C4B5';
        scrollTop += cardList.childNodes[j].clientHeight;
      }
      scrollTop += (index - 1) * 10;
      if (cardList) cardList.scrollTop = scrollTop + 2;

      cardList.childNodes[index].style.borderWidth= '2px';
      cardList.childNodes[index].style.borderColor= '#00A650';

      
      
      " style="text-decoration: none; color: #00A650; cursor: pointer;">（
        ${papers[i - 1].authors.join()}
        ，
        ${papers[i - 1].years || ''}
        ）</span>`;
    });

  useEffect(() => {
    getPedia();
  }, []);

  return (
    <div className={styles.search}>
      <div className={styles.search_main}>
        <div className={styles.search_main_sidebar}>
          <div className={styles.search_main_sidebar_logo}>
            <Image
              src={LogoIcon2.src}
              width={42}
              height={52}
              alt="logo"
              onClick={() => {
                router.push('/');
              }}
            />

            <LoginBtn
              style={{
                position: 'absolute',
                bottom: 24,
                left: getItem('token') ? 20 : 8,
              }}
            />
          </div>
        </div>

        <div className={styles.search_content}>
          <SearchTextArea isLoading={loading} />

          {loading && (
            <div className={styles.search_content_loading}>
              <div className={styles.search_content_loading_card}>
                <div className={styles.text}>我们正在努力寻找答案……</div>
                <meter min="0" max="100" value={meter} />
              </div>
            </div>
          )}

          {!loading && !summary && (
            <div className={styles.search_content_empty}>
              <div className={styles.search_content_empty_card}>
                <Image
                  src={EmptyIcon.src}
                  width={64}
                  height={46}
                  alt="EmptyIcon"
                />

                <div className={styles.text}>
                  很抱歉，暂时无法找到合适的答案，请换个问题再试一次。
                </div>
              </div>
            </div>
          )}

          {!loading && summary && (
            <div className={styles.search_content_data}>
              <div
                ref={summaryRef}
                className={styles.search_content_data_summary}
              >
                <div className={styles.header}>
                  <Image
                    className={styles.header_triangle}
                    src={RoundedArrow}
                  />
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
              <div
                className={styles.search_content_data_papers}
                style={{ maxHeight: contentHeight || 'auto' }}
              >
                <div className={styles.header}>
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
                    <Button type="primary">查看选中文献</Button>
                  </ConfigProvider>
                  <div className={styles.header_text}>精选8/已读220</div>
                </div>

                <div className={styles.content} id="cardList">
                  {papers.map(
                    // {
                    //   paperAbstractZh,
                    //   paperAbstract,
                    //   authors,
                    //   citationCount,
                    //   jcr,
                    //   journal,
                    //   title,
                    //   url,
                    //   years,
                    //   responseZh,
                    // }
                    (item, i) => (
                      <ContentCart
                        key={item.title}
                        data={item}
                        checkedPapers={checkedPapers}
                        setCheckedPapers={setCheckedPapers}
                      />
                    )
                  )}
                </div>
                <div className={styles.footer_mask} />
                <div className={styles.footer}>
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
                    <Button type="primary">查看更多文献</Button>
                  </ConfigProvider>
                </div>
              </div>
            </div>
          )}

          <Footer />
        </div>
      </div>
    </div>
  );
}

export default Search;
