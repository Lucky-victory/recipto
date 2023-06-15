import {
    CardHeader,
    Icon,
    Link,
    List,
    Button,
    Popover,
} from 'framework7-react';
import React from 'react';
import Avatar from './avatar';
import { formatDistanceToNowStrict } from 'date-fns';
import { utils } from '../js/helper';
const PostCardHeader = ({
    recipeOrPost,
    showTime = true,
    avatarSize = 42,
    showMoreBtn = true,
    popoverId,
    user = {},
}) => {
    return (
        <CardHeader className="rt-card-header">
            <div className="flex jc-center ">
                <Link
                    routeProps={{ user: recipeOrPost?.user }}
                    href={`/profile/user/${recipeOrPost?.user?.$id}`}
                    // add link to user profile
                    className="rt-card-header-link flex jc-center ov-hidden flex-grow"
                >
                    <Avatar user={recipeOrPost?.user} size={avatarSize} />
                    <div className="ml-4">
                        <div className="text-bold rt-card-header-name">
                            {recipeOrPost?.user?.name}
                        </div>
                        {showTime && (
                            <div className="text-grey text-sm">
                                {formatDistanceToNowStrict(
                                    new Date(recipeOrPost?.created_at)
                                )}{' '}
                                ago
                            </div>
                        )}
                    </div>
                </Link>
            </div>
            {showMoreBtn && (
                <Link iconOnly popoverOpen={'#' + popoverId}>
                    <Icon
                        material="more_vert"
                        className="material-symbols-rounded"
                    ></Icon>
                </Link>
            )}
        </CardHeader>
    );
};

export default PostCardHeader;
