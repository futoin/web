
/**
 * Based on https://github.com/jamesmfriedman/rmwc/blob/master/src/docs/App.js
 */

import React from 'react'

import {
  Toolbar,
  ToolbarRow,
  ToolbarSection,
  ToolbarTitle,
  ToolbarMenuIcon,
  ToolbarIcon,
  ToolbarFixedAdjust
} from 'rmwc/Toolbar'

import {
  Drawer,
  DrawerHeader,
  DrawerContent
} from 'rmwc/Drawer';

import {
  List,
  ListItem,
  ListItemText
} from 'rmwc/List';

import Link from 'gatsby-link'
import Submenu from '../Submenu'

import GatsbyConfig from '../../../gatsby-config'
import menuContent from '../../menu.json'

const MenuItem = ({ url, label }) => {
  return (
    <Link to={url}>
        <ListItem>
            <ListItemText>{label}</ListItemText>
        </ListItem>
    </Link>
  );
};

import LogoSVG from './futoin_logo.svg'
import TumblrSVG from './tumblr-logo-white.svg'

const GitHubSVG = (
    <svg
        style={{ width: '24px', height: '24px' }}
        viewBox="0 0 24 24"
    >
        <path
        fill="#ffffff"
        d="M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z"
        />
    </svg>
);

export class Navigation extends React.Component {
    componentDidMount() {
        window.addEventListener('resize', () => this.doSizeCheck());
        this.doSizeCheck();
    }

    state = {
        menuIsOpen: false,
        isMobile: true
    };

    doSizeCheck() {
        if (window.innerWidth > 960) {
            this.setState({ isMobile: false, menuIsOpen: true });
        } else {
            this.setState({ isMobile: true, menuIsOpen: false });
        }
    }
    
    render() {
        return (
            <div className="docs-container">
                <Toolbar fixed waterfall>
                    <ToolbarRow>
                        <ToolbarSection alignStart>
                        
                            { this.state.isMobile &&
                            <ToolbarMenuIcon
                                use="menu"
                                onClick={ () => this.setState({ menuIsOpen : !this.state.menuIsOpen})}
                            /> }
                            
                            <ToolbarTitle> 
                                <Link to="/">
                                <img
                                    src={LogoSVG}
                                    style={{width: 24, height: 24}} />
                                &nbsp;
                                {GatsbyConfig.siteMetadata.title}
                                </Link>
                            </ToolbarTitle>
                        </ToolbarSection>
                        <ToolbarSection alignEnd>
                            <ToolbarIcon
                                tag="a"
                                href="https://futoin.tumblr.com/"
                                target="_blank"
                                use={<img
                                        src={TumblrSVG}
                                        style={{width: 24, height: 24}} />}
                            />
                            <ToolbarIcon
                                tag="a"
                                href="https://github.com/futoin/"
                                target="_blank"
                                use={GitHubSVG}
                            />
                        </ToolbarSection>
                    </ToolbarRow>
                </Toolbar>
                <ToolbarFixedAdjust />

                <Drawer
                    open={this.state.menuIsOpen}
                    persistent={!this.state.isMobile}
                    temporary={this.state.isMobile}
                    onClose={() => this.setState({ menuIsOpen: false })} >

                    <DrawerContent>
                        {menuContent.map(m => {
                            if (m.disabled ) {
                                return null;
                            }
                            
                            if (m.submenu) {
                                return (
                                    <Submenu label={m.label} key={m.label}>
                                    {m.submenu.map(v => (
                                        <MenuItem key={v.label} label={v.label} url={v.url} />
                                    ))}
                                    </Submenu>
                                );
                            }
                            
                            return <MenuItem label={m.label} url={m.url} key={m.label} />;
                        })}
                    </DrawerContent>
                </Drawer>
                
                <main className="app__content">
                    {this.props.children}
                </main>
            </div>
        );
    }
}

export default Navigation;
