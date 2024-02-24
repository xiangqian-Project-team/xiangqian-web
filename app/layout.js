import { AntdRegistry } from '@ant-design/nextjs-registry';
import Header from './components/header';
import './globals.css';

export const metadata = {
  title: '镶嵌 1.0',
  description: '镶嵌 1.0',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ width: '100%' }}>
        <AntdRegistry>
          <Header />

          {children}
        </AntdRegistry>
      </body>
    </html>
  );
}
