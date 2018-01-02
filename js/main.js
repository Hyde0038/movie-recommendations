const app = {
    pages: [],
    show: new Event('show'),
    baseURL: 'https://api.themoviedb.org/3/',
    APIKEY: '810923ab26ac00d5d69b33271d2985f7',
    baseImageURL: 'https://image.tmdb.org/t/p',
    configData: null,
    activePage: null,
    keyword: null,
    movie_id: 0,
    title: '',
    
    
    init: function () {
        app.pages = document.querySelectorAll('.page');
        app.getConfig();
        app.displayViews("newSearch")
        document.querySelector('.searchInput').focus();
        document.querySelector('.searchButton').addEventListener('click', app.runSearch);
        document.querySelector('.searchInput').addEventListener('keypress', function (ev) {
            let char = ev.char || ev.charCode || ev.which;
            if (char == 10 || char == 13) {
                document.querySelector('.searchButton').dispatchEvent(new MouseEvent('click'));
            }
        });
    }, 

    getConfig: function () {
        
        let url = "".concat(app.baseURL, 'configuration?api_key=', app.APIKEY);
        app.keyword = document.getElementById('keyword').value;
        
        fetch(url)
            .then((result) => {
                return result.json();
            })
            .then((data) => {
                baseImageURL = data.images.secure_base_url;
                configData = data.images;
            })
            .catch(function (err) {
                alert(err);
            });
    },

    runSearch: function () {
        app.showLoading();
        let keyword = document.querySelector('.searchInput').value;
        

        let url = ''.concat(app.baseURL, 'search/movie?api_key=', app.APIKEY, '&query=', keyword);
        let titleSection = document.getElementById("resultHeader");      

        var emptyResultHeader = document.querySelector("#resultHeader"); 
        while (emptyResultHeader.firstChild) {
            emptyResultHeader.removeChild(emptyResultHeader.firstChild);
        }
        
        var emptySearchResult = document.querySelector("#movieList"); 
        while (emptySearchResult.firstChild) {
            emptySearchResult.removeChild(emptySearchResult.firstChild);
        }
                
        app.displayViews("listResults");

        fetch(url)
            .then(result => result.json())
            .then((data) => {

                let movies = data.results;
                let resultCount = movies.length;

                let p = document.createElement('p');
                p.id = "resultsTitle";
                p.innerHTML = "Your search includes " + resultCount + " results";
                document.getElementById("resultHeader").appendChild(p);
                //app.appendElement(titleSection, p);
                let df = document.createDocumentFragment();
                let section = document.getElementById("movieList");
                movies.forEach(function (results) {
                    
                   
                    let recMovie = results.title
                    
                    let div = document.createElement('div');
                    div.className = "movie";
                    div.id = results.id;
                    div.setAttribute('data-movie', results.id);
                    //let thisID = results.id;
                    
                    
                    div.addEventListener('click', function() { 
                            var thisID = results.id; 
                            app.runRecommendations(thisID);
                            app.displayViews("listRecs");
                            },
                            false);
                                        
                    var img = document.createElement('img');
                    let h2 = document.createElement('h2');
                    let span = document.createElement('span');
                    let p = document.createElement('p');

                    let relDate = new Date(results.release_date);
                    let relDate2 = relDate.getFullYear();
                    if (isNaN(relDate2)) {
                        span.innerHTML = "";
                    } else {
                        span.innerHTML = ": " + relDate2;
                    }

                    var tempPath = results.poster_path;

                    imagePath = app.baseImageURL + "/w185" + results.poster_path;
                    img.src = imagePath;
                    img.className = "poster"

                    if (!tempPath) {
                        imagePath = "/noImagePath";
                        img.src = "https://www.allstar-fencing.co.uk/jpg/productimages/thumbs/No-Image.jpg"; 
                    }

                    h2.className = "movie-title";
                    h2.innerHTML = results.title;
                    p.className = "movie-desc";
                    p.innerHTML = results.overview;
                    span.className = "year";
                    
                    div.appendChild(img);
                    div.appendChild(h2);
                    h2.appendChild(span);
                    div.appendChild(p);
                    
                    df.appendChild(div);

                });
                section.appendChild(df);
                app.hideLoading();

            });
        
    },  
    
     runRecommendations: function (ID) {
         app.showLoading();
         
        var emptyResultHeader = document.querySelector("#recommendationHeader"); 
        while (emptyResultHeader.firstChild) {
            emptyResultHeader.removeChild(emptyResultHeader.firstChild);
        }
        
        var emptySearchResult = document.querySelector("#recMovieList"); 
        while (emptySearchResult.firstChild) {
            emptySearchResult.removeChild(emptySearchResult.firstChild);
        }
                
          
        let titleSection = document.getElementById("recommendationHeader");
        let section = document.getElementById("recMovieList");
        let url = ''.concat(app.baseURL,'movie/',ID, '/recommendations?api_key=', app.APIKEY);
   
         fetch(url)
            .then(result => result.json())
            .then((data) => {
                let movies = data.results;
                let resultCount = movies.length;

                let p = document.createElement('p');
                p.id = "resultsTitle";
                p.innerHTML = "Here are " + resultCount + " recommendations";
                document.getElementById("recommendationHeader").appendChild(p);
                let df = document.createDocumentFragment();
                let section = document.getElementById("recMovieList");
                movies.forEach(function (results) {
                    
                   let recMovie = results.title
                    
                    let div = document.createElement('div');
                    div.className = "movie";
                    div.id = results.id;
                    div.setAttribute('data-movie', results.id);
                    
                    var img = document.createElement('img');
                    let h2 = document.createElement('h2');
                    let span = document.createElement('span');
                    let p = document.createElement('p');

                    let relDate = new Date(results.release_date);
                    let relDate2 = relDate.getFullYear();
                    if (isNaN(relDate2)) {
                        span.innerHTML = "";
                    } else {
                        span.innerHTML = ": " + relDate2;
                    }

                    var tempPath = results.poster_path;

                    imagePath = app.baseImageURL + "/w185" + results.poster_path;
                    img.src = imagePath;
                    img.className = "poster"

                    if (!tempPath) {
                        imagePath = "/noImagePath";
                        img.src = "https://www.allstar-fencing.co.uk/jpg/productimages/thumbs/No-Image.jpg"; 
                    }

                    h2.className = "movie-title";
                    h2.innerHTML = results.title;
                    p.className = "movie-desc";
                    p.innerHTML = results.overview;
                    span.className = "year";
                    
                    div.appendChild(img);
                    div.appendChild(h2);
                    h2.appendChild(span);
                    div.appendChild(p);
                    
                    df.appendChild(div);

                });
                section.appendChild(df);
                app.hideLoading();
            });
    },

      displayViews: function (currentPage) {
        
        let thisPage = currentPage;
        
        console.log("displayviews thinks the current page is " +thisPage)
        
        if (thisPage == "listResults") {
            
            document.getElementById('appTitle').style.display = 'none';
            document.getElementById('searchResults').style.display = 'block';
            document.getElementById('recommendations').style.display = 'none';
            document.getElementById('backButton').style.display = 'inline-block';
            
            document.querySelector('#backButton').addEventListener('click', function() { 
                            console.log('Button should go back to empty search page');
                            app.displayViews("newSearch");
                            },
                            false);
            }
        else if (thisPage == "listRecs") {
            
            document.getElementById('appTitle').style.display = 'none';
            document.getElementById('searchResults').style.display = 'none';
            document.getElementById('recommendations').style.display = 'block';
            document.getElementById('backButton').style.display = 'inline-block';
            
             document.querySelector('#backButton').addEventListener('click', function() { 
                            console.log('Button should go back to search results');
                            app.displayViews("listResults");
                            },
                            false);
        }
        else if (thisPage == "newSearch") {
            
            document.getElementById('appTitle').style.display = 'block';
            document.getElementById('searchResults').style.display = 'none';
            document.getElementById('recommendations').style.display = 'none';
            document.getElementById('backButton').style.display = 'none';
        }
        
          
        let SRstatus = document.getElementById('searchResults').style.display;
        console.log("search results display status is " +SRstatus)
        let RECstatus = document.getElementById('recommendations').style.display;
        console.log("recommendations display status is "+RECstatus)
  
      },

    showLoading: function () {
        
        document.getElementById('loading').style.display = "block";
        
        
    },

    hideLoading: function () {
        document.getElementById('loading').style.display = "none";
        
    },
 
    
    //Code to add html elements
    createNode: function (element) {
        return document.createElement(element);
    },
    
    appendElement: function (parent, el) {
        let parentElement = parent;
        let childElement = el
        return parent.appendChild(childElement);
    },
    
 

}


window.addEventListener('DOMContentLoaded', app.init);
