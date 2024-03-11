/*
 * @Author: 何泽颖 hezeying@autowise.ai
 * @Date: 2024-02-23 10:19:46
 * @LastEditors: 何泽颖 hezeying@autowise.ai
 * @LastEditTime: 2024-03-09 23:30:21
 * @FilePath: /xiangqian-web/app/layout.js
 * @Description:
 */
import { AntdRegistry } from '@ant-design/nextjs-registry';
import NprogressProvider from './components/nprogressProvider';

import './globals.css';

export const metadata = {
  title: '镶嵌',
  description: '镶嵌',
  icons: 'favicon.ico',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ width: '100%' }}>
        <NprogressProvider>
          <AntdRegistry>{children}</AntdRegistry>
        </NprogressProvider>
      </body>
    </html>
  );
}
