import React, { useEffect, useState } from 'react';
import { isMobile } from '../js/helper';
import {
    Block,
    BlockTitle,
    Button,
    Icon,
    Popover,
    Sheet,
} from 'framework7-react';
import { Swiper, SwiperSlide } from 'swiper/react';

const noop = () => {};

const ServingSheet = ({
    getTime = noop,
    onClose = noop,
    className = 'servings-sheet',
    title = 'Servings',
    subtitle = '',
    initialValue = null,
}) => {
    const swiperOptions = {
        loop: true,
        slidesPerView: 3,
        direction: 'vertical',
        centeredSlides: true,
    };
    const [addedClassName] = useState(className);

    const [servingsValue, setServingsValue] = useState(initialValue);
    const [isSelected, setIsSelected] = useState(servingsValue === null);
    const handleServingsSwiperChange = (sw) => {
        const activeSlide = sw.slides[sw.activeIndex];
        const value = activeSlide && activeSlide?.dataset?.value;
        if (servingsValue === null) return;
        setServingsValue(+value);
    };

    useEffect(() => {
        getTime(servingsValue);
        // setIsSelected(servingsValue === null)
    }, [servingsValue]);

    function handleClose(servingsValue) {
        onClose(servingsValue);
    }
    const d = [
        <div>
            <Block>
                <BlockTitle large>{title}</BlockTitle>
                <div className="text-sm text-grey">{subtitle}</div>
            </Block>
            <div className="time-swiper-wrap">
                <Swiper
                    onSlideChange={(sw) => handleServingsSwiperChange(sw)}
                    initialSlide={+servingsValue}
                    {...swiperOptions}
                    className="time-swiper"
                >
                    <SwiperSlide>
                        <Icon
                            className="material-symbols-rounded"
                            material="remove"
                        />
                    </SwiperSlide>
                    {Array.from({ length: 100 }, (_, i) => (
                        <SwiperSlide data-value={i} key={i}>
                            {i}
                        </SwiperSlide>
                    ))}
                </Swiper>
                ,
            </div>
            <Block>
                <Button
                    type="button"
                    round
                    fill
                    // disabled={!isSelected}
                    text="Save"
                    sheetClose
                    popoverClose
                    onClick={() => handleClose(servingsValue)}
                ></Button>
            </Block>
        </div>,
    ];
    return isMobile ? (
        <Sheet
            style={{ maxHeight: 320 }}
            className={`${addedClassName} rt-sheet time-sheet`}
        >
            {...d}
        </Sheet>
    ) : (
        <Popover className={`${addedClassName} rt-sheet`}> {...d}</Popover>
    );
};
export default ServingSheet;
