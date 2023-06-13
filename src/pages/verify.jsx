import { Block, BlockTitle, Navbar, Page } from 'framework7-react';
import React from 'react';
import { appwriteHandler } from '../js/helper';

const VerifyUserPage = ({ f7router }) => {
    async function verify() {
        try {
            const { userId, secret } = f7router.currentRoute.query;
            const v = await appwriteHandler.account.updateVerification(
                userId,
                secret
            );
            console.log('verify success', { v });
        } catch (e) {
            console.log('verify error', e);
        }
    }
    return (
        <Page name="verify" onPageBeforeIn={verify}>
            <Navbar></Navbar>
            <Block>
                <BlockTitle large>Verification</BlockTitle>
            </Block>
        </Page>
    );
};

export default VerifyUserPage;
