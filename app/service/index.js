/*
 * @Author: 何泽颖 hezeying@autowise.ai
 * @Date: 2024-02-02 17:01:50
 * @LastEditors: 何泽颖 hezeying@autowise.ai
 * @LastEditTime: 2024-02-23 18:40:54
 * @FilePath: /xiangqian-web/app/service/index.js
 * @Description:
 */

const BASE_URL = 'http://47.97.101.11:8091';

const request = async (url, method, params) => {
  const option = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (method === 'GET') url = `${url}?${new URLSearchParams(params)}`; // fetch不会自动把params参数拼接成查询字符串
  if (method === 'POST') option['body'] = JSON.stringify(params);

  const response = await fetch(`${BASE_URL}${url}`, option);

  const { data } = await response.json();

  return data;
};

//  搜索
export const getPedia = (params) => {
  return request('/search/query', 'GET', params);
};
