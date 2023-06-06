import {
    Block,
    Button,
    Icon,
    Link,
    List,
    ListGroup,
    ListInput,
    ListItem,
    NavRight,
    Navbar,
    Page,
    SwipeoutActions,
    SwipeoutButton,
    f7,
    theme,
} from 'framework7-react';
import { Dom7, getDevice } from 'framework7';
import React, { useEffect, useState } from 'react';
import isEmpty from 'just-is-empty';
import { isMobile } from '@/js/helper';
import PageExitPopup from '../../components/page-exit-popup';

const $$ = Dom7;
const RecipeAddPage = ({ f7router }) => {
    const [ingredients, setIngredients] = useState([
        { header: '', content: [{ media: '', text: '' }] },
    ]);
    const [currentIngredIndex, setCurrentIngredIndex] = useState(0);
    const [editIndex, setEditIndex] = useState(null);

    function addHeader() {
        const newIngredients = [
            ...ingredients,
            { header: '', content: [{ media: '', text: '' }] },
        ];
        setIngredients(newIngredients);

        setCurrentIngredIndex(newIngredients.length - 1 || 0);
    }

    function handleHeaderChange(index, value) {
        const newIngredients = [...ingredients];
        newIngredients[index].header = value;

        setIngredients(newIngredients);
    }

    function handleIngredientTextContentChange(index, contentIndex, value) {
        const newIngredients = [...ingredients];
        newIngredients[index].content[contentIndex].text = value;

        setIngredients(newIngredients);
    }
    function addIngredientTextContent(index, text) {
        const newIngredients = [...ingredients];
        newIngredients[index].content.push({ media: '', text });
        setCurrentIngredIndex(newIngredients.length - 1 || 0);
        setIngredients(newIngredients);
    }
    function handleContentClick(index, contentIndex) {
        setEditIndex({ index, contentIndex });
    }

    /**
     *
     * @param {KeyboardEvent} evt
     */
    function handleIngredientsAdd(evt) {
        console.log({ evt });
        console.log(evt.target);
        if (evt.key === 'Enter' && !evt.shiftKey) {
            const { value } = evt.target;
            const { index } = evt.target.dataset;

            console.log({ value, index });
            addIngredientTextContent(index, value);
            evt.target.value = '';
        }
    }

    useEffect(() => {
        const ingredientInput = $$('.rt-ingredient-input');
        ingredientInput.on('keydown', handleIngredientsAdd);

        return () => ingredientInput.off('keydown', handleIngredientsAdd);
    }, []);
    useEffect(() => {}, [ingredients]);
    const handlePopupClose = (canExit) => {
        if (canExit) {
            handleBackClick();
            f7.popup.close('#page-exit-popup');
            f7.popup.close();
        } else {
            f7.popup.close('#page-exit-popup');
        }
    };
    function handlePopupOpen() {
        f7.popup.open('#page-exit-popup');
    }
    function handleBackClick() {
        f7router.back();
    }
    return (
        <Page name="recipe-add">
            <Navbar
                outline
                onBackClick={handleBackClick}
                backLink={isMobile}
                title="Add Recipe"
            >
                <NavRight style={{ paddingRight: '1rem' }}>
                    {isMobile && (
                        <Button fill round style={{ minWidth: '5rem' }}>
                            Save
                        </Button>
                    )}
                    {!isMobile && (
                        <Button large text="Close" onClick={handlePopupOpen} />
                    )}
                </NavRight>
            </Navbar>

            <List className="rt-list">
                <ListItem
                    groupTitle
                    title={'Title'}
                    className="rt-list-title"
                />
                <ListInput
                    className="rt-list-input"
                    name="title"
                    placeholder="Give your recipe a name"
                    outline
                />

                <ListItem
                    className="rt-list-title"
                    groupTitle
                    title={'Description'}
                />
                <ListInput
                    className="rt-list-input"
                    name="description"
                    type="textarea"
                    outline
                    placeholder="Introduce your recipe, add notes, cooking tips..."
                />

                <ListItem
                    className="rt-list-title"
                    groupTitle
                    title={'Ingredients'}
                />
                {ingredients.length > 0 &&
                    ingredients.map((ingredient, index) => {
                        return (
                            <List mediaList className="mt-2 mb-2" key={index}>
                                {
                                    <ListInput
                                        value={ingredient.header}
                                        onChange={(e) =>
                                            handleHeaderChange(
                                                index,
                                                e.target.value
                                            )
                                        }
                                        title={ingredient.header}
                                        clearButton
                                    />
                                }
                                {ingredient.content.map(
                                    (content, contentIndex) => {
                                        return !isEmpty(content.text) &&
                                            editIndex &&
                                            editIndex.index === index &&
                                            editIndex.contentIndex ===
                                                contentIndex ? (
                                            <ListInput
                                                value={content.text}
                                                onChange={
                                                    handleIngredientTextContentChange
                                                }
                                            />
                                        ) : (
                                            <ListItem
                                                onClick={() =>
                                                    handleContentClick(
                                                        index,
                                                        contentIndex
                                                    )
                                                }
                                                key={contentIndex}
                                                media={
                                                    content?.media
                                                        ? content?.media
                                                        : null
                                                }
                                                noChevron
                                                link
                                                swipeout
                                                title={content?.text}
                                            >
                                                <SwipeoutActions right>
                                                    <SwipeoutButton delete>
                                                        Delete
                                                    </SwipeoutButton>
                                                </SwipeoutActions>
                                                {!content?.media && (
                                                    <Icon
                                                        slot="media"
                                                        className="material-symbols-rounded material-fill"
                                                        material="shopping_basket"
                                                    />
                                                )}
                                            </ListItem>
                                        );
                                    }
                                )}
                            </List>
                        );
                    })}
                <ListGroup>
                    <ListInput
                        className="rt-list-input rt-ingredient-input"
                        clearButton
                        outline
                        placeholder="Add or paste ingredients"
                        data-index={currentIngredIndex}
                    />
                    <Block className="mt-2 mb-0">
                        <Link className="ov-hidden" onClick={addHeader}>
                            <Icon
                                className="material-symbols-rounded"
                                material="add"
                            />
                            Add Header
                        </Link>
                    </Block>
                </ListGroup>

                <List mediaList className="mt-2 mb-2">
                    <ListItem
                        className="rt-list-title"
                        groupTitle
                        title={'Instructions'}
                    />
                    {ingredients.length > 0 &&
                        ingredients.map((ingredient, index) => {
                            return (
                                <ListItem
                                    key={index}
                                    noChevron
                                    link
                                    swipeout
                                    title={ingredient?.text}
                                >
                                    <SwipeoutActions right>
                                        <SwipeoutButton delete>
                                            Delete
                                        </SwipeoutButton>
                                    </SwipeoutActions>
                                    {!ingredient?.media && (
                                        <Icon
                                            slot="media"
                                            className="material-symbols-rounded material-fill"
                                            material="restaurant"
                                        />
                                    )}
                                </ListItem>
                            );
                        })}
                </List>
                <ListGroup>
                    <ListInput
                        className="rt-list-input"
                        clearButton
                        outline
                        placeholder="Add or paste instructions"
                    />
                    <Block className="mt-2 mb-0">
                        <Link className="ov-hidden">
                            <Icon
                                className="material-symbols-rounded"
                                material="add"
                            />
                            Add Header
                        </Link>
                    </Block>
                </ListGroup>

                {!isMobile && (
                    <Block>
                        <Button fill style={{ width: '7rem', fontSize: 18 }}>
                            Save
                        </Button>
                    </Block>
                )}
            </List>
            <PageExitPopup
                onCancel={() => handlePopupClose()}
                onExit={handlePopupClose}
            />
        </Page>
    );
};

export default RecipeAddPage;
