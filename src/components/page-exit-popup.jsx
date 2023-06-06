import { Block, BlockTitle, Button, Popup, f7 } from 'framework7-react';
import React, { useState } from 'react';

const noop = () => {};
const PageExitPopup = ({
    dangerBtnLabel = 'Yes, Leave page',
    cancelBtnLabel = 'Cancel',
    titleText,
    onExit = noop,
    onCancel = noop,
    isOpened = false,
}) => {
    const [canExit] = useState(true);
    const [isPopupOpened] = useState(isOpened);
    function handleCancelBtnClick() {
        onCancel();
    }
    function handleExitBtnClick(canExit, ev) {
        onExit(canExit, ev);
    }
    return (
        <Popup id={'page-exit-popup'} className="page-exit-popup">
            <Block className="flex jc-center">
                <Block>
                    <BlockTitle large className="mb-2">
                        Leave Page?
                    </BlockTitle>
                    <BlockTitle className="m-0 mb-4 " color="gray">
                        {titleText || "Your post won't be saved."}
                    </BlockTitle>
                    <div className="flex">
                        <Button
                            text={cancelBtnLabel}
                            onClick={() => handleCancelBtnClick()}
                            outline
                            round
                        />
                        <Button
                            className="ml-4"
                            text={dangerBtnLabel}
                            color="red"
                            round
                            fill
                            onClick={(ev) => handleExitBtnClick(canExit, ev)}
                        />
                    </div>
                </Block>
            </Block>
        </Popup>
    );
};

export default PageExitPopup;
