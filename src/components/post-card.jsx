import React from 'react';
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

const PostCard = ({ post }) => {
    return (
        <Card className="rt-card">
            <PostCardHeader recipeOrPost={post} />
            <div>
                <CardContent className="rt-card-content">
                    <Link
                        href={`/post/view/${post?.id}`}
                        className="rt-card-content-inner"
                    >
                        <Block className="text-md ">
                            <div className="mb-4">{post?.text || ''}</div>
                        </Block>

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
                {post.likes_count > 0 && (
                    <Block className="text-grey text-bold text-md">
                        {post.likes_count + ' Likes'}
                    </Block>
                )}
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
};

export default PostCard;
