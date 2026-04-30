
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
    'gatsby-plugin-layout',
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
                {
                    resolve: `gatsby-remark-images`,
                    options: {
                        maxWidth: 590,
                        linkImagesToOriginal: true,
                    },
                },
                `gatsby-remark-prismjs`,
            ],
        },
    },
    'gatsby-plugin-image',
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
        resolve: `gatsby-plugin-sass`,
        options: {
            sassOptions: {
                includePaths: [
                    'node_modules',
                    'src',
                    '.',
                ],
            },
        },
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
            icon: 'src/components/Navigation/futoin_logo.svg',
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
            workboxConfig: {
                cacheId: siteMetadata.cacheId,
            }
        },
    },
  ],
};
