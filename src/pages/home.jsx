import React, { useCallback, useEffect, useRef, useState } from 'react';
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
    Navbar,
    NavRight,
    f7,
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
    const homeSheetRef = useRef(null);
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
    const showHomeSheet = () => {
        createSheet();
    };
    function createSheet() {
        if (!homeSheetRef.current) {
            homeSheetRef.current = f7.sheet.create({
                content: `
          <div class="rt-home-sheet sheet-modal sheet-modal-bottom">
          
          <div class="sheet-modal-inner">
          <div class="page-content">
          <div className="swipe-handler"></div>
                <div class="block">
                <div class="list media-list no-chevron">
    <ul>
        
   
                 <li>
  <a href="/post/add" class="item-link">
    <div class="item-content">
      <div class="item-media">
      <i class='icon material-symbols-rounded'>post_add</i>
      </div>
      <div class="item-inner">Create post</div>
    </div>
  </a>
</li>
      <li>
  <a href="/recipe/add" class="item-link">
    <div class="item-content">
      <div class="item-media">
      <i class='icon material-symbols-rounded'>add_circle</i>
      </div>
      <div class="item-inner">Create Recipe</div>
    </div>
  </a>
</li>
 </ul>
</div>
                </div>
              </div>
            </div>
          </div>
        `.trim(),
                swipeToClose: true,
            });
        }

        homeSheetRef.current.open();
    }
    function onPageBeforeOut() {
        f7.sheet.close();
    }
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
            openIn: !isMobile ? 'popup' : undefined,
        });
    }
    function logout() {
        dispatch(dropUser());
        f7router.navigate('/signin/', {
            reloadPrevious: true,
            clearPreviousHistory: true,
        });
    }

    useEffect(() => {
        fetchUserCb();
        fetchAllPostsCb();
    }, [dispatch]);
    return (
        <Page
            name="home"
            onPageBeforeOut={onPageBeforeOut}
            className="rt-home-page"
            onPageAfterIn={() => fetchAllPostsCb()}
        >
            <Navbar className="rt-navbar">
                <NavRight style={{ paddingRight: 16 }}>
                    <div className="flex jc-center mt-a mb-a">
                        <Button text="log" onClick={() => logout()} />
                        <Avatar link={'/about/'} user={currentUser} />
                    </div>
                </NavRight>
            </Navbar>

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
                                <Button href="/post/add" openIn="popup" outline>
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

            {postLoading && !allPosts?.length > 0
                ? [1, 2, 3, 4, 5].map(() => (
                      <PostSkeleton key={crypto.randomUUID()} />
                  ))
                : allPosts.length > 0 &&
                  allPosts.map((post, index) => (
                      <PostCard key={crypto.randomUUID()} post={post} />
                  ))}

            {isMobile && (
                <Fab
                    slot="fixed"
                    className="rt-fab"
                    onClick={() => showHomeSheet()}
                >
                    <Icon material="add" className="material-symbols-rounded" />
                </Fab>
            )}
        </Page>
    );
};
export default HomePage;

/* {recipes.map((recipe) => (
                        <RecipeCard
                            recipe={recipe}
                            key={crypto.randomUUID()}
                            isInPost={false}
                            canShowActionBtns
                            canShowHeader
                        />
                    ))} */
