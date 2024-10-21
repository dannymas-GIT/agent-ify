import * as model from './model.js';
import {MODAL_CLOSE_SEC} from './config.js';
import agentView from './views/agentView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js'
import paginationView from './views/paginationView.js'
import bookmarksView from './views/bookmarksView.js'
import addAgentView from './views/addAgentView.js'

import 'core-js/stable';
import 'regenerator-runtime/runtime'; 
import { async } from 'regenerator-runtime';

///////////////////////////////////////
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

const controlPagination = function(goToPage) {
  // 1) Render NEW results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // 2) Render NEW pagination buttons
  paginationView.render(model.state.search);
};

const controlAddBookmark = function(agent) {
  // 1) Add/remove bookmark
  if (!model.state.agent.bookmarked) model.addBookmark(model.state.agent);
  else model.deleteBookmark(model.state.agent.id);

  // 2) Update agent view
  agentView.update(model.state.agent);

  // 3) Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function() {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddAgent = async function(newAgent) {
  try {
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

    // Close form window
    setTimeout(function() {
      addAgentView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('💥', err);
    addAgentView.renderError(err.message);
  }
};

const init = function() {
  bookmarksView.addHandlerRender(controlBookmarks);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  agentView.addHandlerRender(controlAgent);
  agentView.addHandlerAddBookmark(controlAddBookmark);
  addAgentView.addHandlerUpload(controlAddAgent);
};
init();
