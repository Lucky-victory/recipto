
import { Block, Button, Card, CardContent, CardFooter, CardHeader, Icon, Link } from 'framework7-react'
import isEmpty from 'just-is-empty'
import React from 'react'

const PostCard = ({post}) => {
  return (
    <Card className="rt-card">
    <CardHeader className="rt-card-header">
      <div className="flex jc-center ">
        <Link
          href="#"
          // add link to user profile
          className="rt-card-header-link flex jc-center ov-hidden flex-grow"
        >
          <img
            src={post.user?.avatar}
            loading="lazy"
            alt=""
            className="rt-avatar"
          />
          <div className=" ml-4">
            <div className="text-bold rt-card-header-name">
              {post.user?.fullname}
            </div>
            <span className="text-grey text-sm">1h</span>
          </div>
        </Link>
      </div>
      <Link href="#"  iconOnly>
        <Icon
          material="more_vert"
          className="material-symbols-rounded"
        ></Icon>
      </Link>
    </CardHeader>

        <Block className='text-md'>
          {post.text||''}
        </Block>

        {
          (post.photo||post.has_recipe )&&

    <CardContent  className="rt-card-content">
      <Link href='/about/' className="rt-card-content-inner">

        <div className="rt-card-img-wrap">
          {(isEmpty(post.photo) && post.has_recipe) && (
            <div className="rt-img-placeholder">
              <span>{post.recipe?.title}</span>
            </div>
          )}
          {post.photo && 
            <img
              src={post?.photo}
              alt=""
              loading="lazy"
              className="rt-card-img"
            />
          }
          {(isEmpty (post.photo) && post.recipe?.photo) && (
            <img hidden
              src={post.recipe?.photo}
              alt=""
              loading="lazy"
              className="rt-card-img"
            />
          )}
        </div>
        </Link>
        {post.has_recipe && (
<div className="rt-card-content-footer">

          
          <div className="rt-card-content-title">
            <span className="text-bold">{post.recipe?.title}</span>
          </div>
          <Button style={{maxWidth:'3rem'}} type='button' round iconOnly>
            <Icon material="bookmark" className="material-symbols-rounded"/>
          </Button>
</div>
        )}
    </CardContent>
    }
    
      <Block className="mt-4 mb-4">
        {post.likes_count > 0 &&
<Block className="text-grey text-bold text-md">


      { post.likes_count+' Likes'}
</Block>
}

      </Block>

    <CardFooter className="rt-card-footer">
      <Button round>
        <Icon
          className="material-symbols-rounded"
          material="thumb_up"
        />
      </Button>
      <Button round>
        <Icon
          className="material-symbols-rounded"
          material="chat"
          />
      </Button>
      <Button round>
        <Icon
          className="material-symbols-rounded"
          md="material:share"
          ios="material:ios_share"
        />
      </Button>
    </CardFooter>
  </Card>
  )
}

export default PostCard