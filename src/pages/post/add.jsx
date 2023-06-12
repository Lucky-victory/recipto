import {
    Block,
    Button,
    Icon,
    Link,
    List,
    ListGroup,
    ListInput,
    ListItem,
    NavLeft,
    NavRight,
    NavTitle,
    Navbar,
    Page,
    Preloader,
    f7,
} from 'framework7-react';
import React, { useEffect, useState } from 'react';
import { appwriteHandler, envConfig, isMobile, utils } from '../../js/helper';
import '@/css/post.scss';
import { $ } from 'dom7';
import isEmpty from 'just-is-empty';
import PageExitPopup from '@/components/page-exit-popup';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser } from '../../js/state/slices/user';
import pick from 'just-pick';

const PostAddPage = ({ f7router }) => {
    const dispatch = useDispatch();
    const [isLoadingPhoto, setIsLoadingPhoto] = useState(false);
    const { data: currentUser, loading: userLoading } = useSelector(
        (state) => state.user
    );
    console.log({ currentUser, userLoading });
    const postId = utils.genID(undefined, false);
    const initialPost = {
        text: '',
        photo: '',
        has_recipe: false,
        recipe: {},
        user: {},
        created_at: '',
        updated_at: '',
    };
    const [post, setPost] = useState(initialPost);

    const [isEmptyPost, setIsEmptyPost] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const handleInputClick = async () => {
        $('#photo-input').click();
    };
    const [photoPreview, setPhotoPreview] = useState('');
    const handlePhotoSelect = async (ev) => {
        /**
         * @type {Array<FileList>}
         */
        const files = ev.target.files;
        if (files.length > 0) {
            setIsLoadingPhoto(true);
            setPhotoPreview('');
            const fileId = utils.genID();
            const bucketId = envConfig.BUCKET_ID || '647caba948df689017b0';
            appwriteHandler.storage
                .createFile(bucketId, fileId, files[0])
                .then(() => {
                    const url = appwriteHandler.storage.getFileView(
                        bucketId,
                        fileId
                    );
                    const photoUrl = url.href;
                    setIsLoadingPhoto(false);
                    setPhotoPreview(photoUrl);

                    setPost((prev) => ({ ...prev, photo: photoUrl }));
                });
        }
    };
    function handleEditBtnClick() {
        $('#photo-input').click();
    }
    function handleTextareaChange(ev) {
        setPost((prev) => ({ ...prev, text: ev.target.value }));
    }
    function handlePhotoRemove() {
        setPhotoPreview(null);
        setPost((prev) => ({ ...prev, photo: '' }));
    }
    useEffect(() => {
        if (isEmpty(post.text) && isEmpty(post.photo) && isEmpty(post.recipe)) {
            setIsEmptyPost(true);
        } else {
            setIsEmptyPost(false);
        }
        // console.log({ post: utils.serialize({ ...post }) });
        // console.log({ post2: utils.deSerialize(utils.serialize({ ...post })) });
    }, [post]);

    async function SubmitPost() {
        try {
            setIsSubmitting(true);
            const serializedPost = utils.serialize({
                ...post,
                id: postId,
                photo: photoPreview,
                created_at: utils.currentDate.toISOString(),
                updated_at: utils.currentDate.toISOString(),
                user: pick(currentUser, ['$id', 'name', 'prefs']),
            });
            console.log(serializedPost);

            const p = await appwriteHandler.databases.createDocument(
                envConfig.DATABASE_ID,
                envConfig.POST_COLLECTION_ID,
                postId,
                serializedPost
            );
            f7.toast.show({
                text: 'Post added successfully',
                closeButton: true,
                closeTimeout: 1500,
                position: 'top',
            });
            setIsSubmitting(false);
            setPost(initialPost);
            setPhotoPreview('');
            setTimeout(() => {
                redirectAfterPosting();
            }, 2000);
        } catch (e) {
            setIsSubmitting(false);

            console.log('post submit', { e });
        }
    }
    function redirectAfterPosting() {
        f7.popup.close();
        f7router.navigate('/home/', {
            clearPreviousHistory: true,
        });
    }
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
        if (!isEmptyPost) {
            f7.popup.open('#page-exit-popup');
        } else {
            f7.popup.close();
            if (isMobile) {
                f7.popup.close('#page-exit-popup');
                handleBackClick();
            }
        }
    }
    function handleBackClick() {
        f7router.back();
    }
    useEffect(() => {
        dispatch(fetchUser());
    }, [dispatch]);
    return (
        <Page name="post-add" className="custom-bg">
            <Navbar outline>
                {isMobile && (
                    <NavLeft>
                        <Link iconOnly onClick={() => handlePopupOpen()}>
                            <Icon className="icon-back" />
                        </Link>
                    </NavLeft>
                )}
                <NavTitle title="Your Post" />
                <NavRight style={{ paddingRight: '1rem' }}>
                    {isMobile && (
                        <Button
                            disabled={isEmptyPost || isSubmitting}
                            preloader
                            loading={isSubmitting}
                            fill
                            onClick={() => SubmitPost()}
                            round
                            style={{ minWidth: '5rem' }}
                        >
                            Post
                        </Button>
                    )}
                    {!isMobile && (
                        <Button large text="Close" onClick={handlePopupOpen} />
                    )}
                </NavRight>
            </Navbar>
            <List>
                <ListInput
                    type="textarea"
                    noStoreData={false}
                    outline
                    onChange={handleTextareaChange}
                    value={post.text}
                    placeholder="Add Text"
                ></ListInput>
                {isLoadingPhoto && (
                    <Block className="rt-photo-preview">
                        <div className="rt-photo-preview-placeholder">
                            <Preloader size={30} />
                        </div>
                    </Block>
                )}
                {photoPreview && (
                    <Block className="rt-photo-preview">
                        <div className="rt-photo-preview-inner">
                            <Link
                                onClick={() => handlePhotoRemove()}
                                iconOnly
                                tooltip="remove photo"
                                className="rt-photo-preview-btn remove"
                            >
                                <Icon
                                    className="material-symbols-rounded"
                                    material="close"
                                />
                            </Link>
                            <Link
                                onClick={() => handleEditBtnClick()}
                                iconOnly
                                tooltip="choose another photo"
                                className="rt-photo-preview-btn edit"
                            >
                                <Icon
                                    className="material-symbols-rounded"
                                    material="edit"
                                />
                            </Link>
                            <img
                                className="rt-photo-preview-img"
                                src={photoPreview}
                                alt=""
                            />
                        </div>
                    </Block>
                )}
                <input
                    hidden
                    onChange={handlePhotoSelect}
                    id="photo-input"
                    type="file"
                    accept="image/*"
                    capture
                />
                <Block>
                    <Button
                        onClick={handleInputClick}
                        outline
                        disabled={photoPreview}
                        className="rt-btn-plain"
                    >
                        <Icon
                            className="material-symbols-rounded"
                            material="photo_camera"
                        />{' '}
                        <span>Photo</span>
                    </Button>
                    <Button
                        href="/recipe/add"
                        openIn="popup"
                        outline
                        className="rt-btn-plain"
                    >
                        <Icon
                            className="material-symbols-rounded"
                            material="restaurant"
                        />{' '}
                        <span>Recipe</span>
                    </Button>
                </Block>

                {!isMobile && (
                    <Block>
                        <Button
                            disabled={isEmptyPost || isSubmitting}
                            preloader
                            loading={isSubmitting}
                            fill
                            style={{ width: '7rem', fontSize: 18 }}
                            onClick={() => SubmitPost()}
                        >
                            Post
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

export default PostAddPage;
