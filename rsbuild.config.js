import { defineConfig, rspack } from '@rsbuild/core';
import { pluginEslint } from '@rsbuild/plugin-eslint';
import { pluginReact } from '@rsbuild/plugin-react';
import autoprefixer from 'autoprefixer';
import nodeconfig from 'config';
import { Liquid } from 'liquidjs';
import { existsSync } from 'node:fs';
import path from 'node:path';

// LiquidJS helper
async function renderLiquidTemplate(templateFile, values = {}) {
  const engine = new Liquid({
    root: path.dirname(templateFile),
    extname: '.html',
  });

  const templateName = path.basename(templateFile);
  return engine.renderFile(templateName, values);
}

// Docs: https://rsbuild.rs/config/
export default defineConfig(({ env }) => ({
  plugins: [
    pluginReact(),
    pluginEslint({
      enable: true,
      eslintPluginOptions: {
        configType: 'flat',
        lintDirtyModulesOnly: false,
        extensions: ['js', 'jsx'],
        fix: env === 'development',
      },
    }),
  ],

  source: {
    entry: {
      index: './src/index.jsx',
    },
    assetsInclude: [/\.(doc?x|xls?x|pdf)$/],
  },

  dev: {
    hmr: true,
    liveReload: false,
    progressBar: true,
  },

  html: {
    mountId: 'root',
    template: './src/index.html',
    favicon: './src/assets/favicon.ico',
  },

  server: {
    host: 'localhost',
    port: '3000',
    historyApiFallback: true,
    strictPort: true,
  },

  output: {
    module: true,
    cleanDistPath: true,
    sourceMap: {
      js:
        env === 'development'
          ? 'cheap-module-source-map'
          : 'nosources-source-map',
      css: env === 'development',
    },
    filename: {
      // html: 'index.html',
      // image: '[name][ext]',
      assets: '[name][ext]',
    },
    polyfill: 'usage',
    minify: {
      jsOptions: {
        exclude: /node_modules/,
      },
    },
  },

  resolve: {
    aliasStrategy: 'prefer-alias',
    alias: {
      lodash$: 'lodash-es',
    },
  },

  tools: {
    htmlPlugin: (options) => {
      const pageTitle = nodeconfig.get('pageTitle');
      const templateFile = path.resolve('src/index.html');

      if (existsSync(templateFile)) {
        options.templateContent = async () => {
          const rendered = await renderLiquidTemplate(templateFile, {
            PAGE_TITLE: pageTitle,
          });

          return rendered;
        };

        delete options.template;
      }

      return options;
    },

    postcss: (options, { addPlugins }) => {
      addPlugins(autoprefixer);
    },

    swc: {
      jsc: {
        parser: {
          jsx: true,
          syntax: 'ecmascript',
        },
      },
      modules: {
        type: 'es6',
      },
      isModule: true,
    },

    rspack: {
      plugins: [
        new rspack.ContextReplacementPlugin(/moment[/\\]locale$/, /en/),
      ],
    },
  },
}));
