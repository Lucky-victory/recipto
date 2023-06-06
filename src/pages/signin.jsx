import {
    Block,
    BlockTitle,
    Button,
    List,
    ListInput,
    Navbar,
    Page,
} from 'framework7-react';
import React from 'react';
import { isMobile } from '../js/helper';
import '@/css/signin-up.scss';
const SignInPage = () => {
    return (
        <Page
            name="signin"
            className="rt-signin-page"
            noToolbar
            noNavbar={!isMobile}
        >
            {isMobile && <Navbar className="rt-navbar" backLink />}
            <div className="rt-signin-page-inner flex">
                <Block className="rt-signin-page-banner-wrap">
                    <div className="rt-overlay"></div>
                    {/* <video
                        src="https://player.vimeo.com/external/412306034.hd.mp4?s=67a93ffedd18e9e5c46fb05182ac8f4fc423c3cd&profile_id=174&oauth2_token_id=57447761"
                        muted
                        autoPlay
                        loop
                        className="rt-video"
                    ></video> */}
                    <img
                        src="https://images.pexels.com/photos/4057691/pexels-photo-4057691.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                        alt=""
                        className="rt-banner-img"
                    />
                </Block>
                <Block className="rt-signin-page-form-wrap">
                    <div className="rt-signin-page-form-wrap-inner">
                        <BlockTitle large className="text-center mb-4">
                            Join over 1,000 Users sharing their recipes
                        </BlockTitle>
                        <List>
                            <ListInput label={'Your Name'} outline />
                            <ListInput
                                type="email"
                                label={'E-mail address'}
                                outline
                            />
                            <ListInput
                                label={'Password'}
                                type="password"
                                outline
                            />

                            <Block>
                                <Button large text="Sign Up" fill />
                            </Block>
                        </List>
                    </div>
                </Block>
            </div>
        </Page>
    );
};

export default SignInPage;
