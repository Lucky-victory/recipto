import {
    Block,
    BlockTitle,
    Button,
    Icon,
    List,
    ListItem,
    Navbar,
    Page,
    NavRight,
    PageContent,
    NavLeft,
} from 'framework7-react';
import React from 'react';
import '@/css/onboarding.scss';
const OnboardingPage = () => {
    return (
        <Page name="onboarding" noNavbar noToolbar>
            <Navbar>
                <NavLeft>
                    <div className="rt-logo-wrap">
                        <img
                            src="/images/logo-1.png"
                            alt=""
                            className="rt-logo lg"
                        />
                    </div>
                </NavLeft>
                <NavRight className="gap-4" style={{ paddingRight: '1rem' }}>
                    <Button round outline text="Sign In" href="/signin/" />
                    <Button round fill text="Sign Up" href="/signup/" />
                </NavRight>
            </Navbar>
            <PageContent>
                <div className="rt-onboarding-page-inner">
                    <video
                        loop
                        autoPlay
                        muted
                        src="https://player.vimeo.com/external/412306034.hd.mp4?s=67a93ffedd18e9e5c46fb05182ac8f4fc423c3cd&profile_id=174&oauth2_token_id=57447761"
                        className="rt-video"
                    ></video>
                    <div className="rt-overlay"></div>
                    <Block className="rt-onboarding-content">
                        <div className="rt-onboarding-content-inner">
                            <BlockTitle large className="text-center">
                                <div className="rt-logo-wrap">
                                    <img
                                        src="/images/logo-1.png"
                                        alt=""
                                        className="rt-logo lg"
                                    />
                                </div>
                            </BlockTitle>
                            <List mediaList>
                                <ListItem text={'Share your recipes'}>
                                    <Icon
                                        slot="media"
                                        color="blue"
                                        className="material-symbols-rounded"
                                        material="task_alt"
                                    />
                                </ListItem>
                                <ListItem text={'Share Posts'}>
                                    <Icon
                                        slot="media"
                                        color="blue"
                                        className="material-symbols-rounded"
                                        material="task_alt"
                                    />
                                </ListItem>
                                <ListItem text={'Save Recipes by others'}>
                                    <Icon
                                        slot="media"
                                        color="blue"
                                        className="material-symbols-rounded"
                                        material="task_alt"
                                    />
                                </ListItem>
                                <ListItem text={'and much more...'}>
                                    <Icon
                                        slot="media"
                                        color="blue"
                                        className="material-symbols-rounded"
                                        material="task_alt"
                                    />
                                </ListItem>
                            </List>
                            <Button text="Join" fill href="/join/" />
                        </div>
                    </Block>
                </div>
                <Block>
                    <div className="flex flex-wrap"></div>
                </Block>
            </PageContent>
        </Page>
    );
};

export default OnboardingPage;
