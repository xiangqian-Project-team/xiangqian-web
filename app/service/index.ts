/*
 * @Author: 何泽颖 hezeying@autowise.ai
 * @Date: 2024-02-02 17:01:50
 * @LastEditors: 何泽颖 hezeying@autowise.ai
 * @LastEditTime: 2024-03-11 19:29:55
 * @FilePath: /xiangqian-web/app/service/index.js
 * @Description:
 */
import { message } from 'antd';
import { getItem } from '../utils/storage';

const BASE_URL = 'http://121.43.97.68:8091';

// const FUNCTION_BASE_URL =
//   'https://gemmed-unctions-hvhludohph.ap-northeast-2.fcapp.run'; // PROD API

const FUNCTION_BASE_URL =
  'https://gemmed-unctions-lewhoxyzwh.ap-northeast-2.fcapp.run'; // TEST API

const request = async (
  url: string,
  method: 'POST' | 'GET' | 'PUT' | 'PATCH' | 'DELETE',
  params: any
) => {
  const token = getItem('token');
  const option = {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : undefined,
    },
  };

  if (method === 'GET')
    url = `${url}?${new URLSearchParams(params).toString()}`; // fetch不会自动把params参数拼接成查询字符串
  if (method === 'POST') option['body'] = JSON.stringify(params);
  console.log(url);

  const response = await fetch(url, { ...option });

  const { data, code, msg } = await response.json();
  console.log('🚀 ~ request ~ data, code, msg:', data, code, msg);

  if (code === 6001) {
    message.error(msg);
    throw new Error(msg);
  }

  return data;
};

export const getSummaryQueryTerms = async (params: { query: string }) => {
  const token = getItem('token');
  const option = {
    method: 'POST',
    body: JSON.stringify(params),
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : undefined,
    },
  };
  return fetch(`${FUNCTION_BASE_URL}/query_terms`, option);
};

export const getSummaryConcept = async (params: { query: string }) => {
  const token = getItem('token');
  const option = {
    method: 'POST',
    body: JSON.stringify(params),
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : undefined,
    },
  };
  return fetch(`${FUNCTION_BASE_URL}/concept`, option);
};

export const getSummaryBackground = async (params: { query: string }) => {
  const token = getItem('token');
  const option = {
    method: 'POST',
    body: JSON.stringify(params),
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : undefined,
    },
  };
  return fetch(`${FUNCTION_BASE_URL}/background`, option);
};

export const getRelatedSearch = async (params: {
  answer: string;
  queryZh: string;
}) => {
  const token = getItem('token');
  const option = {
    method: 'POST',
    body: JSON.stringify(params),
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : undefined,
    },
  };
  return fetch(`${FUNCTION_BASE_URL}/related_search`, option);
};

export const getBulletPointsExpansion = async (params: {
  bltpt: string;
  papers: any[];
}) => {
  const token = getItem('token');
  const option = {
    method: 'POST',
    body: JSON.stringify(params),
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : undefined,
    },
  };
  return fetch(`${FUNCTION_BASE_URL}/bltpt_expansion`, option);
};

export const getBulletPointsLiteraturePreview = async (params: {
  bltpt: string;
  papers: any[];
}) => {
  const token = getItem('token');
  const option = {
    method: 'POST',
    body: JSON.stringify(params),
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : undefined,
    },
  };
  return fetch(`${FUNCTION_BASE_URL}/bltpt_literature_review`, option);
};

//  搜索
export const getPedia = async (params) => {
  const token = getItem('token');
  const option = {
    method: 'POST',
    body: JSON.stringify(params),
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : undefined,
    },
  };
  return fetch(`${FUNCTION_BASE_URL}/search`, option);
};

// 多步搜索
export const getPartPedia = async (params, lang) => {
  let path = '/search_papers';
  if (lang === 'zh-cn') {
    path = '/zh/search_papers';
  }
  const token = getItem('token');
  const option = {
    method: 'POST',
    body: JSON.stringify(params),
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : undefined,
    },
  };
  umami.track('search', {
    query: params.query,
    type: lang,
  });
  return fetch(`${FUNCTION_BASE_URL}${path}`, option);
};

export const getFund = async (query: string) => {
  const token = getItem('token');
  const option = {
    method: 'POST',
    body: JSON.stringify({ query }),
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : undefined,
    },
  };
  umami.track('search', {
    query: query,
    type: 'fund_cn',
  });
  return fetch(`${FUNCTION_BASE_URL}/fund/search`, option);
};

export const getLiteratureReview = async (params: {
  papers: any[];
  queryEn: string;
  queryZh: string;
}) => {
  const token = getItem('token');
  const option = {
    method: 'POST',
    body: JSON.stringify(params),
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : undefined,
    },
  };
  return fetch(`${FUNCTION_BASE_URL}/literature_review`, option);
};

export const getAnalysisPedia = async (params: {
  papers: any[];
  queryEn: string;
  queryZh: string;
}) => {
  const token = getItem('token');
  const option = {
    method: 'POST',
    body: JSON.stringify(params),
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : undefined,
    },
  };
  return fetch(`${FUNCTION_BASE_URL}/papers_analysis_v2`, option);
};

export const getSummaryAnswer = async (params: {
  papers: any[];
  queryEn: string;
  queryZh: string;
}) => {
  const token = getItem('token');
  const option = {
    method: 'POST',
    body: JSON.stringify(params),
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : undefined,
    },
  };
  return fetch(`${FUNCTION_BASE_URL}/answer`, option);
};

export const getSummaryBulletPoints = async (params: {
  papers: any[];
  queryEn: string;
  queryZh: string;
}) => {
  const token = getItem('token');
  const option = {
    method: 'POST',
    body: JSON.stringify(params),
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : undefined,
    },
  };
  return fetch(`${FUNCTION_BASE_URL}/bltpts_struct`, option);
};

export const getSummaryAnalysis = async (params: {
  papers: any[];
  queryEn: string;
  queryZh: string;
}) => {
  const token = getItem('token');
  const option = {
    method: 'POST',
    body: JSON.stringify(params),
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : undefined,
    },
  };
  return fetch(`${FUNCTION_BASE_URL}/bltpts_analysis`, option);
};

export const getResponsePedia = async (params: {
  papers: {
    id: string;
  }[];
  queryZh: string;
}) => {
  const token = getItem('token');
  const option = {
    method: 'POST',
    body: JSON.stringify(params),
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : undefined,
    },
  };
  return fetch(`${FUNCTION_BASE_URL}/paper_response`, option);
};

export const fetchAbstract = async (paperId) => {
  // Assuming the token is stored and should be included in the request if available
  const token = getItem('token');
  const apiUrl = `${FUNCTION_BASE_URL}/abstract?paper_id=${encodeURIComponent(paperId)}`;
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : undefined,
    },
  };

  return fetch(apiUrl, options);
};

export const fetchAbstractAndTranslation = async (paper: any) => {
  // Assuming the token is stored and should be included in the request if available
  const token = getItem('token');
  const apiUrl = `${FUNCTION_BASE_URL}/abstract_and_translation`;
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : undefined,
    },
    body: JSON.stringify({ paper }),
  };

  return fetch(apiUrl, options);
};

export const fetchJournalInfo = async (paper: any) => {
  const token = getItem('token');
  const option = {
    method: 'POST',
    body: JSON.stringify({ paper }),
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : undefined,
    },
  };
  return fetch(`${FUNCTION_BASE_URL}/paper/journal_info`, option);
};

export const fetchReadingGuide = async (paper: any) => {
  const token = getItem('token');
  const option = {
    method: 'POST',
    body: JSON.stringify({ paper }),
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : undefined,
    },
  };
  return fetch(`${FUNCTION_BASE_URL}/paper/reading_guide`, option);
};

export const fetchFundSimiliar = async (paper: any) => {
  // Assuming the token is stored and should be included in the request if available
  const token = getItem('token');
  const apiUrl = `${FUNCTION_BASE_URL}/paper/similar_fund`;
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : undefined,
    },
    body: JSON.stringify({ paper }),
  };

  return fetch(apiUrl, options);
};

export const fetchSimiliar = async (paper: any) => {
  // Assuming the token is stored and should be included in the request if available
  const token = getItem('token');
  const apiUrl = `${FUNCTION_BASE_URL}/similar_papers`;
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : undefined,
    },
    body: JSON.stringify({ paper }),
  };

  return fetch(apiUrl, options);
};

export const fetchResponses = async (params) => {
  const token = getItem('token');
  const apiUrl = `${FUNCTION_BASE_URL}/paper_response`;
  const options = {
    method: 'POST',
    body: JSON.stringify(params),
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : undefined,
    },
  };

  return fetch(apiUrl, options);
};

//  翻译摘要
export const translate = (params) => {
  return request(`${BASE_URL}/search/translate`, 'GET', params);
};

//  获取验证码
export const getMessage = (params) => {
  return request(`${BASE_URL}/public/send/message`, 'GET', params);
};

//  登录
export const login = (params) => {
  return request(`${BASE_URL}/public/login`, 'GET', params);
};
