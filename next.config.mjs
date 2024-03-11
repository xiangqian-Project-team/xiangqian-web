/*
 * @Author: 何泽颖 hezeying@autowise.ai
 * @Date: 2024-02-23 10:19:46
 * @LastEditors: 何泽颖 hezeying@autowise.ai
 * @LastEditTime: 2024-03-11 17:34:02
 * @FilePath: /xiangqian-web/next.config.mjs
 * @Description:
 */
/** @type {import('next').NextConfig} */
import path from 'path';
const nextConfig = {
  output: 'export',
  distDir: 'build',
  sassOptions: {
    includePaths: [path.join(path.dirname(import.meta.url), 'styles')],
    prependData: `@import "app/global.scss";`,
  },
  productionBrowserSourceMaps: true,
  images: {
    path: '',
    loader: 'custom',
    loaderFile: './image-loader.js',
  },
};

export default nextConfig;
