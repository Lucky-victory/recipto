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
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { isMobile } from '@/js/helper';
import PageExitPopup from '../../components/page-exit-popup';
import TimeSheet from '../../components/time-sheet';
import PrepTimeSheet from '../../components/prep-time-sheet';
import { appwriteHandler, envConfig, utils } from '../../js/helper';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser } from '../../js/state/slices/user';
import pick from 'just-pick';
import ServingSheet from '../../components/serving-sheet';
import {
    addIngredientContent,
    updateIngredients,
    updateIngredientContent,
    resetIngredients,
    getIngredients,
} from '../../js/state/slices/ingredient';
import {
    addInstructionContent,
    getInstructions,
    resetInstructions,
    updateInstructionContent,
    updateInstructionContentFull,
    updateInstructions,
} from '../../js/state/slices/instructions';
import isEmpty from 'just-is-empty';
import PhotoPreviewer from '../../components/photo-previewer';
import { Clipboard } from '@capacitor/clipboard';

const $$ = Dom7;
const RecipeAddPage = ({ f7router, mode = 'create', recipeToEdit = {} }) => {
    const input1Ref = useRef(null);
    const input2Ref = useRef(null);
    console.log({ input1Ref, input2Ref });
    const dispatch = useDispatch();
    const { data: currentUser } = useSelector((state) => state.user);

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
    const { data: instructionsInState } = useSelector(
        (state) => state.instructions
    );
    const { data: ingredientsInState } = useSelector(
        (state) => state.ingredients
    );
    const fetchUserCb = useCallback(() => {
        dispatch(fetchUser());
    }, [currentUser]);
    // const fetchIngredientsCb = useCallback(() => {
    // }, []);
    // const fetchInstructionsCb = useCallback(() => {

    // }, []);

    // console.log({ ingredientsInState, instructionsInState });

    const initialRecipe =
        mode === 'edit'
            ? recipeToEdit
            : {
                  title: '',
                  description: '',
                  ingredients: ingredientsInState,
                  user: {},
                  photo: '',
                  instructions: instructionsInState,
                  cook_time: { hours: 0, minutes: 0 },
                  prep_time: { hours: 0, minutes: 0 },
                  servings: +servingsValue,
              };
    console.log({ initialRecipe });
    const [recipeToSave, setRecipeToSave] = useState(initialRecipe);
    console.log('near initial', { recipeToSave });
    const [isTitleEmpty, setIsTitleEmpty] = useState(
        isEmpty(recipeToSave.title)
    );
    const [currentIngredIndex, setCurrentIngredIndex] = useState(0);
    const [currentInstructionIndex, setCurrentInstructionIndex] = useState(0);
    const [ingredientEditIndex, setIngredientEditIndex] = useState(null);
    const [instructionEditIndex, setInstructionEditIndex] = useState(null);

    const [convertedPrepTime, setConvertedPrepTime] = useState(0);
    const [convertedCookTime, setConvertedCookTime] = useState(0);

    /* Ingredients inputs script start */

    function addIngredientHeader() {
        const newIngredients = [
            ...ingredientsInState,
            { header: '', content: [] },
        ];

        dispatch(updateIngredients(newIngredients));
        setCurrentIngredIndex(newIngredients.length - 1 || 0);
    }
    function addInstructionHeader() {
        const newInstructions = [
            ...instructionsInState,
            { header: '', content: [] },
        ];

        dispatch(updateInstructions(newInstructions));
        setCurrentInstructionIndex(newInstructions.length - 1 || 0);
    }
    function addInstructionDesc(index, contentIndex, value) {
        const newInstructions = [
            ...instructionsInState,
            { header: '', content: [] },
        ];

        dispatch(updateInstructions(newInstructions));
        setCurrentInstructionIndex(newInstructions.length - 1 || 0);
    }

    function handleHeaderChange(index, value) {
        const newIngredients = [...ingredientsInState];
        newIngredients[index].header = value;
        dispatch(updateIngredients(newIngredients));
    }

    function handleIngredientTextContentChange(index, contentIndex, value) {
        dispatch(updateIngredientContent({ index, contentIndex, text: value }));
    }

    function handleIngredientTextContentBlur(index, contentIndex, value) {
        const newIngredients = [...ingredientsInState];
        const ingredient = newIngredients[index];

        if (isEmpty(value)) {
            const filteredContent = ingredient.content.filter(
                (_, i) => i !== contentIndex
            );
            const updatedIngredient = {
                ...ingredient,
                content: filteredContent,
            };
            newIngredients[index] = updatedIngredient;
            dispatch(updateIngredients(newIngredients));
        }

        setIngredientEditIndex(null);
    }

    function handleIngredientContentClick(index, contentIndex) {
        setIngredientEditIndex({ index, contentIndex });
    }

    /**
     *
     * @param {KeyboardEvent} evt
     */
    function handleIngredientsAdd(evt) {
        const { value } = evt.target;
        if (evt.key === 'Enter' && !evt.shiftKey && !isEmpty(value)) {
            evt.preventDefault();
            addIngredientTextContent(value);
            evt.target.value = '';
        }
    }
    function handleIngredientsPaste(evt) {
        // evt.preventDefault();
        Clipboard.read().then(({ value: pastedText }) => {
            // console.log({ pastedText });
            // Split the pasted text into lines
            const lines = pastedText.split('\n');
            for (let line of lines) {
                addIngredientTextContent(line);
            }

            evt.target.value = '';
        });
    }
    function addIngredientTextContent(text) {
        if (isEmpty(text)) return;
        dispatch(addIngredientContent({ text, index: currentIngredIndex }));
    }
    function handleIngredientSwipeOutDelete(index, contentIndex) {
        const newIngredients = [...ingredientsInState];
        const ingredient = newIngredients[index];

        const filteredContent = ingredient.content.filter(
            (_, i) => i !== contentIndex
        );
        const updatedIngredient = { ...ingredient, content: filteredContent };
        newIngredients[index] = updatedIngredient;
        dispatch(updateIngredients(newIngredients));

        setIngredientEditIndex(null);
    }
    /* Ingredients inputs script end */

    /* Instructions inputs script start */
    function handleInstructionsAdd(evt) {
        const { value } = evt.target;
        if (evt.key === 'Enter' && !evt.shiftKey && value.trim() !== '') {
            evt.preventDefault();
            addInstructionTextContent(value);
            evt.target.value = '';
        }
    }
    function handleInstructionsPaste(evt) {
        evt.preventDefault();

        Clipboard.read().then(({ value: pastedText }) => {
            // Split the pasted text into lines
            const lines = pastedText.split('\n');
            console.log({ lines, pastedText });

            for (let line of lines) {
                console.log({ line });
                addInstructionTextContent(line);
            }
            evt.target.value = '';
        });
    }
    function addInstructionTextContent(text) {
        if (isEmpty(text)) return;
        dispatch(
            addInstructionContent({ text, index: currentInstructionIndex })
        );
    }
    function handleInstructionContentClick(index, contentIndex) {
        setInstructionEditIndex({ index, contentIndex });
    }
    function handleInstructionTextContentBlur(index, contentIndex, value) {
        const newInstructions = [...instructionsInState];
        const instruction = newInstructions[index];

        if (isEmpty(value)) {
            const filteredContent = instruction.content.filter(
                (_, i) => i !== contentIndex
            );
            const updatedInstruction = {
                ...instruction,
                content: filteredContent,
            };
            newInstructions[index] = updatedInstruction;
            dispatch(updateInstructions(newInstructions));
        }

        setInstructionEditIndex(null);
    }
    function handleInstructionSwipeOutDelete(index, contentIndex) {
        const newInstructions = [...instructionsInState];
        const instruction = newInstructions[index];

        const filteredContent = instruction.content.filter(
            (_, i) => i !== contentIndex
        );
        const updatedInstruction = { ...instruction, content: filteredContent };
        newInstructions[index] = updatedInstruction;
        dispatch(updateInstructions(newInstructions));

        setInstructionEditIndex(null);
    }
    function handleInstructionTextContentChange(index, contentIndex, value) {
        dispatch(
            updateInstructionContent({ index, contentIndex, text: value })
        );
    }
    /* Instructions inputs script end */
    useEffect(() => {
        fetchUserCb();
        console.log({ currentUser });
    }, [ingredientsInState, instructionsInState]);

    useEffect(() => {
        const ingredientInput = input1Ref.current.el.querySelector(
            '#rt-ingredient-input'
        );
        const instructionsInput = input2Ref.current.el.querySelector(
            '#rt-instructions-input'
        );

        ingredientInput.addEventListener('keydown', handleIngredientsAdd);
        instructionsInput.addEventListener('keydown', handleInstructionsAdd);
        ingredientInput.addEventListener('paste', handleIngredientsPaste);
        instructionsInput.addEventListener('paste', handleInstructionsPaste);

        return () => {
            ingredientInput.removeEventListener(
                'keydown',
                handleIngredientsAdd
            );

            instructionsInput.removeEventListener(
                'keydown',
                handleInstructionsAdd
            );
            ingredientInput.removeEventListener(
                'paste',
                handleIngredientsPaste
            );

            instructionsInput.removeEventListener(
                'paste',
                handleInstructionsPaste
            );
        };
    }, []);
    useEffect(() => {
        setRecipeToSave((prev) => ({
            ...prev,
            ingredients: ingredientsInState,
        }));
    }, [initialRecipe.ingredients]);
    useEffect(() => {
        setRecipeToSave((prev) => ({
            ...prev,
            instructions: instructionsInState,
        }));
    }, [initialRecipe.instructions]);
    useEffect(() => {
        setIsTitleEmpty(isEmpty(recipeToSave.title));
    }, [recipeToSave.title]);
    useEffect(() => {
        setRecipeToSave((prev) => ({ ...prev, cook_time: cookTimeValue }));
        setRecipeToSave((prev) => ({ ...prev, prep_time: prepTimeValue }));
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
        setConvertedCookTime(utils.convertTime(time));
        setCookTimeValue(time);
    }
    function handleServingsSheetClose(serving) {
        setServingsValue(serving);
    }
    function handlePrepTimeSheetClose(time) {
        setConvertedPrepTime(utils.convertTime(time));
        setPrepTimeValue(time);
    }
    function handleTitleDescChange(evt) {
        const { name, value } = evt.target;
        setRecipeToSave((prev) => ({ ...prev, [name]: value }));
    }
    function setRecipePhoto(url) {
        setRecipeToSave((prev) => ({ ...prev, photo: url }));
    }
    async function saveRecipe() {
        if (!currentUser) {
            dispatch(fetchUser());
            return;
        }
        try {
            setIsSaving(true);
            const _recipeToSave = {
                ...recipeToSave,
                id: recipeId,
                created_at: utils.currentDate.toISOString(),
                updated_at: utils.currentDate.toISOString(),

                user: pick(currentUser, ['prefs', 'name', '$id']),
            };
            console.log({ recipeToSave });

            const recip = utils.serialize(_recipeToSave, [
                'instructions',
                'ingredients',
                'user',
                'cook_time',
                'prep_time',
            ]);
            await appwriteHandler.databases.createDocument(
                envConfig.DATABASE_ID,
                envConfig.RECIPE_COLLECTION_ID,
                recipeId,
                recip
            );
            // console.log({ recip, saved });
            f7.toast.show({
                text: 'Recipe saved successfully',
                closeButton: true,
                closeTimeout: 2500,
                position: 'top',
            });
            dispatch(resetIngredients());
            dispatch(resetInstructions());
            setRecipeToSave(initialRecipe);
            setServingsValue(0);
            setConvertedCookTime({ hours: 0, minutes: 0 });
            setConvertedPrepTime({ hours: 0, minutes: 0 });
            setIsSaving(false);
            setTimeout(() => {
                redirectAfterPosting();
            }, 2000);
        } catch (e) {
            setIsSaving(false);
        }
    }
    function redirectAfterPosting() {
        f7.popup.close();
        f7router.navigate('/home/', {
            clearPreviousHistory: true,
        });
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
                            preloader
                            disabled={isTitleEmpty}
                            loading={isSaving}
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
                <ListGroup>
                    <ListItem
                        mediaItem
                        title={'Title'}
                        className="rt-list-title"
                    />
                    <ListInput
                        className="rt-list-input"
                        name="title"
                        required
                        validate
                        info="Title is required"
                        onChange={handleTitleDescChange}
                        value={recipeToSave.title}
                        placeholder="Give your recipe a name"
                        outline
                    />

                    <PhotoPreviewer
                        initialUrl={recipeToSave.photo}
                        getPhotoUrl={(url) => setRecipePhoto(url)}
                    />
                </ListGroup>
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
            </List>
            <List>
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
                {ingredientsInState.length > 0 &&
                    ingredientsInState.map((ingredient, index) => {
                        return (
                            <List
                                mediaList
                                className="mt-2 mb-2"
                                key={crypto.randomUUID()}
                            >
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
                                        return ingredientEditIndex &&
                                            ingredientEditIndex.index ===
                                                index &&
                                            ingredientEditIndex.contentIndex ===
                                                contentIndex ? (
                                            <ListInput
                                                outline
                                                autofocus={
                                                    ingredientEditIndex.contentIndex ===
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
                                                className="rt-ing-item text-grey"
                                                key={crypto.randomUUID()}
                                                onSwipeoutDeleted={() =>
                                                    handleIngredientSwipeOutDelete(
                                                        index,
                                                        contentIndex
                                                    )
                                                }
                                                onClick={() =>
                                                    handleIngredientContentClick(
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
                                                <SwipeoutActions right>
                                                    <SwipeoutButton delete>
                                                        Delete
                                                    </SwipeoutButton>
                                                </SwipeoutActions>

                                                {/* // <Button
                                                    //     className="rt-ing-delete-btn"
                                                    //     type="button"
                                                    //     onClick={() =>
                                                    //         handleIngredientSwipeOutDelete(
                                                    //             index,
                                                    //             contentIndex
                                                    //         )
                                                    //     }
                                                    //     iconOnly
                                                    //     slot="after"
                                                    //     style={{
                                                    //         height: 20,
                                                    //     }}
                                                    // >
                                                    //     <Icon
                                                    //         className="material-symbols-rounded"
                                                    //         material="close"
                                                    //         tooltip="delete"
                                                    //     />
                                                    // </Button> */}

                                                {!content?.media && (
                                                    <Icon
                                                        slot="media"
                                                        className="material-symbols-rounded"
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
                <List className="mt-0 mb-2">
                    <ListInput
                        ref={input1Ref}
                        inputId={'rt-ingredient-input'}
                        className="rt-list-input "
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
                </List>
            </List>

            <List mediaList className="mt-2 mb-2">
                <ListItem
                    className="rt-list-title"
                    mediaItem
                    subtitle={
                        isMobile
                            ? 'Tap to edit, swipe to delete.'
                            : 'Click to edit'
                    }
                    title={'Instructions'}
                />

                {instructionsInState.map((instruction, index) => {
                    return (
                        <List
                            mediaList
                            className="mt-2 mb-2"
                            key={crypto.randomUUID()}
                        >
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
                            {instruction.content.map(
                                (content, contentIndex) => {
                                    return instructionEditIndex &&
                                        instructionEditIndex.index === index &&
                                        instructionEditIndex.contentIndex ===
                                            contentIndex ? (
                                        <ListInput
                                            outline
                                            autofocus={
                                                instructionEditIndex.contentIndex ===
                                                contentIndex
                                            }
                                            clearButton
                                            onBlur={(e) =>
                                                handleInstructionTextContentBlur(
                                                    index,
                                                    contentIndex,
                                                    e.target.value
                                                )
                                            }
                                            key={crypto.randomUUID()}
                                            value={content.text}
                                            onChange={(e) =>
                                                handleInstructionTextContentChange(
                                                    index,
                                                    contentIndex,
                                                    e.target.value
                                                )
                                            }
                                        />
                                    ) : (
                                        <ListItem
                                            className="rt-ins-item ai-center text-grey"
                                            key={crypto.randomUUID()}
                                            onSwipeoutDeleted={() =>
                                                handleInstructionSwipeOutDelete(
                                                    index,
                                                    contentIndex
                                                )
                                            }
                                            onClick={() =>
                                                handleInstructionContentClick(
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
                                            <SwipeoutActions right>
                                                <SwipeoutButton delete>
                                                    Delete
                                                </SwipeoutButton>
                                            </SwipeoutActions>
                                            {!content?.media && (
                                                <Icon
                                                    slot="media"
                                                    className="material-symbols-rounded "
                                                    material="integration_instructions"
                                                />
                                            )}
                                        </ListItem>
                                    );
                                }
                            )}
                        </List>
                    );
                })}
            </List>

            <List className="mt-0 mb-2">
                <ListInput
                    ref={input2Ref}
                    className="rt-list-input"
                    inputId={'rt-instructions-input'}
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
            </List>
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
                    subtitle={'How long does it take to prepare this recipe?'}
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
