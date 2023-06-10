import {
    Block,
    SkeletonAvatar,
    SkeletonBlock,
    SkeletonImage,
    SkeletonText,
} from 'framework7-react';
import React from 'react';

const PostSkeleton = () => {
    return (
        <Block>
            <div className="flex gap-4 ai-center mb-2">
                <SkeletonAvatar effect="wave" showIcon={false} size={44} />
                <SkeletonBlock
                    effect="wave"
                    height="30px"
                    width="200px"
                    style={{ borderRadius: '12px', marginBottom: '1rem' }}
                ></SkeletonBlock>
            </div>

            <SkeletonBlock
                effect="wave"
                height="50px"
                style={{ borderRadius: '12px', marginBottom: '1rem' }}
            ></SkeletonBlock>
            <SkeletonText
                effect="wave"
                style={{ background: 'red', width: '100px', height: '30px' }}
            />

            <SkeletonImage
                effect="wave"
                style={{
                    borderRadius: '12px',

                    overflow: 'hidden',
                }}
            />
        </Block>
    );
};

export default PostSkeleton;
