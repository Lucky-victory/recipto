import React, { useCallback, useEffect, useState } from 'react';
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
    SkeletonAvatar,
} from 'framework7-react';

import '@/css/home.scss';
import PostCard from '@/components/post-card';
import { isMobile } from '@/js/helper';
import { appwriteHandler, utils } from '../js/helper';
import { useDispatch, useSelector } from 'react-redux';
import { dropUser, fetchUser, updateUser } from '../js/state/slices/user';
import Avatar from '../components/avatar';
import RecipeCard from '../components/recipe-card';
import { fetchAllPosts } from '../js/state/slices/post';
import PostSkeleton from '../components/post-skeleton';
const HomePage = ({ f7router }) => {
    const dispatch = useDispatch();
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const { data: currentUser, loading: userLoading } = useSelector(
        (state) => state.user
    );
    const { data: allPosts, loading: postLoading } = useSelector(
        (state) => state.post
    );
    const fetchUserCb = useCallback(() => {
        dispatch(fetchUser());
    }, []);
    const fetchAllPostsCb = useCallback(() => {
        dispatch(fetchAllPosts());
    }, []);
    const [activeTab, setActiveTab] = useState('feed');
    const showSheetOrModal = (evt) => {
        setIsSheetOpen(true);
    };

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
    function handleTabShow(tab) {
        setActiveTab(tab);
    }
    function showRecipeAddPage() {
        f7router.navigate('/recipe/add', {
            openIn: !isMobile ? 'popup' : null,
        });
    }
    function logout() {
        dispatch(dropUser());
        f7router.navigate('/signin/', { reloadPrevious: true });
    }
    console.log({ allPosts });
    useEffect(() => {
        fetchUserCb();
        fetchAllPostsCb();
    }, [dispatch]);
    return (
        <Page
            name="home"
            onPageAfterIn={() => fetchAllPostsCb()}
            pageContent={false}
            noNavbar
        >
            {/* Toolbar */}
            <div className=" rt-toolbar-wrap">
                <Toolbar top tabbar className="rt-toolbar">
                    <Link tabLinkActive tabLink="#feed-tab">
                        Feed
                    </Link>
                    <Link tabLink="#community-tab">Communities</Link>
                </Toolbar>
                <div className="flex jc-center mt-a mb-a">
                    <Button text="log" onClick={() => logout()} />
                    <Avatar link={'/about/'} user={currentUser} />
                </div>
            </div>
            {/* Page content */}
            <Tabs swipeable={isMobile}>
                <Tab
                    onTabShow={() => handleTabShow('feed')}
                    tabActive
                    id="feed-tab"
                    className="rt-tab page-content"
                >
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
                                    {userLoading ? (
                                        <SkeletonAvatar
                                            slot="media"
                                            effect="fade"
                                            size={44}
                                        />
                                    ) : (
                                        <Avatar
                                            slot="media"
                                            user={currentUser}
                                            link={'/about/'}
                                        />
                                    )}
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
                    {/* {recipes.map((recipe) => (
                        <RecipeCard
                            recipe={recipe}
                            key={crypto.randomUUID()}
                            isInPost={false}
                            canShowActionBtns
                            canShowHeader
                        />
                    ))} */}
                    {postLoading && !allPosts?.length > 0
                        ? [1, 2, 3, 4, 5].map((skel) => (
                              <PostSkeleton key={crypto.randomUUID()} />
                          ))
                        : allPosts.map((post, index) => {
                              return (
                                  <PostCard
                                      key={crypto.randomUUID()}
                                      post={post}
                                  />
                              );
                          })}

                    <Sheet
                        style={{ maxHeight: 200 }}
                        opened={isSheetOpen}
                        onSheetClosed={() => setIsSheetOpen(false)}
                        swipeToClose
                    >
                        <Block>
                            <List noChevron>
                                <ListItem link="/post/add/" sheetClose>
                                    <Icon
                                        className="material-symbols-rounded"
                                        material="post_add"
                                        slot="media"
                                    />
                                    Create Post
                                </ListItem>

                                <ListItem link="/recipe/add" sheetClose>
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
                </Tab>
                <Tab
                    onTabShow={() => handleTabShow('community')}
                    id="community-tab"
                    className="rt-tab page-content"
                >
                    <Block>Tab 2</Block>
                </Tab>
            </Tabs>
            {isMobile && activeTab === 'feed' && (
                <Fab slot="fixed" className="rt-fab" onClick={showSheetOrModal}>
                    <Icon material="add" className="material-symbols-rounded" />
                </Fab>
            )}
        </Page>
    );
};
export default HomePage;
