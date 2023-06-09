import {
    Block,
    BlockTitle,
    Button,
    Icon,
    List,
    ListInput,
    Navbar,
    Page,
    f7,
} from 'framework7-react';
import React, { useState } from 'react';
import { appwriteHandler, isMobile, storageKeys, utils } from '../js/helper';
import '@/css/signin-up.scss';
import { Preferences } from '@capacitor/preferences';
const SignInPage = () => {
    const [signUpForm, setSignupForm] = useState({
        fullname: '',
        password: '',
        email: '',
    });
    const [authType, setAuthType] = useState('email');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const handleInputChange = (ev) => {
        const { name, value } = ev.target;
        setSignupForm((prev) => ({ ...prev, [name]: value }));
    };
    appwriteHandler.account.get().then((acc) => console.log({ acc }));
    async function handleFormSubmit(ev) {
        ev.preventDefault();
        setIsSubmitting(true);
        try {
            const newUser = await appwriteHandler.account.create(
                utils.genID(),
                signUpForm.email,
                signUpForm.password,
                signUpForm.fullname
            );
            const tt = await appwriteHandler.account.createEmailSession(
                signUpForm.email,
                signUpForm.password
            );
            // const tt = await appwriteHandler.account.createVerification(
            //     'http://localhost:5174/verify/'
            // );
            await Preferences.set({
                key: storageKeys.USER,
                value: JSON.stringify(newUser),
            });
            f7.toast.show({
                position: 'center',
                text: 'Sign up successful',
                closeTimeout: 3000,
            });
            console.log({ newUser, tt });
            setIsSubmitting(false);
            setSignupForm({ fullname: '', password: '', email: '' });
        } catch (e) {
            setIsSubmitting(false);
            console.log('error', { e });
        }
    }
    function handleGoogleSignUp() {
        setAuthType('google');
        setIsSubmitting(true);
        try {
            const res = appwriteHandler.account.createOAuth2Session(
                'google',
                'http://localhost:5174/signin/'
            );
            console.log({ res });
        } catch (e) {
            setIsSubmitting(false);
            console.log('google auth error', { e });
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
                                    loading={
                                        isSubmitting && authType === 'email'
                                    }
                                />
                            </Block>
                            <Block
                                className="rt-divider"
                                data-text="or"
                            ></Block>
                            <Block>
                                <Button
                                    outline
                                    large
                                    preloader
                                    loading={
                                        isSubmitting && authType == 'google'
                                    }
                                    disabled={isSubmitting}
                                    onClick={handleGoogleSignUp}
                                >
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
