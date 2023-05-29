import { Block, Button, Icon, Link, List, ListGroup, ListInput, ListItem, NavRight, Navbar, Page, SwipeoutActions, SwipeoutButton, f7, theme, } from "framework7-react";
import { Dom7, getDevice } from "framework7";
import React,{useEffect, useState} from "react";

const $$=Dom7;
const NewRecipePage=()=>{
const device=getDevice();
const isMobile=device.ios||device.android;

const [ingredients,setIngredients]=useState([])
const handleBackClick=()=>{
//     f7.dialog.alert('Are you sure')
}


/**
 * 
 * @param {KeyboardEvent} evt 
 */
function handleIngredientsAdd(evt){
        console.log({evt});
if(evt.key==='Enter' && !evt.shiftKey){
const {value}=evt.target;
console.log({value});
setIngredients((prev)=>([...prev,{media:'',text:value}]));
console.log({ingredients});
evt.target.value=''
}
}

useEffect(()=>{
        const ingredientInput=$$('.rt-ingredient-input')
        ingredientInput.on('keydown',handleIngredientsAdd)

return ()=>ingredientInput.off('keydown',handleIngredientsAdd)
},[])
useEffect(()=>{

},[ingredients])
    return (<Page name="new-recipe">
<Navbar outline onBackClick={handleBackClick} backLink={isMobile && 'Back'} title="Add Recipe">
<NavRight style={{paddingRight:'1rem'}}>
    <Button fill round style={{minWidth:'5rem'}}>Save</Button>
</NavRight>
</Navbar>

    <List className="rt-list">
        <ListItem groupTitle title={'Title'} className="rt-list-title"  />
        <ListInput className="rt-list-input" name="title"  placeholder="Give your recipe a name" outline={theme.md}/>
    
        <ListItem className="rt-list-title" groupTitle title={'Description'}/>
        <ListInput className="rt-list-input" name="description" type="textarea" outline={theme.md} placeholder="Introduce your recipe, add notes, cooking tips..."/>

<List mediaList className="mt-2 mb-2">
           <ListItem  className="rt-list-title" groupTitle title={'Ingredients'}/>  
        {
                ingredients.length > 0 && 
ingredients.map((ingredient,index)=>{

      return  <ListItem key={index} media={ingredient?.media?ingredient?.media:null}  noChevron link swipeout title={ingredient?.text}>
    <SwipeoutActions right>
            <SwipeoutButton delete>
              Delete
            </SwipeoutButton>
          </SwipeoutActions> 
          {!ingredient?.media
          
          &&
          <Icon slot="media" className="material-symbols-rounded material-fill" material="shopping_basket" />   
          } 
    </ListItem>
})
}
</List>
        <ListGroup>
        <ListInput className="rt-list-input rt-ingredient-input" clearButton  outline={theme.md} placeholder="Add or paste ingredients" /> 
<Block className="mt-2 mb-0">

        <Link className="ov-hidden">
        <Icon className="material-symbols-rounded" material="add"/>
        Add Header
        </Link>
</Block>
        </ListGroup>

<List mediaList className="mt-2 mb-2">
        <ListItem className="rt-list-title" groupTitle title={'Instructions'}/>  
        {
                ingredients.length > 0 && 
ingredients.map((ingredient,index)=>{

      return  <ListItem key={index} media={ingredient?.media?ingredient?.media:null}  noChevron link swipeout title={ingredient?.text}>
    <SwipeoutActions right>
            <SwipeoutButton delete>
              Delete
            </SwipeoutButton>
          </SwipeoutActions> 
          {!ingredient?.media
          
          &&
          <Icon slot="media" className="material-symbols-rounded material-fill" material="restaurant" />   
          } 
    </ListItem>
})
}
</List>
        <ListGroup>
        <ListInput className="rt-list-input" clearButton   outline={theme.md}placeholder="Add or paste instructions" /> 
<Block className="mt-2 mb-0">

        <Link className="ov-hidden">
        <Icon className="material-symbols-rounded" material="add"/>
        Add Header
        </Link>
</Block>
        </ListGroup>
    </List>
    </Page>)
}

export default NewRecipePage