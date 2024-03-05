/*
 * @Author: 何泽颖 hezeying@autowise.ai
 * @Date: 2024-02-23 19:01:19
 * @LastEditors: 何泽颖 hezeying@autowise.ai
 * @LastEditTime: 2024-03-03 01:12:00
 * @FilePath: /xiangqian-web/app/models/search.js
 * @Description:
 */

import { atom } from 'jotai';

const searchValueAtom = atom(''); // 搜索内容
const papersAtom = atom([]); // 引文列表
const summaryAtom = atom(''); // 概述
const summaryZhAtom = atom(''); // 中文概述

export { papersAtom, searchValueAtom, summaryAtom, summaryZhAtom };

