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
    NavLeft,
} from 'framework7-react';

import '@/css/home.scss';
import PostCard from '@/components/post-card';
import { isMobile } from '@/js/helper';

import { useDispatch, useSelector } from 'react-redux';
import { dropUser, fetchUser } from '../js/state/slices/user';
import Avatar from '../components/avatar';
import RecipeCard from '../components/recipe-card';
import { fetchAllPosts } from '../js/state/slices/post';
import PostSkeleton from '../components/post-skeleton';
import { fetchAllRecipes } from '../js/state/slices/recipe';
import isEmpty from 'just-is-empty';
import orderBy from 'just-order-by';
const HomePage = ({ f7router, f7route }) => {
    const dispatch = useDispatch();
    const homeSheetRef = useRef(null);
    // const [isSheetOpen, setIsSheetOpen] = useState(false);
    const { data: currentUser, loading: userLoading } = useSelector(
        (state) => state.user
    );
    const { data: allPosts, loading: postLoading } = useSelector(
        (state) => state.post
    );
    const { data: allRecipes, loading: recipeLoading } = useSelector(
        (state) => state.recipes
    );
    const mergedData = [...allPosts, ...allRecipes];
    const orderedData = orderBy(mergedData, [
        {
            property(d) {
                return new Date(d?.created_at).getTime();
            },
            order: 'desc',
        },
    ]);
    function isRecipe(item) {
        return 'title' in item;
    }
    const fetchUserCb = useCallback(() => {
        dispatch(fetchUser());
    }, []);
    const fetchAllPostsCb = useCallback(() => {
        dispatch(fetchAllPosts());
    }, []);
    const fetchAllRecipesCb = useCallback(() => {
        dispatch(fetchAllRecipes());
    }, []);
    // const [activeTab, setActiveTab] = useState('feed');
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
        f7.popover.close();
    }
    // function handleTabShow(tab) {
    //     setActiveTab(tab);
    // }

    function onPageBeforeIn() {
        // fetchUserCb();
        // if (isEmpty(currentUser)) {
        //     f7router.navigate('/signin/');
        // }
    }

    function showRecipeAddPage() {
        f7router.navigate('/recipe/add', {
            openIn: !isMobile ? 'popup' : undefined,
        });
    }
    function logout() {
        dispatch(dropUser());
        setTimeout(() => {
            f7router.navigate('/signin/', {
                clearPreviousHistory: true,
                reloadPrevious: true,
            });
        }, 1000);
    }

    useEffect(() => {
        fetchUserCb();
        fetchAllPostsCb();
        fetchAllRecipesCb();
    }, [dispatch]);
    function refetch() {
        // fetchUserCb();
        fetchAllPostsCb();
        fetchAllRecipesCb();
        setTimeout(() => {
            f7.ptr.done();
        }, 3000);
    }
    return (
        <Page
            name="home"
            ptrDistance={isMobile ? 100 : 200}
            ptr
            ptrMousewheel={true}
            onPtrRefresh={refetch}
            onPageBeforeOut={onPageBeforeOut}
            onPageBeforeIn={onPageBeforeIn}
            className="rt-home-page"
        >
            <Navbar className="rt-navbar">
                <NavLeft>
                    <div className="rt-logo-wrap">
                        <img
                            src="/images/logo-1.png"
                            alt=""
                            className="rt-logo lg"
                        />
                    </div>
                </NavLeft>
                <NavRight style={{ paddingRight: 24 }}>
                    <div className="flex jc-center mt-2 mb-a">
                        {/* <Button text="log" onClick={() => logout()} /> */}
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

            {/* {!recipeLoading &&
                allRecipes?.length > 0 &&
                allRecipes.map((recipe) => (
                    <RecipeCard
                        f7route={f7route}
                        f7router={f7router}
                        recipe={recipe}
                        key={crypto.randomUUID()}
                        isInPost={false}
                        canShowActionBtns
                        canShowHeader
                    />
                ))}
            {postLoading && !allPosts?.length > 0
                ? [1, 2, 3, 4, 5].map(() => (
                      <PostSkeleton key={crypto.randomUUID()} />
                  ))
                : allPosts.length > 0 &&
                  allPosts.map((post, index) => (
                      <PostCard
                          f7router={f7router}
                          key={crypto.randomUUID()}
                          post={post}
                      />
                  ))} */}
            {(postLoading || recipeLoading) &&
                !orderedData?.length > 0 &&
                [1, 2, 3, 4, 5].map(() => (
                    <PostSkeleton key={crypto.randomUUID()} />
                ))}
            {orderedData.length > 0 &&
                orderedData.map((item) => {
                    return isRecipe(item) ? (
                        <RecipeCard
                            user={currentUser}
                            f7route={f7route}
                            f7router={f7router}
                            recipe={item}
                            key={crypto.randomUUID()}
                            isInPost={false}
                            canShowActionBtns
                            canShowHeader
                        />
                    ) : (
                        <PostCard
                            user={currentUser}
                            f7router={f7router}
                            key={crypto.randomUUID()}
                            post={item}
                        />
                    );
                })}
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
