/*
 * @Author: 何泽颖 hezeying@autowise.ai
 * @Date: 2024-02-23 19:01:19
 * @LastEditors: 何泽颖 hezeying@autowise.ai
 * @LastEditTime: 2024-03-10 00:42:37
 * @FilePath: /xiangqian-web/app/models/search.js
 * @Description:
 */

import { atom } from 'jotai';
import { atomWithImmer } from 'jotai-immer';

const modeAtom = atom('en'); // en | zh-cn | selected
const searchValueAtom = atom(''); // 搜索内容
const papersAtom = atomWithImmer([]); // 引文列表
const papersAtomZH = atomWithImmer([]); // 中文引文列表
const summaryAtom = atom(''); // 概述
const bulletPointsAtom = atom('');
const summaryZHAtom = atom(''); // 概述
const bulletPointsZHAtom = atom('');
const selectedSummaryAtom = atom('');
const selectedBulletPointsAtom = atom('');

export {
  bulletPointsAtom,
  bulletPointsZHAtom,
  modeAtom,
  papersAtom,
  papersAtomZH,
  searchValueAtom,
  selectedBulletPointsAtom,
  selectedSummaryAtom,
  summaryAtom,
  summaryZHAtom,
};
