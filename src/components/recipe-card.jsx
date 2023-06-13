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
import React from 'react';
import PostCardHeader from './post-card-header';
import { useDispatch } from 'react-redux';
import { setOneRecipe } from '../js/state/slices/recipe';

const RecipeCard = ({
    recipe,
    isInPost = true,
    canShowActionBtns = false,
    canShowHeader = false,
    f7route,f7router
}) => {
    const dispatch = useDispatch();
    function navigateToView() {
        dispatch(setOneRecipe(recipe));
        console.log({ f7route,f7router });
        f7router.navigate(`/recipe/view/${recipe?.id}`);
    }
    return !isInPost ? (
        <Card className="rt-recipe-card">
            {canShowHeader && <PostCardHeader recipeOrPost={recipe} />}

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
                                <span className="text-bold">
                                    {recipe?.title}
                                </span>
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
                        {recipe.likes_count > 0 && (
                            <Block className="text-grey text-bold text-md">
                                {recipe.likes_count + ' Likes'}
                            </Block>
                        )}
                    </Block>

                    <CardFooter className="rt-recipe-card-footer">
                        <div className="rt-recipe-card-footer-inner">
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
                        </div>
                    </CardFooter>
                </div>
            )}
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
