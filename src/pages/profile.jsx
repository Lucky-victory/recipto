import {
    Block,
    BlockTitle,
    Button,
    NavTitle,
    NavTitleLarge,
    Navbar,
    Page,
    PageContent,
    Segmented,
    SkeletonAvatar,
    Tab,
    Tabs,
} from 'framework7-react';
import React from 'react';
import { useSelector } from 'react-redux';
import { utils } from '../js/helper';
import Avatar from '../components/avatar';

const ProfilePage = ({ user = {} }) => {
    const { data: currentUser } = useSelector((state) => state.user);

    return (
        <Page name="profile" className="custom-bg">
            <Navbar outline sliding={false} backLink>
                <NavTitle sliding>{user?.name}</NavTitle>
                <NavTitleLarge>
                    <div className="flex gap-4">
                        <Avatar user={user} size={70} />
                        <div className=" flex-column gap-2 ml-4">
                            <span>{user?.name}</span>
                            {utils.isSame(user?.$id, currentUser?.$id) && (
                                <Button
                                    tonal
                                    small
                                    outline
                                    round
                                    text="Edit profile"
                                />
                            )}
                        </div>
                    </div>
                </NavTitleLarge>
            </Navbar>
            <PageContent className="rt-profile-tab-content">
                <Block strong className="mb-0">
                    {/* <Button
                        type="button"
                        text="Activity"
                        className="rt-profile-tab-btn"
                    />
                     */}
                    <BlockTitle large>Activity</BlockTitle>
                </Block>

                <Block className="">
                    <div className="flex ai-center jc-center">
                        {utils.isSame(user?.$id, currentUser?.$id) && (
                            <div className="text-center">
                                <BlockTitle large className="text-grey">
                                    You don't have any activity yet
                                </BlockTitle>
                                <span className="text-grey">
                                    {' '}
                                    Your post or recipes will show up here
                                </span>
                            </div>
                        )}
                    </div>
                </Block>
            </PageContent>
        </Page>
    );
};

export default ProfilePage;
