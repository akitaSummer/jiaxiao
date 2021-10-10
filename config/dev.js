module.exports = {
    env: {
        NODE_ENV: '"development"'
    },
    defineConstants: {},
    weapp: {
        postcss: {
            autoprefixer: {
                enable: true
            },
            // 小程序端样式引用本地资源内联配置
            url: {
                enable: true,
                config: {
                    limit: 10240 // 文件大小限制
                }
            }
        }
    },
    mini: {},
    h5: {
        esnextModules: ['taro-ui'],
        devServer: {
            host: 'localhost',
            port: 10086,
            proxy: {
                '/': {
                    target: 'https://doudou0.online/',
                    changeOrigin: true
                },
                '/bg': {
                    target: 'https://doudou0.online/bg',
                    changeOrigin: true
                },
                '/rec': {
                    target: 'https://doudou0.online/rec',
                    changeOrigin: true
                }
            }
        }
    }
}