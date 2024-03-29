
import React from 'react'
import { Button } from 'rmwc/Button';
import { Icon } from 'rmwc/Icon';
import { Helmet } from "react-helmet";
import Link from 'gatsby-link'

import GatsbyConfig from '../../../gatsby-config'
import menuContent from '../../menu.json'

const flat_menu = [];

for (let m of menuContent) {
    if (m.submenu) {
        for ( let sm of m.submenu ) {
            sm = Object.assign(
                {
                    full_label: `${m.label}: ${sm.label}`,
                    disabled: m.disabled,
                },
                sm
            );
            flat_menu.push( sm );
        }
    } else {
        m = Object.assign(
            {
                full_label: m.label
            },
            m
        );
        flat_menu.push( m );
    }
}

class Page extends React.Component {
    componentDidUpdate(prevProps) {
        if ( prevProps.pathContext.frontmatter.path != this.props.pathContext.frontmatter.path ) {
            window.scrollTo( 0, 0 );
        }
    }
    
    render() {
        const { pathContext } = this.props;
        const { path, description, keywords } = pathContext.frontmatter;
        let prev, next, curr;
        
        for (let m of flat_menu) {
            if ( path === m.url ) {
                curr = m;
            } else if (m.disabled) {
                continue;
            } else if (curr) {
                next = m;
                break;
            } else {
                prev = m;
            }
        }
        
        if (!curr) {
            throw new Error(`Missing current for "${path}"`);
        }
        
        return (
            <div className="mdc-typography">
                <Helmet>
                    <title> {curr.full_label} | {GatsbyConfig.siteMetadata.title} </title>
                    { description && <meta name="description" content={description} />}
                    { keywords && <meta name="keywords" content={keywords} />}
                    { prev && <link rel="prev" href={prev.url} /> }
                    { next && <link rel="next" href={next.url} /> }
                </Helmet>
                <article dangerouslySetInnerHTML={{__html: pathContext.html}} />
                <div className="nav-buttons"> 
                    <div className="nav-prev">
                        {prev &&
                            <Link to={prev.url}>
                                <Button theme="secondary-dark"> 
                                    <Icon iconOptions={{strategy:"ligature"}} icon="chevron_left" />
                                    {prev.full_label}
                                </Button>
                            </Link>}
                    </div>
                    <div className="nav-next">
                        {next &&
                            <Link to={next.url}>
                                <Button raised theme="secondary-bg">
                                    <Icon iconOptions={{strategy:"ligature"}} icon="chevron_right" />
                                    {next.full_label}
                                </Button>
                            </Link>}
                    </div>
                </div>
            </div>
        );
    }
}

export default Page;
