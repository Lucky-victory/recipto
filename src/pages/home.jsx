import React from 'react';
import {
  Page,
  Navbar,
  NavLeft,
  NavTitle,
  NavTitleLarge,
  NavRight,
  Link,
  Toolbar,
  Block,
  BlockTitle,
  List,
  ListItem,
  Button,
  Tab,
  Tabs
} from 'framework7-react';
import { getDevice } from 'framework7/types';

const HomePage = () => {
  const device=getDevice();
  (
  <Page name="home" >
    {/* Top Navbar */}
    <Navbar sliding={false}>
      <NavLeft>
        <Link iconIos="f7:menu" iconMd="material:menu" panelOpen="left" />
      </NavLeft>
      
      <NavRight>
        <Link iconOnly>
        <img src="https://randomuser.me/api/portraits/men/40.jpg" alt="" className="rt-avatar rt-avatar-sm" />
        </Link>
      </NavRight>
      
    </Navbar>
    {/* Toolbar */}
    <Toolbar top tabbar >
      <Link tabLinkActive tabLink='feed-tab' >Feed</Link>
      <Link tabLink='community-tab'>Communities</Link>
    </Toolbar>
    {/* Page content */}
      <Tabs swipeable={device.android||device.ios}>
    <Tab   tabActive id={'feed-tab'} className='page-content'>
lotenm
    </Tab>
    <Tab id={'community-tab'}>

    </Tab>
      </Tabs>
  </Page>
)}
export default HomePage;