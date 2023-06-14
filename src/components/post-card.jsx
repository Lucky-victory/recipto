import React, { useEffect, useState } from 'react';
import {
    Block,
    Button,
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    Icon,
    Link,
    List,
    Popover,
} from 'framework7-react';
import isEmpty from 'just-is-empty';
import PostCardHeader from './post-card-header';
import RecipeCard from './recipe-card';
import { utils } from '../js/helper';
import pick from 'just-pick';
import { useDispatch } from 'react-redux';
import { dislikePost, likePost, setOnePost } from '../js/state/slices/post';

const PostCard = ({ post, f7router, user = {} }) => {
    const popoverId = utils.genID('pop_', false);
    const [isLiked, setIsLiked] = useState(alreadyLike());
    const [likedCount, setLikeCount] = useState(post.liked_by?.length);
    const dispatch = useDispatch();
    const [canShowSeeMoreBtn, setCanShowSeeMoreBtn] = useState(
        post && post?.text?.length > 100
    );
    function navigateToView(evt) {
        if (evt.target.className.includes('see-more-btn')) return;
        dispatch(setOnePost(post));

        f7router.navigate(`/post/view/${post?.id}`);
    }
    function handleShare(post) {
        utils.handleShare({ path: `post/view/${post?.id}` }).then(() => {});
    }

    function handleSeeMore() {
        setCanShowSeeMoreBtn(false);
    }
    useEffect(() => {
        // setIsLiked(alreadyLike());
    }, [post]);
    function alreadyLike() {
        return post.liked_by.includes(user?.$id);
    }
    function likeOrDislike(post) {
        console.log({ user });
        if (alreadyLike()) {
            setIsLiked(false);
            setLikeCount(likedCount - 1 || 0);
            dispatch(
                dislikePost({
                    userId: user?.$id,
                    postId: post.id,
                    data: pick(post, ['id', 'liked_by']),
                })
            );
        } else {
            setIsLiked(true);
            setLikeCount(likedCount + 1);

            dispatch(
                likePost({
                    userId: user?.$id,
                    postId: post.id,
                    data: pick(post, ['id', 'liked_by']),
                })
            );
        }
    }
    return (
        <Card className="rt-card">
            <PostCardHeader
                popoverId={popoverId}
                user={user}
                recipeOrPost={post}
            />
            <div>
                <CardContent className="rt-card-content">
                    <Link
                        onClick={navigateToView}
                        // href={`/post/view/${post?.id}`}
                        className="rt-card-content-inner"
                    >
                        {post?.text && (
                            <Block className={`text-md `}>
                                <div
                                    className={`mb-2 rt-post-text ${
                                        !canShowSeeMoreBtn ? 'full' : ''
                                    }`}
                                >
                                    {post?.text || ' '}
                                </div>
                                {canShowSeeMoreBtn && (
                                    <span
                                        className="text-bold text-grey see-more-btn"
                                        onClick={handleSeeMore}
                                    >
                                        See more
                                    </span>
                                )}
                            </Block>
                        )}
                        {post.photo && (
                            <div className="rt-card-img-wrap">
                                <img
                                    src={post?.photo}
                                    alt=""
                                    loading="lazy"
                                    className="rt-card-img"
                                />
                            </div>
                        )}
                    </Link>
                </CardContent>
            </div>
            {post.has_recipe && (
                <RecipeCard
                    recipe={post?.recipe}
                    isInPost={!post?.photo}
                    canShowHeader={false}
                />
            )}

            <Block className="mt-4 mb-4">
                <Block className="mt-4 mb-4">
                    {likedCount > 0 && (
                        <Block className="text-grey text-bold text-md">
                            {likedCount + ' Likes'}
                        </Block>
                    )}
                </Block>
            </Block>

            <CardFooter className="rt-card-footer">
                <div className="rt-card-footer-inner">
                    <Button
                        round
                        type="button"
                        onClick={() => likeOrDislike(post)}
                    >
                        <Icon
                            className={`material-symbols-rounded ${
                                isLiked ? 'material-fill' : ''
                            }`}
                            material="thumb_up"
                        />
                    </Button>
                    {/* <Button round>
                        <Icon
                            className="material-symbols-rounded"
                            material="chat"
                        />
                    </Button> */}
                    <Button
                        type="button"
                        round
                        onClick={() => handleShare(post)}
                    >
                        <Icon
                            className="material-symbols-rounded"
                            md="material:share"
                            ios="material:ios_share"
                        />
                    </Button>
                </div>
            </CardFooter>
            <Popover id={popoverId}>
                <List>
                    {utils.isSame(post?.user?.$id, user?.$id) && (
                        <Button
                            text="Edit"
                            href={`/post/edit/${post?.id}`}
                            routeProps={{ mode: 'edit', postToEdit: post }}
                        >
                            <Icon
                                material="edit"
                                className="material-symbols-rounded"
                            />
                        </Button>
                    )}
                    <Button type="button" text="Report">
                        <Icon
                            material="flag"
                            className="material-symbols-rounded"
                        />
                    </Button>
                </List>
            </Popover>
        </Card>
    );
};

export default PostCard;
