import React, { useState } from 'react';
import {
    Page,
    Link,
    Toolbar,
    Block,
    List,
    ListItem,
    Button,
    Tab,
    Tabs,
    Icon,
    Fab,
    Sheet,
    ListInput,
} from 'framework7-react';

import '@/css/home.scss';
import PostCard from '@/components/post-card';
import { isMobile } from '@/js/helper';
import { appwriteHandler } from '../js/helper';
const HomePage = ({ f7router }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const showSheetOrModal = (evt) => {
        setIsSheetOpen(true);
    };
    async function getUser() {
        try {
            const u = await appwriteHandler.account.updatePrefs({
                avatar: 'https://randomuser.me/api/portraits/men/40.jpg',
            });
            const user = await appwriteHandler.account.get();
            setCurrentUser(user);
            console.log({ u, user });
        } catch (e) {
            console.log('user error', e);
        }
    }
    const posts = [
        {
            text: 'I just joined this site',
            id: 'post-1',
            user: {
                username: 'benlucky',
                fullname: 'Ben Lucky',
                avatar: 'https://randomuser.me/api/portraits/men/40.jpg',
            },
            created_at: 1685621640517,
            updated_at: '',
            has_recipe: true,
            recipe: {
                id: 'rp-1',
                title: 'My first recipe',
                slug: 'my-recipe-123',
                photo: 'https://images.pexels.com/photos/699953/pexels-photo-699953.jpeg?auto=compress&cs=tinysrgb&w=600',
            },
            photo: null,
            likes_count: 10,
            comments_count: 15,
        },
        {
            text: 'I just joined this site',
            id: 'post-1',
            user: {
                username: 'luckyvictory',
                fullname: 'Lucky Victory',
                avatar: 'https://randomuser.me/api/portraits/men/49.jpg',
            },
            created_at: 1685621640517,
            updated_at: '',
            has_recipe: false,
            recipe: {
                id: 'rp-2',
                title: 'My Second recipe',
                slug: 'my-recipe-123',
                photo: 'https://images.pexels.com/photos/699953/pexels-photo-699953.jpeg?auto=compress&cs=tinysrgb&w=600',
            },
            photo: 'https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=600',
            likes_count: 10,
            comments_count: 15,
        },
    ];

    function showRecipeAddPage() {
        f7router.navigate('/recipe/add', {
            openIn: !isMobile ? 'popup' : null,
        });
    }
    return (
        <Page name="home" onPageBeforeIn={getUser} pageContent={false} noNavbar>
            {/* Toolbar */}
            <div className=" rt-toolbar-wrap">
                <Toolbar top tabbar className="rt-toolbar">
                    <Link tabLinkActive tabLink="#feed-tab">
                        Feed
                    </Link>
                    <Link tabLink="#community-tab">Communities</Link>
                    <Link text="signin" href="/signin/" />
                    <Link text="onboard" href="/onboard/" />
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
                                    onFocus={showRecipeAddPage}
                                    readonly
                                    className="rt-input"
                                    placeholder="What are you cooking today?"
                                >
                                    <div
                                        slot="media"
                                        className="rt-avatar-wrap"
                                    >
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
                                            href="/post/add"
                                            openIn="popup"
                                            outline
                                        >
                                            <Icon
                                                material="post_add"
                                                className="material-symbols-rounded"
                                            />
                                            <span>Create Post</span>
                                        </Button>
                                    </div>
                                </Block>
                            </List>
                        </Block>
                    )}

                    {posts.map((post, index) => {
                        return <PostCard key={index} post={post} />;
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
                                    <ListItem
                                        link="/post/add/"
                                        sheetClose
                                        openIn={!isMobile ? 'popup' : null}
                                    >
                                        <Icon
                                            className="material-symbols-rounded"
                                            material="post_add"
                                            slot="media"
                                        />
                                        Create Post
                                    </ListItem>

                                    <ListItem
                                        openIn={!isMobile ? 'popup' : null}
                                        link="/recipe/add"
                                        sheetClose
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
