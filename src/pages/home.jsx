import React, { useEffect, useState } from 'react';
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
import { appwriteHandler, utils } from '../js/helper';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '../js/state/slices/user';
import Avatar from '../components/avatar';
import RecipeCard from '../components/recipe-card';
const HomePage = ({ f7router }) => {
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const userState = useSelector((state) => state.user.value);
    const dispatch = useDispatch();
    const [currentUser, setCurrentUser] = useState(userState);
    const showSheetOrModal = (evt) => {
        setIsSheetOpen(true);
    };

    useEffect(() => {
        // appwriteHandler.account.get().then((u) => {
        //     dispatch(updateUser(u));
        //     setCurrentUser(u);
        //     console.log({ currentUser });
        // });
    }, []);
    const posts = [
        {
            text: 'I just joined this site',
            id: 'post-1',
            user: {
                username: 'benlucky',
                name: 'Ben Lucky',
                prefs: {
                    avatar: 'https://randomuser.me/api/portraits/men/40.jpg',
                },
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
            photo: 'https://images.pexels.com/photos/699953/pexels-photo-699953.jpeg?auto=compress&cs=tinysrgb&w=600',

            likes_count: 10,
            comments_count: 15,
        },
        {
            text: 'I just joined this site',
            id: 'post-1',
            user: {
                username: 'luckyvictory',
                name: 'Lucky Victory',
                prefs: {
                    avatar: 'https://randomuser.me/api/portraits/men/49.jpg',
                },
            },
            created_at: 1686269779643,
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
    const recipes = [
        {
            likes_count: 10,
            comments_count: 15,
            created_at: 1686269779643,
            user: {
                username: 'luckyvictory',
                name: 'Lucky Victory',
                prefs: {
                    avatar: 'https://randomuser.me/api/portraits/men/49.jpg',
                },
            },
            id: 'rp-2',
            title: 'My Second recipe',
            slug: 'my-recipe-123',
            photo: 'https://images.pexels.com/photos/699953/pexels-photo-699953.jpeg?auto=compress&cs=tinysrgb&w=600',
        },
    ];
    function showRecipeAddPage() {
        f7router.navigate('/recipe/add', {
            openIn: !isMobile ? 'popup' : null,
        });
    }
    function logout() {
        appwriteHandler.account.deleteSessions();
    }
    return (
        <Page name="home" pageContent={false} noNavbar>
            {/* Toolbar */}
            <div className=" rt-toolbar-wrap">
                <Toolbar top tabbar className="rt-toolbar">
                    <Link tabLinkActive tabLink="#feed-tab">
                        Feed
                    </Link>
                    <Link tabLink="#community-tab">Communities</Link>
                </Toolbar>
                <div className="flex jc-center mt-a mb-a">
                    <Avatar link={'/about/'} user={currentUser} />
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
                    {recipes.map((recipe) => (
                        <RecipeCard
                            recipe={recipe}
                            key={crypto.randomUUID()}
                            isInPost={false}
                            canShowActionBtns
                            canShowHeader
                        />
                    ))}
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
