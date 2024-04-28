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
          colorPrimary: '#99E0ED',
          colorBgContainerDisabled: 'rgba(0,0,0,0.6)',
        },
        components: {
          Button: {
            defaultBg: '#FFF',
            defaultColor: '#000',
            defaultBorderColor: '#FFF',
            borderRadius: 20,
          },
          Input: {
            paddingBlock: 6,
            borderRadius: 16,
            paddingBlock: 20,
            paddingInline: 26,
            colorTextPlaceholder: 'rgba(0,0,0,0.5)',
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
