import Dom7 from 'dom7';
import {
    Block,
    Button,
    Icon,
    Link,
    List,
    ListItem,
    Preloader,
} from 'framework7-react';
import React, { useEffect, useState } from 'react';
import { appwriteHandler, envConfig, utils } from '../js/helper';

const $ = Dom7;
const noop = () => {};
const PhotoPreviewer = ({
    initialUrl = '',
    btnText = 'Add Photo',
    inputId = utils.genID('inp_', false),
    getPhotoUrl = noop,
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [photoUrl, setPhotoUrl] = useState(initialUrl);
    const handlePhotoSelect = async (ev) => {
        /**
         * @type {Array<FileList>}
         */
        const files = ev.target.files;
        if (files.length > 0) {
            setIsLoading(true);
            setPhotoUrl('');
            const fileId = utils.genID();
            const bucketId = envConfig.BUCKET_ID;
            appwriteHandler.storage
                .createFile(bucketId, fileId, files[0])
                .then(() => {
                    const url = appwriteHandler.storage.getFileView(
                        bucketId,
                        fileId
                    );
                    const photoUrl = url.href;
                    setIsLoading(false);
                    setPhotoUrl(photoUrl);
                });
        }
    };
    function handleBtnClick() {
        $(`#${inputId}`).click();
    }
    function handlePhotoRemove() {
        setPhotoUrl('');
    }
    useEffect(() => {
        setPhotoUrl(photoUrl);
        getPhotoUrl(photoUrl);
    }, [photoUrl]);
    useEffect(() => {
        setPhotoUrl(initialUrl);
        getPhotoUrl(initialUrl);
    }, [initialUrl]);

    return (
        <Block>
            <input
                hidden
                onChange={handlePhotoSelect}
                id={inputId}
                type="file"
                accept="image/*"
                capture
            />

            {isLoading && (
                <Block className="rt-photo-preview">
                    <div className="rt-photo-preview-placeholder">
                        <Preloader size={30} />
                    </div>
                </Block>
            )}
            {photoUrl && (
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
                            onClick={() => handleBtnClick()}
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
                            src={photoUrl}
                            alt=""
                        />
                    </div>
                </Block>
            )}
            {!photoUrl && !isLoading && (
                <Button
                    className="rt-photo-input-click-btn"
                    onClick={handleBtnClick}
                >
                    <Icon
                        className="material-symbols-rounded"
                        material="photo_camera"
                    />
                    <div>{btnText}</div>
                </Button>
            )}
        </Block>
    );
};

export default PhotoPreviewer;
