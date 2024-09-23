/*
 * @Author: 何泽颖 hezeying@autowise.ai
 * @Date: 2023-10-12 19:24:41
 * @LastEditors: 何泽颖 hezeying@autowise.ai
 * @LastEditTime: 2024-03-05 18:56:25
 * @FilePath: /xiangqian-web/app/utils/storage.js
 * @Description:封装本地存储操作模块
 */

/** 存储数据 */
export const setItem = (key, value) => {
  if (typeof window !== 'undefined') {
    if (value) localStorage.setItem(key, JSON.stringify(value));
  }
};

/** 获取数据 */
export const getItem = (key) => {
  if (typeof window !== 'undefined') {
    try {
      return JSON.parse(localStorage.getItem(key));
    } catch (error) {}
  }
};

/** 删除数据 */
export const removeItem = (key) => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(key);
  }
};
