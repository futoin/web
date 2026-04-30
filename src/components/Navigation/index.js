
/**
 * Based on https://github.com/jamesmfriedman/rmwc/blob/master/src/docs/App.js
 */

import React, { useLayoutEffect, useState } from 'react'

import {
  TopAppBar,
  TopAppBarRow,
  TopAppBarSection,
  TopAppBarNavigationIcon,
  TopAppBarTitle,
  TopAppBarFixedAdjust
} from '@rmwc/top-app-bar';

import {
  Drawer,
  DrawerContent,
  DrawerAppContent,
} from '@rmwc/drawer';

import {
  CollapsibleList,
  List,
  ListItem,
  ListItemText,
  ListItemMeta,
} from '@rmwc/list';
import '@rmwc/list/styles';

import { Link } from 'gatsby'

import GatsbyConfig from '../../../gatsby-config'
import menuContent from '../../menu.json'

import LogoSVG from './futoin_logo.svg'

const MenuItem = ({ url, label, icon }) => {
  return (
    <ListItem tag={Link} to={url}>
        <ListItemText>{label}</ListItemText>
        {icon && <ListItemMeta icon={icon} />}
    </ListItem>
  );
};

const Submenu = ({ children, label, url, open }) => {
    return (
      <CollapsibleList
        handle={
          <MenuItem label={label} url={url} icon={children ? 'chevron_right' : null} />
        }
        open={open}
      >
        {children}
      </CollapsibleList>
    );
}

const GitHubSVG = (
    <svg
        aria-hidden="true"
        style={{ width: '24px', height: '24px' }}
        viewBox="0 0 24 24"
    >
        <path
        fill="#ffffff"
        d="M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z"
        />
    </svg>
);
const GitLabSVG = (
    <svg
        aria-hidden="true"
        style={{ width: '24px', height: '24px' }}
        viewBox="0 0 512 512">
        <path
        fill="#ffffff"
        d="M29.782 199.732L256 493.714 8.074 309.699c-6.856-5.142-9.712-13.996-7.141-21.993l28.849-87.974zm75.405-174.806c-3.142-8.854-15.709-8.854-18.851 0L29.782 199.732h131.961L105.187 24.926zm56.556 174.806L256 493.714l94.257-293.982H161.743zm349.324 87.974l-28.849-87.974L256 493.714l247.926-184.015c6.855-5.142 9.711-13.996 7.141-21.993zm-85.404-262.78c-3.142-8.854-15.709-8.854-18.851 0l-56.555 174.806h131.961L425.663 24.926z"></path>
    </svg>
);

const CodebergSVG = (
    <svg
        aria-hidden="true"
        fill="#ffffff" width="24px" height="24px" viewBox="0 0 24 24">
        <path d="M11.955.49A12 12 0 0 0 0 12.49a12 12 0 0 0 1.832 6.373L11.838 5.928a.187.14 0 0 1 .324 0l10.006 12.935A12 12 0 0 0 24 12.49a12 12 0 0 0-12-12 12 12 0 0 0-.045 0zm.375 6.467 4.416 16.553a12 12 0 0 0 5.137-4.213z"/>
    </svg>
);

const code_repos = [
    { url: 'https://github.com/futoin', Svg: GitHubSVG },
    { url: 'https://gitlab.com/futoin', Svg: GitLabSVG },
    { url: 'https://codeberg.org/futoin', Svg: CodebergSVG },
];

const MOBILE_WIDTH = 960;

const Navigation = ({children}) => {
    const [isMobile, setMobile] = useState(null);
    const [menuIsOpen, setMenuOpen] = useState(!isMobile);
    const [locPath, setLocPath] = useState(null);

    useLayoutEffect(() => {
        if (typeof window === 'undefined') {
            return undefined;
        }

        const doSizeCheck = () => {
            setMobile(window.innerWidth < MOBILE_WIDTH);
        };

        window.addEventListener('resize', doSizeCheck);
        doSizeCheck();

        return () => {
            window.removeEventListener('resize', doSizeCheck);
        };
    }, []);

    useLayoutEffect(() => {
        if (typeof window !== 'undefined') {
            setLocPath(window.location.pathname);
        }
    });

    return (
        <div>
            <TopAppBar fixed onNav={ () => setMenuOpen(!menuIsOpen) }>
                <TopAppBarRow>
                    <TopAppBarSection alignStart>
                        <TopAppBarNavigationIcon icon="menu" />
                    
                        <TopAppBarTitle tag={Link} to='/'> 
                            <img
                                src={LogoSVG}
                                alt="Logo"
                                style={{width: 24, height: 24}} />
                            &nbsp;
                            {GatsbyConfig.siteMetadata.title}
                        </TopAppBarTitle>
                    </TopAppBarSection>
                    <TopAppBarSection alignEnd>
                        {code_repos.map((v, i) => (
                            <TopAppBarNavigationIcon
                                key={`git-${i}`}
                                tag="a"
                                href={v.url}
                                target="_blank"
                                icon={v.Svg}
                                />
                        ))}
                    </TopAppBarSection>
                </TopAppBarRow>
            </TopAppBar>
            
            <TopAppBarFixedAdjust/>
            
            <div style={{overflow: 'hidden', position: 'relative'}}>
                <Drawer
                    dismissible={!isMobile}
                    modal={isMobile}
                    open={menuIsOpen}
                    onClose={() => setMenuOpen(false)} >

                    <DrawerContent>
                        {menuContent.map(m => {
                            if (m.disabled ) {
                                return null;
                            }

                            return (
                                <Submenu
                                    label={m.label}
                                    key={m.label}
                                    url={m.url ?? m.submenu?.[0].url}
                                    open={m.url === locPath || !!m.submenu?.find(v => locPath === v.url)}>
                                {m.submenu?.map(v => (
                                    <MenuItem key={v.label} label={v.label} url={v.url} />
                                ))}
                                </Submenu>
                            );
                        })}
                    </DrawerContent>
                </Drawer>

                <DrawerAppContent>
                    {children}
                </DrawerAppContent>
            </div>
        </div>);
};

export default Navigation;
