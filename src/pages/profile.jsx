import {
    Block,
    BlockTitle,
    Button,
    Icon,
    Link,
    NavRight,
    NavTitle,
    NavTitleLarge,
    Navbar,
    Page,
    PageContent,
    Popover,
    Segmented,
    SkeletonAvatar,
    Tab,
    Tabs,
    f7,
} from 'framework7-react';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { utils } from '../js/helper';
import Avatar from '../components/avatar';
import { dropUser } from '../js/state/slices/user';

const ProfilePage = ({ user = {}, f7router }) => {
    const { data: currentUser } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    function logout() {
        dispatch(dropUser());
        setTimeout(() => {
            f7router.navigate('/onboard/', {
                clearPreviousHistory: true,
            });
        }, 1000);
        f7.popover.close();
    }
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
                {utils.isSame(user?.$id, currentUser?.$id) && (
                    <NavRight>
                        <Link iconOnly popoverOpen="#rt-more">
                            <Icon
                                className="material-symbols-rounded"
                                material="more_vert"
                            />
                        </Link>
                        <Popover id={'rt-more'}>
                            <Button
                                text="Logout"
                                onClick={() => logout()}
                            ></Button>
                        </Popover>
                    </NavRight>
                )}
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
                        {utils.isSame(user?.$id, currentUser?.$id) ? (
                            <div className="text-center">
                                <BlockTitle large className="text-grey">
                                    You don't have any activity yet
                                </BlockTitle>
                                <span className="text-grey">
                                    {' '}
                                    Your post or recipes will show up here
                                </span>
                            </div>
                        ) : (
                            <div className="text-center">
                                <BlockTitle large className="text-grey">
                                    No activity yet
                                </BlockTitle>
                                <span className="text-grey">
                                    {' '}
                                    {user?.name} has not shared anything.
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
