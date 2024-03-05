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
