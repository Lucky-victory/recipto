import { Block, Navbar, Page, Preloader } from 'framework7-react';
import React from 'react';
import { format } from 'date-fns';
import '../../css/post.scss';
import PostCardHeader from '../../components/post-card-header';
import { useDispatch, useSelector } from 'react-redux';
import isEmpty from 'just-is-empty';
import { fetchOnePost } from '../../js/state/slices/post';
const PostViewPage = ({ f7router }) => {
    const dispatch = useDispatch();
    const { data: post, loading: postLoading } = useSelector(
        (state) => state.post.one
    );

    function onPageBeforeIn() {
        if (isEmpty(post)) {
            const postId = f7router.currentRoute.params?.id;
            console.log({ postId });
            dispatch(fetchOnePost(postId));
        }
    }
    return (
        <Page
            name="post-view"
            className="custom-bg"
            onPageBeforeIn={onPageBeforeIn}
        >
            <Navbar backLink></Navbar>
            {!postLoading && !isEmpty(post) ? (
                <div className="">
                    <PostCardHeader
                        showTime={false}
                        avatarSize={46}
                        recipeOrPost={post}
                        showMoreBtn={false}
                    />

                    <Block className="mt-0 text-md">
                        {post?.text}
                        {post?.photo && (
                            <div className="rt-post-img-wrap mt-4">
                                <img src={post?.photo} />
                            </div>
                        )}
                        <Block strong className="radius-sm">
                            <div className="mb-2 text-md">
                                <span className="text-bold">0</span>{' '}
                                <span className="text-grey ">Likes</span>
                            </div>
                            <div className="text-bold">
                                <span className="text-grey ">Posted:</span>{' '}
                                <span>
                                    {format(
                                        new Date(post?.created_at),
                                        'd MMM, y, h:m aaa'
                                    )}
                                </span>
                            </div>
                        </Block>
                    </Block>
                </div>
            ) : (
                <div className="flex jc-center ai-center">
                    <Preloader size={50} />
                </div>
            )}
        </Page>
    );
};

export default PostViewPage;
