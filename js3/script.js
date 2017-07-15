

/**
 * Show posts
 */
var PostsDisplay = {
    POST_LIMIT: 10,
    visiblePostsQty: 0,
    xhr: new XMLHttpRequest(),
    url: 'https://raw.githubusercontent.com/MariannaMilovanova/pictures/master/myjson.json',
    array: null,
    filterArray: [],
    clickedTags: [],
    init: function() {
        this.request();
        this.onSearchEvent();
        this.onTagClickEvent();
    },
    request: function() {
        this.xhr.addEventListener("load", function(){
            var jsonPARSE = JSON.parse(this.responseText);
            this.onPostsLoad = PostsDisplay.onPostsLoad.bind(PostsDisplay);
            this.onPostsLoad(jsonPARSE);
        });
        this.xhr.open("GET", this.url);
        this.xhr.send();
    },
    onPostsLoad: function(jsonPARSE) {
        jsonPARSE.data.sort(this.sort);
        this.array = jsonPARSE.data;
        this.filterArray = this.array;

        this.showPosts(this.filterArray, this.POST_LIMIT);
    },
    showPosts: function(posts){
        var limit = this.visiblePostsQty;
        if(limit < this.array.length) {
            for(var i = limit; i < limit + this.POST_LIMIT; i++ ) {
                this.createHTML(posts[i]);
                this.visiblePostsQty++;
            }
            this.onScrollEvent();
        }
    },
    showFilterPosts: function(filterPosts) {
        this.visiblePostsQty = 0;
        for(var i = 0; i < filterPosts.length; i++ ) {
            this.createHTML(filterPosts[i]);
            this.visiblePostsQty++;
        }
    },
    createHTML: function(post){
        var postsSelector = document.getElementById('posts');

        var title = document.createElement('div');
        title.className = 'title';
        title.innerHTML = post.title;

        var description = document.createElement('div');
        description.className = 'description';
        description.innerHTML = post.description;

        var image = document.createElement('img');
        image.src = post.image;

        var createdAt = document.createElement('div');
        createdAt.className = 'createdAt';
        createdAt.innerHTML = this.formatDate(post.createdAt);

        var tags = document.createElement('div');
        tags.className = 'tags';
        for(var i = 0; i < post.tags.length; i++) {
            var tag = document.createElement('span');
            tag.innerHTML = post.tags[i];
            tags.appendChild(tag);
        }

        var postBlock = document.createElement('div');
        postBlock.className = 'block';
        postBlock.appendChild(image);
        postBlock.appendChild(title);
        postBlock.appendChild(description);
        postBlock.appendChild(createdAt);
        postBlock.appendChild(tags);

        postsSelector.appendChild(postBlock);
    },
    formatDate: function(date){
        var time = new Date(date)
        var dd = time.getDate();

        if (dd < 10) dd = '0' + dd;
        var mm = time.getMonth() + 1;
        if (mm < 10) mm = '0' + mm;
        var yy = time.getFullYear();

        return dd + '.' + mm + '.' + yy;
    },
    sort: function(objA, objB){
        var toTimeA = new Date(objA.createdAt);
        var toTimeB = new Date(objB.createdAt);
        return toTimeB.getTime() - toTimeA.getTime();
    },
    onScrollEvent: function() {
        window.addEventListener('scroll', this.onScrollAction.bind(this))
    },
    onScrollAction: function(){
        if ((document.documentElement.scrollTop + window.innerHeight)
            >= document.documentElement.scrollHeight) {
            if(this.filterArray.length > this.POST_LIMIT) {
                this.showPosts(this.filterArray);
            }
        }
    },
    onSearchEvent: function() {
        var search = document.getElementById('search');
        search.addEventListener('input', this.onSearchAction.bind(this));
    },
    onSearchAction: function(event){
        var term = event.target.value.toLowerCase();
        var posts = document.getElementById('posts');

        this.filterArray = [];
        posts.innerHTML = '';

        var _this = this;
        _this.filterArray= _this.array.filter(function(post) {
            var title = post.title.toLowerCase();

            if ( title.indexOf(term) > -1) {
                return post;
            }
        });

        this.showFilterPosts(this.filterArray);
    },
    onTagClickEvent: function() {
        var tagCollection = document.getElementsByClassName('click-tag');
        for(var i = 0; i < tagCollection.length; i++) {
            tagCollection[i].addEventListener('click', this.onTagClickAction.bind(this));
        }
    },
    onTagClickAction: function(event){
        var tagText = event.target.innerHTML.toLowerCase();
        var posts = document.getElementById('posts');
        var _this = this;
        if(event.target.className == "click-tag") {
            event.target.classList += ' active';
            this.clickedTags.push(tagText);
        } else {
            event.target.className = "click-tag";
            _this.clickedTags = _this.clickedTags.filter(function(tag){
                return tag != tagText;
            })
        }

        this.filterArray = [];
        posts.innerHTML = '';

        _this.filterArray= _this.array.filter(function(post) {
            var tags = post.tags;
            var isMatchQty = 0;
            for(var i = 0; i < _this.clickedTags.length; i++) {
                for(var j = 0; j < tags.length; j++) {
                    if (_this.clickedTags[i].toLowerCase() == tags[j].toLowerCase()) {
                        isMatchQty++;
                    }
                }
            }
            if(_this.clickedTags.length == isMatchQty) {
                return post;
            }

        });

        this.showFilterPosts(this.filterArray);
    }

};

document.addEventListener("DOMContentLoaded", function() {
    PostsDisplay.init();
});
