const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        '/api',  // This is the api prefix to trigger the proxy
        createProxyMiddleware({
            target: 'https://oaidalleapiprodscus.blob.core.windows.net/',
            changeOrigin: true,  // Needed for virtual hosted sites
            pathRewrite: {
                '^/api': '', // rewrite path if necessary
            },
        })
    );
};
