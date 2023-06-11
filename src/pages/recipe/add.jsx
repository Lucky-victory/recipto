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
import TimeSheet from '../../components/time-sheet';

const $$ = Dom7;
const RecipeAddPage = ({ f7router }) => {
    const [ingredients, setIngredients] = useState([
        { header: '', content: [] },
    ]);
    const [currentIngredIndex, setCurrentIngredIndex] = useState(0);
    const [editIndex, setEditIndex] = useState(null);
    const [prepTimeValue, setPrepTimeValue] = useState({
        hours: 0,
        minutes: 0,
    });
    const [cookTimeValue, setCookTimeValue] = useState({
        hours: 0,
        minutes: 0,
    });
    const [initialTimeValue, setInitialTimeValue] = useState({
        hours: 0,
        minutes: 0,
    });
    const [timeSheetType, setTimeSheetType] = useState('');
    const [timeSheetClassName, setTimeSheetClassName] = useState('');

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
    function addIngredientTextContent(text) {
        const newIngredients = [...ingredients];
        newIngredients[currentIngredIndex].content.push({ media: '', text });
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
        if (evt.key === 'Enter' && !evt.shiftKey) {
            const { value } = evt.target;

            addIngredientTextContent(value);
            evt.target.value = '';
        }
    }
    function handleSwipeOutDelete(index, contentIndex) {
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
    useEffect(() => {
        const ingredientInput = $$('.rt-ingredient-input');
        ingredientInput.on('keydown', handleIngredientsAdd);

        return () => ingredientInput.off('keydown', handleIngredientsAdd);
    }, []);
    // useEffect(() => {}, [ingredients]);
    useEffect(() => {
        setTimeSheetClassName(
            timeSheetType === 'cook' ? 'cook-time' : 'prep-time'
        );
        console.log({ timeSheetType });
    }, [timeSheetType]);
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
    function getPrepTime(time) {
        setPrepTimeValue(time);
        console.log('prep herre', { time });
    }
    // function getTime(time) {
    //     setCookTimeValue(time);
    //     console.log('cook herre', { time });
    // }
    function handleTimeSheetClose(time, type) {
        console.log({ time });
        if (timeSheetType === 'cook') {
            setConvertedCookTime(+time?.hours * 60 + +time.minutes);
            setCookTimeValue(time);
        } else {
            setConvertedPrepTime(+time?.hours * 60 + +time.minutes);
            setPrepTimeValue(time);
        }
        // console.log({ h: timeValue?.hours * 60 });
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
                        <Button fill round style={{ minWidth: '5rem' }}>
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
                                {ingredient.content?.length > 0 &&
                                    ingredient.content.map(
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
                                                            <SwipeoutButton
                                                                delete
                                                            >
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
                                                                tooltip="remove"
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
                    <ListItem title={'Prep Time'}>
                        <Link
                            onClick={() => setTimeSheetType('prep')}
                            slot="after"
                            {...(!isMobile
                                ? { popoverOpen: '.time' }
                                : { sheetOpen: '.time' })}
                            text={`${
                                convertedPrepTime > 0
                                    ? convertedCookTime + ' mins'
                                    : 'Set time'
                            }`}
                        />
                    </ListItem>
                    <ListItem title={'Cook Time'}>
                        <Link
                            onClick={() => setTimeSheetType('cook')}
                            slot="after"
                            {...(!isMobile
                                ? { popoverOpen: '.time' }
                                : { sheetOpen: '.time' })}
                            text={`${
                                convertedCookTime > 0
                                    ? convertedCookTime + ' mins'
                                    : 'Set Time'
                            }`}
                        />
                    </ListItem>
                </List>
            </List>

            {/* <TimeSheet
                getTime={getPrepTime}
                onClose={handleTimeSheetClose}
                className="prep-time"
            /> */}
            <TimeSheet
                title="Cook Time"
                subtitle="How long does it take to cook this recipe?"
                initialValue={initialTimeValue}
                // getTime={getTime}
                onClose={(time) => handleTimeSheetClose(time, timeSheetType)}
                className={`time`}
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
