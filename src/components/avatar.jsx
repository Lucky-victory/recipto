import { Link } from 'framework7-react';
import React from 'react';
import { utils } from '../js/helper';

const Avatar = ({ user, size = '', link }) => {
    return link ? (
        <Link iconOnly href={link}>
            {user?.prefs?.avatar ? (
                <img
                    src={user?.prefs?.avatar}
                    alt=""
                    className={`rt-avatar rt-avatar-${size}`}
                />
            ) : (
                <div
                    className="rt-svg-avatar"
                    dangerouslySetInnerHTML={{
                        __html: utils.generateAvatar(user?.name),
                    }}
                ></div>
            )}
        </Link>
    ) : (
        <div>
            {user?.prefs?.avatar ? (
                <img
                    src={user?.prefs?.avatar}
                    alt=""
                    className={`rt-avatar rt-avatar-${size}`}
                />
            ) : (
                <div
                    className="rt-svg-avatar"
                    dangerouslySetInnerHTML={{
                        __html: utils.generateAvatar(user?.name),
                    }}
                ></div>
            )}
        </div>
    );
};

export default Avatar;
