import * as model from './model.js';
import {MODAL_CLOSE_SEC} from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js'
import paginationView from './views/paginationView.js'
import bookmarksView from './views/bookmarksView.js'
import addRecipeView from './views/addRecipeView.js'
import agentView from './views/agentView.js';
import addAgentView from './views/addAgentView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime'; 
import { async } from 'regenerator-runtime';
import addRecipeView from './views/addRecipeView.js';


///////////////////////////////////////
const controlRecipes = async function(){
  
  try {
    // debugger;
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();

  // 0. Update search results to mark selected search result
  resultsView.update(model.getSearchResultsPage())

  // 1. Updating bookmarks view
  bookmarksView.update(model.state.bookmarks)
  // 2. Loading Recipe
  await model.loadRecipe(id);
  const { recipe } = model.state;
    
  // 3. Rendering recipe
   recipeView.render(model.state.recipe);
  }catch(err){
    recipeView.renderError();
    console.log(err)
  }
};


const controlSearchResults = async function() {
  try {
    resultsView.renderSpinner();

    // 1) Get search query
    const query = searchView.getQuery();
    if (!query) return;

    // 2) Load search results
    await model.loadSearchResults(query);

    // 3) Render results
    resultsView.render(model.getSearchResultsPage());

    // 4) Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.error(err);
  }
};

const controlServings = function(newServings){
// Update the recipe servings (in state )
 model.updateServings(newServings)

// Update the recipe view
recipeView.update(model.state.recipe); 
}

const controlPagination = function(goToPage){
  // 3. Render NEW results
   resultsView.render(model.getSearchResultsPage(goToPage));  

  // 4. Render NEW pagination buttons
  paginationView.render(model.state.search)
}

const controlBookmarks = function(){
  bookmarksView.render(model.state.bookmarks)
}

const controlAddBookmark = function(recipe){
  // 1. Add or remove bookmarks
  if(!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe)
  else model.deleteBookmark(model.state.recipe.id)

  
  // 2. Update recipe view
  recipeView.update(model.state.recipe);

  // 3. Render bookmarks
  bookmarksView.render(model.state.bookmarks)
}

const controlAddRecipe = async function(newRecipe){
  try{
    addRecipeView.renderSpinner();
   // Upload the new recipe
   await model.uploadRecipe(newRecipe)
   console.log(model.state.recipe);

   // Render recipe
   recipeView.render(model.state.recipe) 

   // Success message
   addRecipeView.renderMessage();

   // Render Bookmark View
   bookmarksView.render(model.state.bookmarks);

   // Change ID in URL
   window.history.pushState(null, '', `${model.state.recipe.id}`)


   // Close form Window
   setTimeout(function(){
    addRecipeView.toggleWindow();
   }, MODAL_CLOSE_SEC * 1000)

  }catch(err){
    console.error('💥💥💥', err);
    addRecipeView.renderError(err.message)
  }
}

const controlAgent = async function() {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    agentView.renderSpinner();

    // 1) Loading agent
    await model.loadAgent(id);

    // 2) Rendering agent
    agentView.render(model.state.agent);
  } catch (err) {
    agentView.renderError();
    console.error(err);
  }
};

const controlAddAgent = async function(newAgent){
  try{
    // Show loading spinner
    addAgentView.renderSpinner();

    // Upload the new agent data
    await model.uploadAgent(newAgent);

    // Render agent
    agentView.render(model.state.agent);

    // Success message
    addAgentView.renderMessage();

    // Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // Change ID in URL
    window.history.pushState(null, '', `#${model.state.agent.id}`);
  } catch (err) {
    console.error('💥', err);
    addAgentView.renderError(err.message);
  }
};

const init = function(){
   bookmarksView.addHandlerRender(controlBookmarks)
   recipeView.addHandlerRender(controlRecipes);
   recipeView.addHandlerUpdateServings(controlServings);
   recipeView.addHandlerAddBookmark(controlAddBookmark);
   searchView.addHandlerSearch(controlSearchResults);
   paginationView.addHandlerClick(controlPagination);
   addRecipeView.addHandlerUpload(controlAddRecipe);
   agentView.addHandlerRender(controlAgent);
   agentView.addHandlerAddBookmark(controlAddBookmark);
   addAgentView.addHandlerUpload(controlAddAgent);
  
   
}
init();
