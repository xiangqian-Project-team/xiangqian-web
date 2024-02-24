/*
 * @Author: 何泽颖 hezeying@autowise.ai
 * @Date: 2024-02-23 10:19:46
 * @LastEditors: 何泽颖 hezeying@autowise.ai
 * @LastEditTime: 2024-02-23 20:26:08
 * @FilePath: /xiangqian-web/next.config.mjs
 * @Description:
 */
/** @type {import('next').NextConfig} */
import path from 'path';
const nextConfig = {
  output: 'export',

  images: {
    domains: ['47.97.101.11'],
  },
  sassOptions: {
    includePaths: [path.join(path.dirname(import.meta.url), 'styles')],
    prependData: `@import "app/global.scss";`,
  },
  productionBrowserSourceMaps: true,
};

export default nextConfig;
