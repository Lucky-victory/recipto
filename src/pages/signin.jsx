import {
    Block,
    BlockTitle,
    Button,
    Icon,
    List,
    ListInput,
    Navbar,
    Page,
} from 'framework7-react';
import React, { useState } from 'react';
import { appwriteHandler, isMobile, utils } from '../js/helper';
import '@/css/signin-up.scss';
const SignInPage = () => {
    const [signUpForm, setSignupForm] = useState({
        fullname: '',
        password: '',
        email: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const handleInputChange = (ev) => {
        const { name, value } = ev.target;
        setSignupForm((prev) => ({ ...prev, [name]: value }));
    };
    async function handleFormSubmit(ev) {
        ev.preventDefault();
        setIsSubmitting(true);
        try {
            // const newUser = await appwriteHandler.account.create(
            //     utils.genID(),
            //     signUpForm.email,
            //     signUpForm.password,
            //     signUpForm.fullname
            // );
            // const tt = await appwriteHandler.account.createEmailSession(
            //     signUpForm.email,
            //     signUpForm.password
            // );
            const tt = await appwriteHandler.account.createVerification(
                'http://localhost:5174/verify/'
            );

            console.log({ newUser: null, tt });
            setIsSubmitting(false);
            ev.target.reset();
        } catch (e) {
            setIsSubmitting(false);
            console.log('error', { e });
        }
    }
    return (
        <Page
            name="signin"
            className="rt-signin-page"
            noToolbar
            noNavbar={!isMobile}
        >
            <Navbar className="rt-navbar" backLink={isMobile} />
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
                        <List form onSubmit={handleFormSubmit}>
                            <ListInput
                                label={'Your Name'}
                                outline
                                required
                                onChange={handleInputChange}
                                name="fullname"
                                value={signUpForm.fullname}
                            />
                            <ListInput
                                type="email"
                                name="email"
                                validate
                                onChange={handleInputChange}
                                required
                                value={signUpForm.email}
                                label={'E-mail address'}
                                outline
                            />
                            <ListInput
                                info="min: 8 characters"
                                label={'Password'}
                                name="password"
                                onChange={handleInputChange}
                                required
                                type="password"
                                outline
                            />

                            <Block>
                                <Button
                                    type="submit"
                                    large
                                    text="Sign Up"
                                    fill
                                    disabled={isSubmitting}
                                    preloader
                                    loading={isSubmitting}
                                />
                            </Block>
                            <Block
                                className="rt-divider"
                                data-text="or"
                            ></Block>
                            <Block>
                                <Button outline large disabled={isSubmitting}>
                                    <img
                                        className="rt-google-icon"
                                        src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
                                    />
                                    <span>Continue with Google</span>
                                </Button>
                            </Block>
                        </List>
                    </div>
                </Block>
            </div>
        </Page>
    );
};

export default SignInPage;
