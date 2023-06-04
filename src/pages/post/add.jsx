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
    Preloader,
} from 'framework7-react';
import React, { useEffect, useState } from 'react';
import { appwriteHandler, isMobile, utils } from '../../js/helper';
import '@/css/post.scss';
import { $ } from 'dom7';
import isEmpty from 'just-is-empty';

const PostAddPage = () => {
    const [isLoadingPhoto, setIsLoadingPhoto] = useState(false);
    const [post, setPost] = useState({
        id: utils.genID('post_', false),
        text: '',
        photo: '',
        has_recipe: false,
        recipe: {},
        user: { id: '' },
        created_at: utils.currentDate.toISOString(),
        updated_at: utils.currentDate.toISOString(),
    });
    const [disableSubmitBtn, setDisableSubmitBtn] = useState(false);
    const handleInputClick = async () => {
        $('#photo-input').click();
    };
    const [photoPreview, setPhotoPreview] = useState(null);
    const handlePhotoSelect = async (ev) => {
        /**
         * @type {Array<FileList>}
         */
        const files = ev.target.files;
        if (files.length > 0) {
            setIsLoadingPhoto(true);
            setPhotoPreview(null);
            const fileId = utils.genID();
            const bucketId = '647caba948df689017b0';
            appwriteHandler.storage
                .createFile(bucketId, fileId, files[0])
                .then((res) => {
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
            setDisableSubmitBtn(true);
        } else {
            setDisableSubmitBtn(false);
        }
        console.log({ post });
    }, [post]);
    return (
        <Page name="post-add">
            <Navbar backLink={isMobile} title="Your Post">
                <NavRight style={{ paddingRight: '1rem' }}>
                    {isMobile && (
                        <Button fill round style={{ minWidth: '5rem' }}>
                            Post
                        </Button>
                    )}
                    {!isMobile && <Button large text="Close" popupClose back />}
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
                            disabled={disableSubmitBtn}
                            large
                            fill
                            style={{ width: '7rem', fontSize: 18 }}
                        >
                            Post
                        </Button>
                    </Block>
                )}
            </List>
        </Page>
    );
};

export default PostAddPage;
