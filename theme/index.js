/*
 * @Author: 何泽颖 hezeying@autowise.ai
 * @Date: 2024-02-23 10:37:34
 * @LastEditors: 何泽颖 hezeying@autowise.ai
 * @LastEditTime: 2024-03-05 00:45:46
 * @FilePath: /xiangqian-web/theme/index.js
 * @Description:
 */
'use client';

import { ConfigProvider } from 'antd';

const withTheme = (node) => (
  <>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#86F1D3',
          colorBgContainerDisabled: '#BFE8D5',
        },
        components: {
          Button: {
            defaultBg: '#F5F5F5',
            defaultColor: '#005C33',
            borderRadius: 20,
          },
          Input: {
            paddingBlock: 6,
            borderRadius: 16,
            paddingBlock: 20,
            paddingInline: 26,
            colorTextPlaceholder: '#00A650',
            fontSize: 16,
          },
        },
      }}
    >
      <ConfigProvider
        theme={{
          token: {
            borderRadius: 4,
          },
        }}
      >
        {node}
      </ConfigProvider>
    </ConfigProvider>
  </>
);

export default withTheme;
