import {
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
} from 'framework7-react';
import { Dom7 } from 'framework7';
import React, { useCallback, useEffect, useState } from 'react';
import { isMobile } from '@/js/helper';
import PageExitPopup from '../../components/page-exit-popup';
import TimeSheet from '../../components/time-sheet';
import PrepTimeSheet from '../../components/prep-time-sheet';
import { utils } from '../../js/helper';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser } from '../../js/state/slices/user';
import pick from 'just-pick';
import ServingSheet from '../../components/serving-sheet';

const $$ = Dom7;
const RecipeAddPage = ({ f7router }) => {
    const dispatch = useDispatch();
    const { data: currentUser } = useSelector((state) => state.user);
    const fetchUserCb = useCallback(() => {
        fetchUser();
    }, []);
    const [isSaving, setIsSaving] = useState(false);
    const recipeId = utils.genID(undefined, false);
    const [prepTimeValue, setPrepTimeValue] = useState({
        hours: 0,
        minutes: 0,
    });
    const [cookTimeValue, setCookTimeValue] = useState({
        hours: 0,
        minutes: 0,
    });
    const [servingsValue, setServingsValue] = useState(0);
    const [ingredients, setIngredients] = useState([
        { header: '', content: [] },
    ]);
    const [instructions, setInstructions] = useState([
        { header: '', content: [] },
    ]);
    const initialRecipe = {
        title: '',
        description: '',
        ingredients,
        user: {},
        photo: '',
        instructions,
        cookTime: cookTimeValue,
        prepTime: prepTimeValue,
        servings: servingsValue,
    };
    const [recipeToSave, setRecipeToSave] = useState(initialRecipe);
    const [currentIngredIndex, setCurrentIngredIndex] = useState(0);
    const [editIndex, setEditIndex] = useState(null);

    const [convertedPrepTime, setConvertedPrepTime] = useState(0);
    const [convertedCookTime, setConvertedCookTime] = useState(0);
    function addHeader() {
        const newIngredients = [...ingredients, { header: '', content: [] }];
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
    function handleIngredientTextContentBlur(index, contentIndex, value) {
        const newIngredients = [...ingredients];
        const ingredient = newIngredients[index];

        if (value.trim() === '') {
            const filteredContent = ingredient.content.filter(
                (_, i) => i !== contentIndex
            );
            const updatedIngredient = {
                ...ingredient,
                content: filteredContent,
            };
            newIngredients[index] = updatedIngredient;

            setIngredients(newIngredients);
        }

        setEditIndex(null);
    }
    function handleTitleDescChange(evt) {
        const { name, value } = evt.target;
        setRecipeToSave((prev) => ({ ...prev, [name]: value }));
    }
    function saveRecipe() {
        const _recipeToSave = {
            ...recipeToSave,
            id: recipeId,
            created_at: utils.currentDate.toISOString(),
            updated_at: utils.currentDate.toISOString(),
            user: pick(currentUser, ['prefs', 'name', '$id']),
        };
        const recip = utils.serialize(_recipeToSave, [
            'instructions',
            'ingredients',
            'user',
            'cookTime',
            'prepTime',
        ]);
        console.log({ recip });
    }
    function handleContentClick(index, contentIndex) {
        setEditIndex({ index, contentIndex });
    }

    /**
     *
     * @param {KeyboardEvent} evt
     */
    function handleIngredientsAdd(evt) {
        if (evt.key === 'Enter' && !evt.shiftKey) {
            const { value } = evt.target;

            addIngredientTextContent(value);
            evt.target.value = '';
        }
    }
    function addIngredientTextContent(text) {
        console.log('in add', { ingredients });
        // const ing = ingredients[currentIngredIndex];
        // ing.content = [...ing.content, { media: '', text }];
        // const newIngredients = [...ingredients];
        // console.log({ ing });
        // newIngredients[currentIngredIndex] = ing;
        // console.log({ newIngredients });
        const newIngredients = [...ingredients].map((ing, i) => {
            console.log({ currentIngredIndex });
            if (i === currentIngredIndex) {
                console.log('in add map', { ing });
                const updatedContent = [...ing.content, { media: '', text }];

                const s = {
                    ...ing,
                    content: updatedContent,
                };
                console.log({ s });
                return s;
            }
            return ing;
        });
        // setCurrentIngredIndex(newIngredients.length - 1 || 0);
        setIngredients(newIngredients);
    }
    function handleSwipeOutDelete(index, contentIndex) {
        console.log('swipeout');
        const newIngredients = [...ingredients];
        const ingredient = newIngredients[index];

        const filteredContent = ingredient.content.filter(
            (_, i) => i !== contentIndex
        );
        const updatedIngredient = { ...ingredient, content: filteredContent };
        newIngredients[index] = updatedIngredient;
        setIngredients(newIngredients);
        setEditIndex(null);
    }
    function handleInstructionsAdd() {}
    useEffect(() => {
        fetchUserCb();
        console.log({ currentUser });
    }, [dispatch]);
    useEffect(() => {
        const ingredientInput = $$('.rt-ingredient-input');
        ingredientInput.on('keydown', handleIngredientsAdd);
        const instructionsInput = $$('.rt-instructions-input');
        instructionsInput.on('keydown', handleInstructionsAdd);

        return () => {
            ingredientInput.off('keydown', handleIngredientsAdd);

            instructionsInput.off('keydown', handleInstructionsAdd);
        };
    }, []);
    useEffect(() => {
        setRecipeToSave((prev) => ({ ...prev, ingredients }));
    }, [ingredients]);
    useEffect(() => {
        setRecipeToSave((prev) => ({ ...prev, instructions }));
    }, [instructions]);

    useEffect(() => {
        setRecipeToSave((prev) => ({ ...prev, cookTime: cookTimeValue }));
        setRecipeToSave((prev) => ({ ...prev, prepTime: prepTimeValue }));
        setRecipeToSave((prev) => ({ ...prev, servings: servingsValue }));
        console.log({ recipeToSave });
    }, [prepTimeValue, cookTimeValue, servingsValue]);
    function handlePopupClose(canExit) {
        if (canExit) {
            handleBackClick();
            f7.popup.close('#page-exit-popup');
            f7.popup.close();
        } else {
            f7.popup.close('#page-exit-popup');
        }
    }
    function handlePopupOpen() {
        f7.popup.open('#page-exit-popup');
    }
    function handleBackClick() {
        f7router.back();
    }

    function handleCookTimeSheetClose(time) {
        setConvertedCookTime(+time?.hours * 60 + +time.minutes);
        setCookTimeValue(time);
    }
    function handleServingsSheetClose(serving) {
        setServingsValue(serving);
    }
    function handlePrepTimeSheetClose(time) {
        setConvertedPrepTime(+time?.hours * 60 + +time.minutes);
        setPrepTimeValue(time);
    }
    return (
        <Page name="recipe-add" className="custom-bg">
            <Navbar
                outline
                onBackClick={handleBackClick}
                backLink={isMobile}
                title="Add Recipe"
            >
                <NavRight style={{ paddingRight: '1.25rem' }}>
                    {!isMobile && (
                        <Button
                            large
                            text="Close"
                            onClick={handlePopupOpen}
                            style={{ marginRight: '1.5rem' }}
                        />
                    )}
                    {
                        <Button
                            onClick={() => saveRecipe()}
                            fill
                            round
                            style={{ minWidth: '5rem' }}
                        >
                            Save
                        </Button>
                    }
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
                    onChange={handleTitleDescChange}
                    value={recipeToSave.title}
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
                    onChange={handleTitleDescChange}
                    value={recipeToSave.description}
                    outline
                    placeholder="Introduce your recipe, add notes, cooking tips..."
                />

                <ListItem
                    className="rt-list-title"
                    mediaItem
                    subtitle={
                        isMobile
                            ? 'Tap to edit, swipe to delete.'
                            : 'Click to edit'
                    }
                    title={'Ingredients'}
                />
                {ingredients.length > 0 &&
                    ingredients.map((ingredient, index) => {
                        return (
                            <List mediaList className="mt-2 mb-2" key={index}>
                                {/* {!isEmpty(ingredient.header) && (
                                    <ListItem
                                        groupTitle
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
                                )} */}
                                {ingredient.content.map(
                                    (content, contentIndex) => {
                                        return editIndex &&
                                            editIndex.index === index &&
                                            editIndex.contentIndex ===
                                                contentIndex ? (
                                            <ListInput
                                                outline
                                                autofocus={
                                                    editIndex.contentIndex ===
                                                    contentIndex
                                                }
                                                clearButton
                                                onBlur={(e) =>
                                                    handleIngredientTextContentBlur(
                                                        index,
                                                        contentIndex,
                                                        e.target.value
                                                    )
                                                }
                                                key={crypto.randomUUID()}
                                                value={content.text}
                                                onChange={(e) =>
                                                    handleIngredientTextContentChange(
                                                        index,
                                                        contentIndex,
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        ) : (
                                            <ListItem
                                                className="rt-ing-item"
                                                key={crypto.randomUUID()}
                                                onSwipeoutDeleted={() =>
                                                    handleSwipeOutDelete(
                                                        index,
                                                        contentIndex
                                                    )
                                                }
                                                onClick={() =>
                                                    handleContentClick(
                                                        index,
                                                        contentIndex
                                                    )
                                                }
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
                                                {isMobile ? (
                                                    <SwipeoutActions right>
                                                        <SwipeoutButton delete>
                                                            Delete
                                                        </SwipeoutButton>
                                                    </SwipeoutActions>
                                                ) : (
                                                    <Button
                                                        className="rt-ing-delete-btn"
                                                        type="button"
                                                        onClick={() =>
                                                            handleSwipeOutDelete(
                                                                index,
                                                                contentIndex
                                                            )
                                                        }
                                                        iconOnly
                                                        slot="after"
                                                        style={{
                                                            height: 20,
                                                        }}
                                                    >
                                                        <Icon
                                                            className="material-symbols-rounded"
                                                            material="close"
                                                            tooltip="delete"
                                                        />
                                                    </Button>
                                                )}
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
                    />
                    {/* <Block className="mt-2 mb-0">
                        <Link className="ov-hidden" onClick={addHeader}>
                            <Icon
                                className="material-symbols-rounded"
                                material="add"
                            />
                            Add Header
                        </Link>
                    </Block> */}
                </ListGroup>

                <List mediaList className="mt-2 mb-2">
                    <ListItem
                        className="rt-list-title"
                        groupTitle
                        title={'Instructions'}
                    />

                    {ingredients.map((ingredient, index) => {
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
                        className="rt-list-input rt-instructions-input"
                        clearButton
                        outline
                        placeholder="Add or paste instructions"
                    />
                    {/* <Block className="mt-2 mb-0">
                        <Link className="ov-hidden">
                            <Icon
                                className="material-symbols-rounded"
                                material="add"
                            />
                            Add Header
                        </Link>
                    </Block> */}
                </ListGroup>
                <List mediaList noChevron>
                    <ListItem
                        title={'Servings'}
                        // subtitle={
                        //     'How long does it take to prepare this recipe?'
                        // }
                    >
                        <Link
                            slot="after"
                            {...(!isMobile
                                ? { popoverOpen: '.servings-sheet' }
                                : { sheetOpen: '.servings-sheet' })}
                            text={`${
                                servingsValue > 0
                                    ? servingsValue + ' servings'
                                    : 'Set servings'
                            }`}
                        />
                    </ListItem>
                    <ListItem
                        title={'Prep Time'}
                        subtitle={
                            'How long does it take to prepare this recipe?'
                        }
                    >
                        <Link
                            slot="after"
                            {...(!isMobile
                                ? { popoverOpen: '.prep-time' }
                                : { sheetOpen: '.prep-time' })}
                            text={`${
                                convertedPrepTime > 0
                                    ? convertedPrepTime + ' mins'
                                    : 'Set time'
                            }`}
                        />
                    </ListItem>
                    <ListItem
                        title={'Cook Time'}
                        subtitle={'How long does it take to cook this recipe?'}
                    >
                        <Link
                            slot="after"
                            {...(!isMobile
                                ? { popoverOpen: '.cook-time' }
                                : { sheetOpen: '.cook-time' })}
                            text={`${
                                convertedCookTime > 0
                                    ? convertedCookTime + ' mins'
                                    : 'Set Time'
                            }`}
                        />
                    </ListItem>
                </List>
            </List>
            <ServingSheet
                initialValue={servingsValue}
                onClose={handleServingsSheetClose}
            />
            <PrepTimeSheet
                onClose={handlePrepTimeSheetClose}
                className="prep-time"
                initialValue={prepTimeValue}
            />
            <TimeSheet
                title="Cook Time"
                subtitle="How long does it take to cook this recipe?"
                initialValue={cookTimeValue}
                onClose={(time) => handleCookTimeSheetClose(time)}
                className={`cook-time`}
            />
            {/* <TimeSheet getTime={getTime} onClose={handleTimeSheetClose} className='cook-time' /> */}
            <PageExitPopup
                onCancel={() => handlePopupClose()}
                onExit={handlePopupClose}
            />
        </Page>
    );
};

export default RecipeAddPage;
