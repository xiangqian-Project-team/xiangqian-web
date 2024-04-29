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
const FUNCTION_BASE_URL =
  'https://gemmed-wlpv-serverllication-tbxrqccqpt.us-west-1.fcapp.run';

const request = async (url, method, params) => {
  const option = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const token = getItem('token');

  if (token) option.headers.Authorization = `Bearer ${token}`;

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

//  搜索
export const getPedia = async (params) => {
  const token = getItem('token');
  const option = {
    method: 'POST',
    body: JSON.stringify(params),
    headers: {
      'Content-Type': 'application/json',
    },
  };
  if (token) option.headers.Authorization = `Bearer ${token}`;
  return fetch(`${FUNCTION_BASE_URL}/search`, option);
  // return request(`${FUNCTION_BASE_URL}/search`, 'POST', params);
};

// 多步搜索
export const getPartPedia = async (params) => {
  const token = getItem('token');
  const option = {
    method: 'POST',
    body: JSON.stringify(params),
    headers: {
      'Content-Type': 'application/json',
    },
  };
  if (token) option.headers.Authorization = `Bearer ${token}`;
  return fetch(`${FUNCTION_BASE_URL}/search_papers`, option);
};

export const getAnalysisPedia = async (params) => {
  const token = getItem('token');
  const option = {
    method: 'POST',
    body: JSON.stringify(params),
    headers: {
      'Content-Type': 'application/json',
    },
  };
  if (token) option.headers.Authorization = `Bearer ${token}`;
  return fetch(`${FUNCTION_BASE_URL}/papers_analysis`, option);
};

export const getResponsePedia = async (params) => {
  const token = getItem('token');
  const option = {
    method: 'POST',
    body: JSON.stringify(params),
    headers: {
      'Content-Type': 'application/json',
    },
  };
  if (token) option.headers.Authorization = `Bearer ${token}`;
  return fetch(`${FUNCTION_BASE_URL}/paper_response`, option);
};

export const fetchAbstract = async (paperId) => {
  // Assuming the token is stored and should be included in the request if available
  const token = getItem('token');
  const apiUrl = `${FUNCTION_BASE_URL}/abstract?paperId=${encodeURIComponent(paperId)}`;
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (token) {
    options.headers.Authorization = `Bearer ${token}`;
  }
  return fetch(apiUrl, options);
};

export const fetchReferences = async (paperId) => {
  const token = getItem('token');
  const apiUrl = `${FUNCTION_BASE_URL}/paper_references?paperId=${encodeURIComponent(paperId)}`;
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (token) {
    options.headers.Authorization = `Bearer ${token}`;
  }
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
    },
  };

  if (token) {
    options.headers.Authorization = `Bearer ${token}`;
  }
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
