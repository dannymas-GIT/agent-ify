import { async } from 'regenerator-runtime';
import { API_URL, RES_PER_PAGE } from './config.js';
import { getJSON, AJAX, sendJSON } from './helpers.js';

export const state = {
    agent: {},
    search: {
        query: '',
        results: [],
        page: 1,
        resultsPerPage: RES_PER_PAGE,
    },
    bookmarks: [],
};

const createAgentObject = function(data){
  return {
    id: data.id,
    name: data.name,
    publisher: data.owner.login,
    sourceUrl: data.html_url,
    image: data.owner.avatar_url,
    description: data.description,
    stars: data.stargazers_count,
    forks: data.forks_count,
    language: data.language,
  }
}

export const loadAgent = async function(id){
    try{
    const data = await getJSON(`https://api.github.com/repositories/${id}`);
    state.agent = createAgentObject(data);
    
    if(state.bookmarks.some(bookmark => bookmark.id === id))
      state.agent.bookmarked = true;
    else
      state.agent.bookmarked = false;
    }catch(err){
        console.error(`${err} 💥💥💥💥`);
        throw err;
    }
};

export const loadSearchResults = async function(query) {
  try {
    state.search.query = query;
    const data = await getJSON(`${API_URL}?q=${query}+topic:ai&sort=stars&order=desc&per_page=${RES_PER_PAGE}`);
    state.search.results = data.items.map(repo => {
      return {
        id: repo.id,
        name: repo.name,
        publisher: repo.owner.login,
        image: repo.owner.avatar_url,
      };
    });
    state.search.page = 1;
  } catch(err) {
    console.error(`${err} 💥💥💥💥`);
    throw err;
  }
}

export const getSearchResultsPage = function(page = state.search.page){
  state.search.page = page;
  const start = (page -1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;
  return state.search.results.slice(start, end);
}

export const addBookmark = function(agent){
  // Add bookmark
  state.bookmarks.push(agent);
  // Mark current agent as bookmarked
  if(agent.id === state.agent.id) state.agent.bookmarked = true;

  persistBookmarks();
}

export const deleteBookmark = function(id){
  // Delete bookmark
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);
  // Mark current agent as NOT bookmarked
  if(id === state.agent.id) state.agent.bookmarked = false;

  persistBookmarks();
}

const persistBookmarks = function(){
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
}

const init = function(){
  const storage = localStorage.getItem('bookmarks');
  if(storage) state.bookmarks = JSON.parse(storage);
}
init();

export const uploadAgent = async function(newAgent){
try{
    const agent = {
      name: newAgent.name,
      source_url: newAgent.sourceUrl,
      image_url: newAgent.image,
      publisher: newAgent.publisher,
      version: newAgent.version,
      license: newAgent.license,
      features: Object.entries(newAgent)
        .filter(entry => entry[0].startsWith('feature') && entry[1] !== '')
        .map(feature => feature[1]),
    };
    const data = await sendJSON(`${API_URL}?key=${KEY}`, agent);
    state.agent = createAgentObject(data);
    addBookmark(state.agent);
  }catch(err){
    throw err;
  }
}
