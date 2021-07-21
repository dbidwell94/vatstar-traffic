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
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
            },
          },
        },
        {
          test: /\.(svg|png|jpe?g|gif)$/,
          use: 'url-loader',
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
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
    output: {
      path: path.join(__dirname, 'dist'),
      filename: isProduction ? '[chunkhash].bundle.js' : '[name].js',
    },
    
    devServer: {
      hot: true,
      open: true,
      historyApiFallback: true,
      port: 4050,
    },
  };
}
