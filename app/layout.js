/*
 * @Author: 何泽颖 hezeying@autowise.ai
 * @Date: 2024-02-23 10:19:46
 * @LastEditors: 何泽颖 hezeying@autowise.ai
 * @LastEditTime: 2024-03-20 21:11:28
 * @FilePath: /xiangqian-web/app/layout.js
 * @Description:
 */
import { AntdRegistry } from '@ant-design/nextjs-registry';
import NprogressProvider from './components/nprogressProvider';

import Script from 'next/script';
import './globals.css';

export const metadata = {
  title: '镶嵌',
  description: '镶嵌',
  icons: 'favicon.ico',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Script
        defer
        src="https://cloud.umami.is/script.js"
        data-website-id="453e5c34-488c-4a1b-99f9-2501d670e5ca"
      />
      <body style={{ width: '100%', overflowY: 'scroll !important' }}>
        <NprogressProvider>
          <AntdRegistry>{children}</AntdRegistry>
        </NprogressProvider>
      </body>
    </html>
  );
}
