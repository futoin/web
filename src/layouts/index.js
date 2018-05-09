import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { RMWCProvider } from 'rmwc/Provider'

import Navigation from '../components/Navigation'


import './index.scss'

import GatsbyConfig from '../../gatsby-config'

const siteMetadata = GatsbyConfig.siteMetadata;
const json_ld_website = JSON.stringify(
{
"@context": "http://schema.org/",
"@type": "WebSite",
"name": siteMetadata.title,
"url": siteMetadata.siteUrl,
});

const TemplateWrapper = ({ children }) => (
  <div>
    <Helmet
        title={GatsbyConfig.siteMetadata.title}
        meta={[
            { name: 'description', content: siteMetadata.description },
            { name: 'keywords', content: siteMetadata.keywords.join(', ')},
        ]}>
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
    </Helmet>
    <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{__html: json_ld_website}}>
    </script>
    <RMWCProvider>
        <Navigation>
            {children()}
        </Navigation>
    </RMWCProvider>
  </div>
)

TemplateWrapper.propTypes = {
  children: PropTypes.func,
}

export default TemplateWrapper
