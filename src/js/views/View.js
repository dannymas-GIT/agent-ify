import icons from 'url:../../img/icons.svg';
import { Fraction } from 'fracty';
import { isArray } from 'core-js/stable/array';


export default class View {
    _clear() { this._parentElement.innerHTML = '' }
    _data;
     
      /**
       * Render the recieved objec to the DOM
       * @param {Object | Object[]} data The data to be rendered (ie Recipe)
       * @param {boolean} [render = true] If false, create markUp string instead of rendering to the DOM
       * @returns {undefined | string} A markup string is returned if render = false
       * @this {object} View instance
       * @author Danny Mas
       * @todo 1. Paginate Bookmark View.
       * @todo 2. Resolve slice error messages.
       * @todo 3. Get working on mashomesny.com
       * @todo 4. Shopping list feature, capture ingredients of recipe and add to an array that can be printed.
       * @todo 5. Add total number of pages between pagination buttons
       * @todo 6. Spoonacular get nutritional information
       * 
       */
        render(data, render = true){
        if(!data || (Array.isArray(data) && data.length === 0))
         return this.renderError();

        this._data = data;
        const markup = this._generateMarkup();
        
         if(!render) return markup

        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup)
        }
        update(data){
        this._data = data;
        const newMarkup = this._generateMarkup();

        const newDOM = document.createRange().createContextualFragment(newMarkup)
        const newElements = Array.from(newDOM.querySelectorAll('*'));
        const curElements = Array.from(this._parentElement.querySelectorAll('*'));
        // console.log(curElements);
        // console.log(newElements);

        newElements.forEach((newEl, i) => {
          const curEl = curElements[i];
          // console.log(curEl, newEl.isEqualNode(curEl));
          // Updates changed TEXT
          // console.log('💥💥😲', newE1.firstChild.nodeValue);
          if(
            !newEl.isEqualNode(curEl) &&
            newEl.firstChild?.nodeValue.trim() !== ''
            ){
            curEl.textContent = newEl.textContent;
          }
          // Updates changed ATTRIBUTES
          if(!newEl.isEqualNode(curEl))
          Array.from(newEl.attributes).forEach(attr => 
            curEl.setAttribute(attr.name, attr.value)
            );
        });
        }
      
        renderSpinner(){
            const markUp = `<div class="spinner">
            <svg>
              <use href="${icons}#icon-loader"></use>
            </svg>
          </div> `;
          this._clear(); 
          this._parentElement.insertAdjacentHTML('afterbegin', markUp)
          }
          renderError(message = this._errorMessage){
            const markUp = `
            <div class="error">
                <div>
                  <svg>
                    <use href="${icons}#icon-alert-triangle"></use>
                  </svg>
                </div>
                <p>${message}</p>
              </div> 
        `;
        this._clear(); 
        this._parentElement.insertAdjacentHTML('afterbegin', markUp)
        }   
    
        renderMessage(message = this._message){
            const markUp = `
            <div class="message">
                <div>
                  <svg>
                    <use href="${icons}#icon-smile"></use>
                  </svg>
                </div>
                <p> ${message}</p>
              </div> 
        `;
        this._clear(); 
        this._parentElement.insertAdjacentHTML('afterbegin', markUp)
        }
      }
    
       