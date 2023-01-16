export default class Search {
    constructor() {
        this._search = document.querySelector('.search');
        this._searchInput = document.querySelector('.search__input');
        this._searchButton = document.querySelector('.search__button');
        this._searchClose = document.querySelector('.search__close');
        this._searchOpen = document.querySelector('.search__open');
        this._searchOpen.addEventListener('click', this._openSearch.bind(this));
        this._searchClose.addEventListener('click', this._closeSearch.bind(this));
        this._searchButton.addEventListener('click', this._search.bind(this));
    }
    
    _openSearch() {
        this._search.classList.add('search--open');
        this._searchInput.focus();
    }
    
    _closeSearch() {
        this._search.classList.remove('search--open');
    }
    
    _search() {
        // Do something
    }
    }