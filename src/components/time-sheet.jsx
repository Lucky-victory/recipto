import React, { useEffect, useState } from 'react';
import { isMobile } from '../js/helper';
import { Block, BlockTitle, Button, Popover, Sheet } from 'framework7-react';
import { Swiper, SwiperSlide } from 'swiper/react';

const noop = () => {};

const TimeSheet = ({
    getTime = noop,
    onClose = noop,
    className = 'cook-time',
    title = 'Cook Time',
    subtitle = 'How long does it take to cook this recipe?',
    initialValue = { hours: '0', minutes: '0' },
}) => {
    const hours = [];
    const swiperOptions = {
        slidesPerView: 3,
        direction: 'vertical',
        centeredSlides: true,
        loop: true,
    };
    const [addedClassName, setAddedClassName] = useState(className);

    const [timeValue, setTimeValue] = useState(initialValue);
    const [isSelected, setIsSelected] = useState(
        !(+timeValue.hours === 0 && +timeValue.minutes === 0)
    );
    const handleTimeSwiperChange = (type, sw) => {
        const activeSlide = sw.slides[sw.activeIndex];
        const value = activeSlide && activeSlide?.dataset?.value;
        setTimeValue((prev) => ({ ...prev, [type]: +value }));
    };

    useEffect(() => {
        getTime(timeValue);
        setIsSelected(!(+timeValue.hours === 0 && +timeValue.minutes === 0));
    }, [timeValue]);
    useEffect(() => {
        setTimeValue(initialValue);
        console.log({ className });
        setAddedClassName(className);
    }, [className]);
    function handleClose(timeValue) {
        onClose(timeValue);
    }
    const d = [
        <div>
            <Block>
                <BlockTitle large>{title}</BlockTitle>
                <div className="text-sm text-grey">{subtitle}</div>
            </Block>
            <div className="time-swiper-wrap">
                <Swiper
                    onSlideChange={(sw) => handleTimeSwiperChange('hours', sw)}
                    initialSlide={+timeValue.hours}
                    {...swiperOptions}
                    className="time-swiper"
                >
                    {Array.from({ length: 24 }, (_, i) => (
                        <SwiperSlide data-value={i} key={i}>
                            {i} {i === 1 ? 'hour' : 'hours'}
                        </SwiperSlide>
                    ))}
                </Swiper>

                <Swiper
                    onSlideChange={(sw) =>
                        handleTimeSwiperChange('minutes', sw)
                    }
                    {...swiperOptions}
                    initialSlide={+timeValue.minutes}
                    className="time-swiper"
                >
                    {Array.from({ length: 60 }, (_, i) => (
                        <SwiperSlide data-value={i} key={i}>
                            {i} {i === 1 ? 'min' : 'mins'}
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
            <Block>
                <Button
                    type="button"
                    round
                    fill
                    disabled={!isSelected}
                    text="Save"
                    sheetClose
                    popoverClose
                    onClick={() => handleClose(timeValue)}
                ></Button>
            </Block>
        </div>,
    ];
    return isMobile ? (
        <Sheet className={`${addedClassName} rt-sheet time-sheet`}>
            {...d}
        </Sheet>
    ) : (
        <Popover className={`${addedClassName} rt-sheet`}> {...d}</Popover>
    );
};

export default TimeSheet;
