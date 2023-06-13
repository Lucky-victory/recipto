import {
    Block,
    BlockTitle,
    Button,
    Icon,
    Link,
    List,
    ListInput,
    Navbar,
    Page,
    f7,
} from 'framework7-react';
import React, { useCallback, useEffect, useState } from 'react';
import {
    AppStorage,
    appwriteHandler,
    isMobile,
    storageKeys,
    utils,
} from '../js/helper';
import '@/css/signin-up.scss';
import { Preferences } from '@capacitor/preferences';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser, updateUser } from '../js/state/slices/user';
import isEmpty from 'just-is-empty';
const SignUpPage = ({ f7router }) => {
    const initialForm = {
        fullname: '',
        password: '',
        email: '',
    };
    const dispatch = useDispatch();
    const fetchUserCb = useCallback(() => {
        dispatch(fetchUser());
    }, []);
    const { data: currentUser, loading: userLoading } = useSelector(
        (state) => state.user
    );
    const [errorMessage, setErrorMessage] = useState('');

    const [signUpForm, setSignupForm] = useState(initialForm);
    const [authType, setAuthType] = useState('email');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const handleInputChange = (ev) => {
        const { name, value } = ev.target;
        setSignupForm((prev) => ({ ...prev, [name]: value }));
    };

    async function handleFormSubmit(ev) {
        ev.preventDefault();
        setIsSubmitting(true);
        setErrorMessage('');
        try {
            const newUser = await appwriteHandler.account.create(
                utils.genID(),
                signUpForm.email,
                signUpForm.password,
                signUpForm.fullname
            );
            // dispatch(updateUser(newUser));
            const tt = await appwriteHandler.account.createEmailSession(
                signUpForm.email,
                signUpForm.password
            );
            // const tt = await appwriteHandler.account.createVerification(
            //     'http://localhost:5174/verify/'
            // );

            f7.toast.show({
                position: 'top',
                text: 'Sign up successful',
                closeTimeout: 2000,
            });
            setTimeout(() => {
                f7router.navigate('/home/');
            }, 2000);

            setIsSubmitting(false);
            setSignupForm(initialForm);
        } catch (e) {
            setIsSubmitting(false);
            setErrorMessage(e?.response?.message);
            console.log('error', { e });
        }
    }
    function handleGoogleSignUp() {
        setAuthType('google');
        setIsSubmitting(true);
        try {
            const res = appwriteHandler.account.createOAuth2Session(
                'google',
                utils.mainURL + '/home/'
            );
        } catch (e) {
            setIsSubmitting(false);
            console.log('google auth error', { e });
        }
    }
    function onPageBeforeIn() {
        if (!isEmpty(currentUser)) {
            f7router.navigate('/home/');
        }
        console.log({ currentUser });
    }
    useEffect(() => {
        fetchUserCb();
    }, [dispatch]);
    return (
        <Page
            name="signin"
            className="rt-signin-page"
            noToolbar
            noNavbar={!isMobile}
            onPageBeforeIn={onPageBeforeIn}
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
                            Join other Users sharing their recipes
                        </BlockTitle>
                        <span className="text-color-red">{errorMessage}</span>

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
                                value={signUpForm.password}
                            />
                            <Block>
                                Already have an account?{' '}
                                <Link href="/signin/" text="Sign In" />
                            </Block>
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

export default SignUpPage;
