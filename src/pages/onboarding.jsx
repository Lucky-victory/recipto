import {
    Block,
    BlockTitle,
    Button,
    Icon,
    List,
    ListItem,
    Navbar,
    Page,
} from 'framework7-react';
import React from 'react';
import '@/css/onboarding.scss';
const OnboardingPage = () => {
    return (
        <Page name="onboarding" noNavbar noToolbar>
            <Navbar></Navbar>
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
                            Recipto
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
        </Page>
    );
};

export default OnboardingPage;
