import React, { useState } from "react";
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
} from "framework7-react";
import { getDevice } from "framework7";
import "../css/home.scss";
import isEmpty from "just-is-empty";
const HomePage = () => {
  const device = getDevice();
  const isMobile = device.android || device.ios;
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const showSheetOrModal = (evt) => {
    setIsSheetOpen(true);
  };

  const posts = [
    {
      text: "I just joined this site",
      id: "post-1",
      user: {
        username: "benlucky",
        fullname: "Ben Lucky",
        avatar: "https://randomuser.me/api/portraits/men/40.jpg",
      },
      created_at: 1685621640517,
      updated_at: "",
      has_recipe: true,
      recipe: {
        id: "rp-1",
        title: "My first recipe",
        slug: "my-recipe-123",
        photo:
          "https://images.pexels.com/photos/699953/pexels-photo-699953.jpeg?auto=compress&cs=tinysrgb&w=600",
      },
      photo: null,
      likes_count: 10,
      comments_count: 15,
    },
    {
      text: "I just joined this site",
      id: "post-1",
      user: {
        username: "luckyvictory",
        fullname: "Lucky Victory",
        avatar: "https://randomuser.me/api/portraits/men/49.jpg",
      },
      created_at: 1685621640517,
      updated_at: "",
      has_recipe: false,
      recipe: {
        id: "rp-2",
        title: "My Second recipe",
        slug: "my-recipe-123",
        photo:
          "https://images.pexels.com/photos/699953/pexels-photo-699953.jpeg?auto=compress&cs=tinysrgb&w=600",
      },
      photo: 'https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=600',
      likes_count: 10,
      comments_count: 15,
    },
  ];
  return (
    <Page name="home" pageContent={false} noNavbar >
      {/* Toolbar */}
      <div className=" rt-toolbar-wrap">
        <Toolbar top tabbar className="rt-toolbar">
          <Link tabLinkActive tabLink="#feed-tab">
            Feed
          </Link>
          <Link tabLink="#community-tab">Communities</Link>
        </Toolbar>
        <div className="flex jc-center mt-a mb-a">
          <Link iconOnly href="/about/">
            <img
              src="https://randomuser.me/api/portraits/men/40.jpg"
              alt=""
              className="rt-avatar rt-avatar-sm"
            />
          </Link>
        </div>
      </div>
      {/* Page content */}
      <Tabs swipeable={isMobile}>
        <Tab tabActive id="feed-tab" className="rt-tab page-content">
          {!isMobile && (
            <Block>
              <List mediaList className="rt-single-input-list">
                <ListInput
                  outline
                  readonly
                  className="rt-input"
                  placeholder="What are you cooking today?"
                >
                  <div slot="media" className="rt-avatar-wrap">
                    <img
                      src="https://randomuser.me/api/portraits/men/40.jpg"
                      alt=""
                      className="rt-avatar"
                    />
                  </div>

                  <Button round slot="content">
                    <Icon
                      material="add_a_photo"
                      className="material-symbols-rounded"
                    />
                  </Button>
                </ListInput>
                <Block className="mt-0">
                  <div className="flex">
                    <Button
                      openIn={!isMobile ? "popup" : null}
                      round
                      tona
                      href="/add-recipe/"
                      outline
                    >
                      <Icon
                        material="add_circle"
                        className="material-symbols-rounded"
                      />
                      <span>Create Recipe</span>
                    </Button>
                  </div>
                </Block>
              </List>
            </Block>
          )}

          {posts.map((post, index) => {
            return (
              <Card key={index} className="rt-card">
                <CardHeader className="rt-card-header">
                  <div className="flex jc-center ">
                    <Link
                      href="#"
                      // add link to user profile
                      className="rt-card-header-link flex jc-center ov-hidden flex-grow"
                    >
                      <img
                        src={post.user?.avatar}
                        loading="lazy"
                        alt=""
                        className="rt-avatar"
                      />
                      <div className=" ml-4">
                        <div className="text-bold rt-card-header-name">
                          {post.user?.fullname}
                        </div>
                        <span className="text-grey text-sm">1h</span>
                      </div>
                    </Link>
                  </div>
                  <Link href="#" iconOnly>
                    <Icon
                      material="more_vert"
                      className="material-symbols-rounded"
                    ></Icon>
                  </Link>
                </CardHeader>

                    <Block className='text-md'>
                      {post.text||''}
                    </Block>

                    {
                      (post.photo||post.has_recipe )&&

                <CardContent  className="rt-card-content">
                  <Link href='/about/' className="rt-card-content-inner">

                    <div className="rt-card-img-wrap">
                      {(isEmpty(post.photo) && post.has_recipe) && (
                        <div className="rt-img-placeholder">
                          <span>{post.recipe?.title}</span>
                        </div>
                      )}
                      {post.photo && 
                        <img
                          src={post?.photo}
                          alt=""
                          loading="lazy"
                          className="rt-card-img"
                        />
                      }
                      {(isEmpty(post.photo) && post.recipe?.photo) && (
                        <img hidden
                          src={post.recipe?.photo}
                          alt=""
                          loading="lazy"
                          className="rt-card-img"
                        />
                      )}
                    </div>
                    {post.has_recipe && (
<div className="rt-card-content-footer">

                      
                      <div className="rt-card-content-title">
                        <span className="text-bold">{post.recipe?.title}</span>
                      </div>
                      <Link iconOnly>
                        <Icon material="bookmark" className="material-symbols-rounded"/>
                      </Link>
</div>
                    )}
                  </Link>
                </CardContent>
                }
                
                  <Block className="mt-4 mb-4">
                    {post.likes_count > 0 &&
<Block className="text-grey text-bold text-md">


                  { post.likes_count+' Likes'}
</Block>
}

                  </Block>
            
                <CardFooter className="rt-card-footer">
                  <Button round>
                    <Icon
                      className="material-symbols-rounded"
                      material="thumb_up"
                    />
                  </Button>
                  <Button round>
                    <Icon
                      className="material-symbols-rounded"
                      material="chat"
                      />
                  </Button>
                  <Button round>
                    <Icon
                      className="material-symbols-rounded"
                      md="material:share"
                      ios="material:ios_share"
                    />
                  </Button>
                </CardFooter>
              </Card>
            );
          })}

          {isMobile && (
            <Sheet
              style={{ maxHeight: 200 }}
              opened={isSheetOpen}
              onSheetClosed={() => setIsSheetOpen(false)}
              swipeToClose
            >
              <Block>
                <List noChevron>
                  <ListItem link>
                    <Icon
                      className="material-symbols-rounded"
                      material="post_add"
                      slot="media"
                    />
                    Create Post
                  </ListItem>

                  <ListItem
                    openIn={!isMobile ? "popup" : null}
                    sheetClose
                    link="/add-recipe/"
                  >
                    <Icon
                      className="material-symbols-rounded"
                      material="add_circle"
                      slot="media"
                    />
                    Create Recipe
                  </ListItem>
                </List>
              </Block>
            </Sheet>
          )}

         
        </Tab>
        <Tab id="community-tab" className="rt-tab page-content">
          <Block>Tab 2</Block>
        </Tab>
      </Tabs>
      {isMobile && (
            <Fab slot="fixed" className="rt-fab" onClick={showSheetOrModal}>
              <Icon material="add" className="material-symbols-rounded" />
            </Fab>
          )}

          
    </Page>
  );
};
export default HomePage;
