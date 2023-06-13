import {
    Block,
    Button,
    Icon,
    List,
    ListItem,
    NavTitle,
    NavTitleLarge,
    Navbar,
    Page,
    PageContent,
    Segmented,
    SkeletonImage,
    Tab,
    Tabs,
} from 'framework7-react';
import React, { useState } from 'react';
import { isMobile, utils } from '../../js/helper';
import '../../css/recipe-view.scss';
import isEmpty from 'just-is-empty';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOneRecipe } from '../../js/state/slices/recipe';

const RecipeViewPage = ({ f7router }) => {
    const dispatch = useDispatch();
    const { data: recipe, loading: recipeLoading } = useSelector(
        (state) => state.recipes.one
    );

    function onPageBeforeIn() {
        if (isEmpty(recipe)) {
            const recipeId = f7router.currentRoute.params?.id;

            dispatch(fetchOneRecipe(recipeId));
        }
    }
    return (
        <Page
            name="recipe-view"
            className="custom-bg"
            onPageBeforeIn={onPageBeforeIn}
        >
            <Navbar backLink sliding={false}>
                <NavTitle sliding subtitle={'by ' + recipe?.user?.name}>
                    {recipe?.title}
                </NavTitle>
                <NavTitleLarge>
                    <div className="">{recipe?.title}</div>
                    <span className="text-sm text-color-grey">
                        by {recipe?.user?.name}
                    </span>
                </NavTitleLarge>
            </Navbar>
            <Block className="rt-recipe-view-img-wrap">
                {recipe?.photo && !recipeLoading ? (
                    <img src={recipe?.photo} />
                ) : (
                    <SkeletonImage className="rt-recipe-view-img-wrap" />
                )}
            </Block>

            <Block strong className="flex flex-wrap gap-4">
                {recipe.prep_time && (
                    <div className="text-md flex gap-2">
                        <span className="text-bold text-grey flex gap-1 ai-center">
                            <Icon
                                className="text-color-grey material-symbols-rounded"
                                material="pace"
                            />
                            <span className="text-bold">Prep:</span>{' '}
                        </span>
                        <span className="text-bold">
                            {utils.convertTime(recipe.prep_time)} mins
                        </span>
                    </div>
                )}
                {recipe.cook_time && (
                    <div className="text-md flex gap-2">
                        <span className="text-bold text-grey flex gap-1 ai-center">
                            <Icon
                                className="text-color-grey material-symbols-rounded"
                                material="cooking"
                            />
                            <span className="text-bold">Cook:</span>{' '}
                        </span>
                        <span className="text-bold">
                            {utils.convertTime(recipe.cook_time)} mins
                        </span>
                    </div>
                )}
                {recipe.servings > 0 && (
                    <div className="text-md flex gap-2">
                        <span className="text-bold text-grey flex gap-1 ai-center">
                            <Icon
                                className="text-color-grey material-symbols-rounded"
                                material="people"
                            />
                            <span className="text-bold">Servings:</span>{' '}
                        </span>
                        <span className="text-bold">{recipe.servings}</span>
                    </div>
                )}
            </Block>
            <Segmented
                className="rt-segmented rt-segmented-tab"
                strong
                style={{ position: 'sticky', top: 0 }}
            >
                <Button text="Ingredients" tabLink="#ing-tab" tabLinkActive />
                <Button text="Instructions" tabLink="#ins-tab" />
            </Segmented>
            <Tabs animated>
                <Tab tabActive id={'ing-tab'}>
                    <PageContent className="p-0 pt-2 rt-tab-content">
                        {recipe.ingredients?.map((item) => (
                            <List mediaList key={crypto.randomUUID()}>
                                {item.content?.map((cont) => (
                                    <ListItem
                                        key={crypto.randomUUID()}
                                        media={cont?.media ? cont.media : null}
                                        text={cont.text}
                                    >
                                        {!cont.media && (
                                            <Icon
                                                slot="media"
                                                className="material-symbols-rounded"
                                                material="shopping_basket"
                                            />
                                        )}
                                    </ListItem>
                                ))}
                            </List>
                        ))}
                    </PageContent>
                </Tab>
                <Tab id={'ins-tab'}>
                    <PageContent>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Non modi voluptatibus doloribus ea! Tempore ab,
                        inventore soluta dolore adipisci odit voluptatum,
                        numquam sapiente officiis doloremque minus, doloribus
                        quisquam debitis deleniti.
                    </PageContent>
                </Tab>
            </Tabs>
        </Page>
    );
};

export default RecipeViewPage;
