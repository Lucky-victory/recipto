import { CardHeader, Icon, Link } from 'framework7-react';
import React from 'react';
import Avatar from './avatar';
import { formatDistanceToNowStrict } from 'date-fns';
const PostCardHeader = ({ recipeOrPost }) => {
    return (
        <CardHeader className="rt-recipe-card-header">
            <div className="flex jc-center ">
                <Link
                    href="#"
                    // add link to user profile
                    className="rt-recipe-card-header-link flex jc-center ov-hidden flex-grow"
                >
                    <Avatar user={recipeOrPost.user} />
                    <div className="ml-4">
                        <div className="text-bold rt-recipe-card-header-name">
                            {recipeOrPost?.user?.name}
                        </div>
                        <div className="text-grey text-sm">
                            {formatDistanceToNowStrict(
                                new Date(recipeOrPost?.created_at)
                            )}{' '}
                            ago
                        </div>
                    </div>
                </Link>
            </div>
            <Link href="#" iconOnly>
                <Icon
                    material="more_vert"
                    className="material-symbols-rounded"
                ></Icon>
            </Link>
        </CardHeader>
    );
};

export default PostCardHeader;
