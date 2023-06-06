import { List, ListInput, ListItem, Page } from 'framework7-react';
import React from 'react';

const NewPostPage = () => {
    return (
        <Page name="new-post">
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

export default NewPostPage;
