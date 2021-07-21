import { Configuration } from 'webpack';
import htmlPlugin from 'html-webpack-plugin';
import path from 'path';
import pathsPlugin from 'tsconfig-paths-webpack-plugin';

const isProduction = process.env.NODE_ENV === 'production';

export default function (): Configuration {
  return {
    mode: isProduction ? 'production' : 'development',
    module: {
      rules: [
        {
          test: /\.(jsx?|tsx?)$/,
          use: {
            loader: 'ts-loader',
          },
        },
        {
          test: /\.(svg|png|jpe?g|gif)$/,
          use: "url-loader"
        }
      ],
    },
    resolve: {
      extensions: ['.js', '.ts', '.tsx', '.jsx'],
      plugins: [
        new pathsPlugin({
          configFile: path.join(__dirname, 'tsconfig.json'),
        }),
      ],
    },
    plugins: [
      new htmlPlugin({
        template: path.join(__dirname, 'public', 'index.html'),
      }),
    ],
    devServer: {
      hot: true,
      open: true,
      historyApiFallback: true,
      port: 4050,
    },
  };
}
