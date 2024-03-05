/*
 * @Author: 何泽颖 hezeying@autowise.ai
 * @Date: 2024-02-02 17:01:50
 * @LastEditors: 何泽颖 hezeying@autowise.ai
 * @LastEditTime: 2024-03-05 20:08:31
 * @FilePath: /xiangqian-web/app/service/index.js
 * @Description:
 */

import { message } from 'antd';

const BASE_URL = 'http://47.97.101.11:8091';

const request = async (url, method, params) => {
  const option = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // const token = getItem('token');
  // if (token) option.headers.token = token;

  if (method === 'GET') url = `${url}?${new URLSearchParams(params)}`; // fetch不会自动把params参数拼接成查询字符串
  if (method === 'POST') option['body'] = JSON.stringify(params);

  const response = await fetch(url, option);

  const { data, code, msg } = await response.json();

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

//  获取验证码
export const getMessage = (params) => {
  return request(`${BASE_URL}/public/send/message`, 'GET', params);
};

//  获取验证码
export const login = (params) => {
  return request(`${BASE_URL}/public/login`, 'GET', params);
};
