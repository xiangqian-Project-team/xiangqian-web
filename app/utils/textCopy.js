/*
 * @Author: 何泽颖 hezeying@autowise.ai
 * @Date: 2023-05-22 10:22:19
 * @LastEditors: 何泽颖 hezeying@autowise.ai
 * @LastEditTime: 2024-03-20 20:45:49
 * @FilePath: /xiangqian-web/app/utils/textCopy.js
 * @Description: 文本拷贝
 */
import { message } from 'antd';

const textCopy = async (text, msg) => {
  if (navigator.clipboard) {
    await navigator.clipboard.writeText(text);
    message.success(msg);
  } else {
    const textArea = document.createElement('textArea');
    textArea.value = text;
    textArea.style.width = 0;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999px';
    textArea.style.top = '10px';
    textArea.setAttribute('readonly', 'readonly');
    document.body.appendChild(textArea);

    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    message.success(msg);
  }
};

export default textCopy;
