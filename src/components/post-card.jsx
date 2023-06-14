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
} from 'framework7-react';
import isEmpty from 'just-is-empty';
import PostCardHeader from './post-card-header';
import RecipeCard from './recipe-card';
import { utils } from '../js/helper';

import { useDispatch } from 'react-redux';
import { setOnePost } from '../js/state/slices/post';

const PostCard = ({ post, f7router }) => {
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
    return (
        <Card className="rt-card">
            <PostCardHeader recipeOrPost={post} />
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
                {post?.likes_count > 0 && (
                    <Block className="text-grey text-bold text-md">
                        {post.likes_count + ' Likes'}
                    </Block>
                )}
            </Block>

            <CardFooter className="rt-card-footer">
                <div className="rt-card-footer-inner">
                    <Button round type="button">
                        <Icon
                            className="material-symbols-rounded"
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
        </Card>
    );
};

export default PostCard;
