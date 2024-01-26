
const futoin_json = require( './futoin.json' );

const siteMetadata = {
    title: `FutoIn Guide v${futoin_json.version}`,
    description: 'FutoIn project website',
    siteUrl: 'https://futoin.org',
    backgroundColor: "#fff",
    themeColor: "#311b92",
    cacheId: 'futoin-guide',
    googleTrackingId: "UA-113169407-1",
    //yandexTrackingId: '48203513',
    keywords: [
        'futoin',
    ],
};

module.exports = {
  siteMetadata,
  plugins: [
    {
        resolve: `gatsby-source-filesystem`,
        options: {
            name: `docs`,
            path: `${__dirname}/docs/`,
        },
    },
    {
        resolve: `gatsby-source-filesystem`,
        options: {
            name: `images`,
            path: `${__dirname}/src/images/`
        },
    },
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-catch-links',
    {
        resolve: `gatsby-transformer-remark`,
        options: {
            plugins: [
                `gatsby-remark-autolink-headers`,
                `gatsby-remark-copy-linked-files`,
                `gatsby-remark-smartypants`,
                {
                    resolve: "gatsby-remark-external-links",
                    options: {
                        target: "_blank"
                    }
                },
                `gatsby-plugin-sharp`,
                {
                    resolve: `gatsby-remark-images`,
                    options: {
                        maxWidth: 590,
                        linkImagesToOriginal: true,
                        sizeByPixelDensity: false,
                    },
                },
                `gatsby-remark-prismjs`,
            ],
        },
    },
    'gatsby-transformer-sharp',
    'gatsby-plugin-sharp',
    {
        resolve: `gatsby-plugin-canonical-urls`,
        options: {
            siteUrl: siteMetadata.siteUrl,
        },
    },
    'gatsby-plugin-no-sourcemaps',
    {
        resolve: `gatsby-plugin-postcss-sass`,
        options: {
            includePaths: [
                'node_modules',
                'src',
                '.',
            ],
        },
    },
    {
        resolve: `gatsby-plugin-favicon`,
        options: {
            logo: "./src/components/Navigation/futoin_logo.svg",
            injectHTML: true,
            icons: {
                android: true,
                appleIcon: true,
                appleStartup: false,
                coast: false,
                favicons: true,
                firefox: true,
                twitter: false,
                yandex: false,
                windows: false
            }
        }
    },
    {
        resolve: `gatsby-plugin-manifest`,
        options: {
            name: siteMetadata.title,
            short_name: siteMetadata.title,
            start_url: "/",
            background_color: siteMetadata.backgroundColor,
            theme_color: siteMetadata.themeColor,
            display: "minimal-ui",
            icons: [
                {
                    src: `/favicons/favicon-16x16.png`,
                    sizes: `16x16`,
                    type: `image/png`,
                },
                {
                    src: `/favicons/favicon-32x32.png`,
                    sizes: `32x32`,
                    type: `image/png`,
                },
                {
                    src: `/favicons/android-chrome-192x192.png`,
                    sizes: `192x192`,
                    type: `image/png`,
                },
                {
                    src: `/favicons/android-chrome-512x512.png`,
                    sizes: `512x512`,
                    type: `image/png`,
                },
            ],
        },
    },
    {
        resolve: `gatsby-plugin-google-analytics`,
        options: {
            trackingId: siteMetadata.googleTrackingId,
            anonymize: true,
            respectDNT: true,
            defer: true,
        },
    },
//    {
//        resolve: `gatsby-plugin-yandex-metrika`,
//        options: {
//            trackingId: siteMetadata.yandexTrackingId,
//            webvisor: true,
//            trackHash: true
//    },
//    },
    'gatsby-plugin-sitemap',
    // must be last
    {
        resolve: `gatsby-plugin-offline`,
        options: {
            cacheId: siteMetadata.cacheId,
        },
    },
  ],
};
