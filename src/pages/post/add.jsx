import { List, ListInput, ListItem, Navbar, Page } from 'framework7-react';
import React from 'react';

const PostAddPage = () => {
    return (
        <Page name="post-add">
            <Navbar backLink title="Your Post" />
            <List>
                <ListInput
                    type="textarea"
                    outline
                    placeholder="Add Text"
                ></ListInput>
            </List>
            <div>NewPostPage</div>
        </Page>
    );
};

export default PostAddPage;
