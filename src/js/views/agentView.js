import View from './View.js';
import icons from 'url:../../img/icons.svg'; // Parcel 2

class AgentView extends View {
  _parentElement = document.querySelector('.agent');
  _errorMessage = 'We could not find that agent. Please try another one!';
  _message = '';

  addHandlerRender(handler) {
    ['hashchange', 'load'].forEach(ev => window.addEventListener(ev, handler));
  }

  addHandlerAddBookmark(handler) {
    this._parentElement.addEventListener('click', function(e) {
      const btn = e.target.closest('.btn--bookmark');
      if (!btn) return;
      handler();
    });
  }

  _generateMarkup() {
    return `
      <div class="agent-card">
        <div class="agent-card__header">
          <img src="${this._data.image}" alt="${this._data.name}" class="agent-card__img" />
          <div class="agent-card__title-author">
            <h2 class="agent-card__title">${this._data.name}</h2>
            <p class="agent-card__author">by ${this._data.publisher}</p>
          </div>
        </div>
        <div class="agent-card__body">
          <div class="agent-card__info">
            <p class="agent-card__language">Primary Language: ${this._data.language}</p>
            <div class="agent-card__stats">
              <span class="agent-card__stat">
                <svg class="agent-card__icon">
                  <use href="${icons}#icon-star"></use>
                </svg>
                ${this._data.stars} Stars
              </span>
              <span class="agent-card__stat">
                <svg class="agent-card__icon">
                  <use href="${icons}#icon-git-branch"></use>
                </svg>
                ${this._data.forks} Forks
              </span>
            </div>
          </div>
          <p class="agent-card__description">${this._data.description}</p>
          <div class="agent-card__features">
            <h3>Key Features:</h3>
            <ul>
              ${this._data.features ? this._data.features.map(feature => `<li>${feature}</li>`).join('') : 'No features listed'}
            </ul>
          </div>
        </div>
        <div class="agent-card__footer">
          <a href="${this._data.sourceUrl}" target="_blank" class="agent-card__btn">
            View on GitHub
          </a>
          <button class="btn--round btn--bookmark">
            <svg class="">
              <use href="${icons}#icon-bookmark${this._data.bookmarked ? '-fill' : ''}"></use>
            </svg>
          </button>
        </div>
      </div>
    `;
  }
}

export default new AgentView();
