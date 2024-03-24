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

const request = async (url, method, params) => {
  const option = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const token = getItem('token');

  if (token) option.headers.Authorization = `Bearer ${token}`;

  if (method === 'GET') url = `${url}?${new URLSearchParams(params).toString()}`; // fetch不会自动把params参数拼接成查询字符串
  if (method === 'POST') option['body'] = JSON.stringify(params);
  console.log(url)

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
export const getPedia = (params) => {
  return request(`${BASE_URL}/search/query`, 'GET', params);
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
