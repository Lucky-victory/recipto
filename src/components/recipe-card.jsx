import {
    Block,
    Button,
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    Popover,
    List,
    Icon,
    Link,
} from 'framework7-react';
import isEmpty from 'just-is-empty';
import React, { useEffect, useState } from 'react';
import PostCardHeader from './post-card-header';
import { useDispatch } from 'react-redux';
import {
    dislikeRecipe,
    likeRecipe,
    setOneRecipe,
} from '../js/state/slices/recipe';
import { utils } from '../js/helper';
import pick from 'just-pick';
const RecipeCard = ({
    recipe,
    isInPost = true,
    canShowActionBtns = false,
    canShowHeader = false,
    f7route,
    f7router,
    user = {},
}) => {
    const popoverId = utils.genID('pop_', false);
    const dispatch = useDispatch();
    function navigateToView() {
        dispatch(setOneRecipe(recipe));

        f7router.navigate(`/recipe/view/${recipe?.id}`);
    }
    const [isLiked, setIsLiked] = useState(alreadyLike());
    const [likedCount, setLikeCount] = useState(recipe.liked_by?.length);

    function handleShare(recipe) {
        utils
            .handleShare({
                title: recipe?.title,
                path: `recipe/view/${recipe?.id}`,
            })
            .then(() => {});
    }
    useEffect(() => {
        // setIsLiked(alreadyLike());
    }, [recipe]);
    function alreadyLike() {
        return recipe.liked_by.includes(user?.$id);
    }
    function likeOrDislike(recipe) {
        console.log({ user });
        if (alreadyLike()) {
            setIsLiked(false);
            setLikeCount(likedCount - 1 || 0);
            dispatch(
                dislikeRecipe({
                    userId: user?.$id,
                    recipeId: recipe.id,
                    data: pick(recipe, ['id', 'liked_by']),
                })
            );
        } else {
            setIsLiked(true);
            setLikeCount(likedCount + 1);

            dispatch(
                likeRecipe({
                    userId: user?.$id,
                    recipeId: recipe.id,
                    data: pick(recipe, ['id', 'liked_by']),
                })
            );
        }
    }

    return !isInPost ? (
        <Card className="rt-recipe-card">
            {canShowHeader && (
                <PostCardHeader
                    popoverId={popoverId}
                    user={user}
                    recipeOrPost={recipe}
                />
            )}

            {
                <CardContent
                    className={`rt-recipe-card-content ${
                        !isInPost && !canShowHeader ? 'p-0' : ''
                    }`}
                >
                    <Link
                        onClick={() => navigateToView()}
                        // routeProps={{ recipe }}
                        // href={`/recipe/view/${recipe?.id}`}
                        className="rt-recipe-card-content-inner"
                    >
                        {recipe.photo && (
                            <div className="rt-recipe-card-img-wrap">
                                <div className="rt-img-placeholder">
                                    <span>{recipe?.title}</span>
                                </div>

                                <img
                                    src={recipe?.photo}
                                    alt=""
                                    loading="lazy"
                                    className="rt-recipe-card-img"
                                />
                            </div>
                        )}

                        <div className="rt-recipe-card-content-footer">
                            <div className="rt-recipe-card-content-title">
                                <span className="text-bol">
                                    {recipe?.title}
                                </span>
                            </div>
                            <div className="mt-4 flex ai-center gap-2">
                                <div className="text-sm flex ai-center">
                                    <Icon
                                        size={18}
                                        material="people"
                                        className="text-color-primary  material-symbols-rounded"
                                    />

                                    <span className="text-grey ">
                                        {recipe?.servings}
                                    </span>
                                </div>
                                <div className="text-sm flex ai-center">
                                    <Icon
                                        size={18}
                                        material="pace"
                                        className=" text-color-primary material-symbols-rounded"
                                    />

                                    <span className="text-grey ">
                                        {utils.convertTime(recipe?.prep_time)}
                                    </span>
                                </div>
                                <div className="text-sm flex ai-center">
                                    <Icon
                                        size={18}
                                        material="cooking"
                                        className=" text-color-primary material-symbols-rounded"
                                    />

                                    <span className="text-grey ">
                                        {utils.convertTime(recipe?.cook_time)}
                                    </span>
                                </div>
                            </div>
                            {/* <Button
                                style={{ maxWidth: '3rem' }}
                                type="button"
                                round
                                iconOnly
                            >
                                <Icon
                                    material="bookmark"
                                    className="material-symbols-rounded"
                                />
                            </Button> */}
                        </div>
                    </Link>
                </CardContent>
            }
            {canShowActionBtns && (
                <div>
                    <Block className="mt-4 mb-4">
                        {likedCount > 0 && (
                            <Block className="text-grey text-bold text-md">
                                {likedCount + ' Likes'}
                            </Block>
                        )}
                    </Block>

                    <CardFooter className="rt-recipe-card-footer">
                        <div className="rt-recipe-card-footer-inner">
                            <Button
                                round
                                type="button"
                                onClick={() => likeOrDislike(recipe)}
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
                                onClick={() => handleShare(recipe)}
                            >
                                <Icon
                                    className="material-symbols-rounded"
                                    md="material:share"
                                    ios="material:ios_share"
                                />
                            </Button>
                        </div>
                    </CardFooter>
                </div>
            )}
            <Popover id={popoverId}>
                <List>
                    {utils.isSame(recipe?.user?.$id, user?.$id) && (
                        <Button
                            text="Edit"
                            href={`/recipe/edit/${recipe?.id}`}
                            routeProps={{ mode: 'edit', recipeToEdit: recipe }}
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
    ) : (
        <Card className="rt-recipe-mini-card">
            <Link
                routeProps={{ recipe }}
                className="rt-recipe-mini-card-link"
                href={`/recipe/view/${recipe?.id}`}
            >
                {recipe.photo && (
                    <img
                        src={recipe?.photo}
                        alt=""
                        loading="lazy"
                        className="rt-recipe-mini-card-img"
                    />
                )}
                <div className="rt-recipe-mini-card-content ">
                    <div className="rt-recipe-mini-card-title">
                        {recipe?.title}
                    </div>

                    {/* <Button
                        style={{ maxWidth: '3rem' }}
                        type="button"
                        round
                        iconOnly
                    >
                        <Icon
                            material="bookmark"
                            className="material-symbols-rounded"
                        />
                    </Button> */}
                </div>
            </Link>
        </Card>
    );
};

export default RecipeCard;
