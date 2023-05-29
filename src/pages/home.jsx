import React,{useState} from 'react';
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
  Tabs,
  Card,
  CardHeader,
  CardContent,
  Icon,
  CardFooter,
  Fab,
  FabBackdrop,
  FabButton,
  Sheet,
  Popup,
  ListInput,
  Input,
  Chip,
} from 'framework7-react';
import { getDevice } from 'framework7';
import '../css/home.scss'
const HomePage = () => {
  const device=getDevice();
  const isMobile=(device.android || device.ios);
const [isSheetOpen,setIsSheetOpen]=useState(false);
  const showSheetOrModal=(evt)=>{
setIsSheetOpen(true)
  }
  return (
  <Page name="home" pageContent={false} noNavbar>
    
    {/* Toolbar */}
    <div className=" rt-toolbar-wrap" >

    <Toolbar  top tabbar className='rt-toolbar elevation-2'>
      <Link tabLinkActive tabLink='#feed-tab'>Feed</Link>
      <Link tabLink='#community-tab'>Communities</Link>

    </Toolbar>
      <div  className='flex jc-center mt-a mb-a'>
      <Link iconOnly href='/about/'>
        <img src="https://randomuser.me/api/portraits/men/40.jpg" alt="" className="rt-avatar rt-avatar-sm" />
        </Link>
      </div>
    </div>
    {/* Page content */}
      <Tabs swipeable={device.ios||device.android}>
    <Tab  tabActive id='feed-tab' className='rt-tab page-content'>
    {!isMobile &&

<Block >
 <List mediaList className='rt-single-input-list'>
<ListInput outline 
    className='rt-input' placeholder='What are you cooking today?'>
    <div slot='media' className="rt-avatar-wrap"><img src="https://randomuser.me/api/portraits/men/40.jpg"  alt="" className="rt-avatar" /></div>

  
   <Button round slot='content'  >
    <Icon material='add_a_photo' className='material-symbols-rounded'/>
   </Button>
   </ListInput>
  <Block className='mt-0'>

  <div className="flex">
    <Button openIn={!isMobile?'popup':null} round tonal href='/add-recipe/'><Icon material='add_circle' className='material-symbols-rounded' /> 
    <span>
      Create Recipe
      </span>
      </Button>
  </div>
  </Block>
   </List> 
</Block>
}
<Card  className='rt-card'>

  <CardHeader className='rt-card-header'>
  <div  className='flex jc-center '>
      <Link href='#' className='rt-card-header-link flex jc-center ov-hidden'>
        <img src="https://randomuser.me/api/portraits/men/40.jpg" alt="" className="rt-avatar" />
<div className=" ml-4">

<div className="text-bold rt-card-header-name">Victory Lucky</div>
<span className='text-grey text-sm'>1h</span>
</div>
        </Link>

      </div>
      <Link href='#' iconOnly ><Icon material='more_vert' className='material-symbols-rounded'></Icon></Link>
  </CardHeader>
  <CardContent className='rt-card-content'>
    <div className="rt-card-content-inner">

  <div className="rt-card-img-wrap">
<div className="rt-img-placeholder">
  <span>Brazilian Recipe</span>
</div>
<img hidden src="https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg?quality=90&webp=true&resize=700,636" alt="" className="rt-card-img" />
    </div>
    <div className="rt-card-content-title">
      <span className="text-bold">Brazilian Recipe</span>
    </div>
    </div>
  </CardContent>

  <CardFooter className='rt-card-footer'>
    <Button round>
      <Icon className='material-symbols-rounded' material='thumb_up'/>
    </Button>
    <Button round>
      <Icon className='material-symbols-rounded' material='chat'/>
    </Button>
    <Button round>
      <Icon className='material-symbols-rounded' md='material:share' ios="material:ios_share"/>
    </Button>
  </CardFooter>
</Card>

{isMobile &&
<Sheet  style={{maxHeight:180}} opened={isSheetOpen} onSheetClosed={()=>setIsSheetOpen(false)}  swipeToClose >
<Block>
<List noChevron>
  <ListItem link >
    <Icon className='material-symbols-rounded' material='post_add' slot='media'/>
    Create Post
  </ListItem>

  <ListItem   openIn={!isMobile?'popup':null} sheetClose link='/add-recipe/'>

  <Icon className='material-symbols-rounded' material='add_circle' slot='media'/>
    Create Recipe
  </ListItem>
</List>
</Block>
</Sheet>
}



{isMobile &&
<Fab  className='rt-fab' onClick={showSheetOrModal}>

<Icon  material='add' className='material-symbols-rounded'/>
</Fab>

}

<Block>
  
</Block>
    </Tab>
    <Tab id='community-tab'  className='rt-tab page-content'>
<Block>
  Tab 2
</Block>
    </Tab>
      </Tabs>
  </Page>
)}
export default HomePage;