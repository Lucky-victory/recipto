import React from 'react';
import {
    Page,
    Navbar,
    Block,
    Link,
    NavLeft,
    NavTitle,
    Icon,
} from 'framework7-react';

const NotFoundPage = () => (
    <Page>
        <Navbar>
            <NavLeft>
                <Link popupClose iconOnly back>
                    <Icon className="icon-back" />
                </Link>
            </NavLeft>
            <NavTitle>Not Found</NavTitle>
        </Navbar>
        <Block strong inset>
            <p>Sorry</p>
            <p>Requested content not found.</p>
        </Block>
    </Page>
);

export default NotFoundPage;
