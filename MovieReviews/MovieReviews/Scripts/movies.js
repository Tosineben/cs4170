
(function (module) {

    module.search = {

        init: function (settings) {
            var self = this;
            self.settings = settings;

            $('#navSearchButton').click(function () {
                $('#navSearchButton').button('loading');

                var query = $('#navSearchQuery').val().trim().replace(/ /g, '+');

                if (query == '') {
                    // no search
                    return;
                }

                // no offset for initial query
                self.search = { query: query, offset: 0 };
                self.doSearch(); 
            });

            $('.page-number').live('click', function(event) {
                // keep all the same search data, use new offset
                self.search.offset = parseInt($(event.target).attr('data-offset'));
                self.doSearch();
            });
            
            $('.reviewer-bio').live('click', function (event) {
                var name = $(event.target).text();
                var movieId = $(event.target).attr('data-id');
                var url = self.settings.getBioUrl(name);
                var proxyUrl = "proxy.php?url=" + encodeURIComponent(url);
                $.getJSON(proxyUrl, function (rawResponse) {
                    var resp = jQuery.parseJSON(rawResponse);
                    var bio = self.getBioForDisplay(resp.results[0]);
                    $('#reviewer-bio-modal-' + movieId).mustache('biography', bio, {method:'html'});
                });
            });
        },

        doSearch: function(exactMatch) {
            var self = this;

            if (exactMatch) {
                self.search.query = "'" + self.search.query + "'";
            }

            var url = self.settings.getSearchUrl(self.search.query, self.search.offset, self.search.criticsPick, self.search.thousandBest, 
                                                 self.search.dvd, self.search.reviewer, self.search.pubDate, self.search.openDate);

            var proxyUrl = "proxy.php?url=" + encodeURIComponent(url);

            $.getJSON(proxyUrl, function (rawResponse) {

                var resp = jQuery.parseJSON(rawResponse);

                // close any open alerts if user hasn't yet
                $('.alert').alert('close');

                // reset search button now that search is complete
                $('#navSearchButton').button('reset');

                if (resp && resp.status == "OK") {
                    // scroll page to top of movie list, slowly
                    var top = $('#movie-list-separator').position().top - 40;
                    $("html, body").animate({ scrollTop: top }, "slow");
                    
                    self.displayPageNumbers(resp.num_results, self.search.offset);
                    self.displaySearchResults(resp.results);
                    self.fixUpMovieHeights();
                }
                else {
                    self.displayAlert('Looks like the New York Times Movie Reviews API might be down, please try again later.');
                }
            });
        },
        
        displayAlert: function (alertMsg) {
            $('#primaryContainer').mustache('alert', { message: alertMsg }, { method: 'prepend' });
            $('.alert').alert();
            
            // scroll page to top so user can see error message
            $("html, body").animate({ scrollTop: 0 }, "slow");
        },

        displaySearchResults: function(results){
            var self = this;

            if (!results || results.length == 0) {
                self.displayAlert('Your search returned no results. Try searching for something less specific.');
                return;
            }

            var topResult = self.getMovieForDisplay(results[0]);

            var primary = $('#primaryMovie');
            primary.children('h1').html(topResult.title);

            var chunkSize = 4;
            var chunks = [];
            for (var i = 0, j = results.length; i < j; i += chunkSize) {
                var movies = $.map(results.slice(i, i + chunkSize), function(movie) {
                    return self.getMovieForDisplay(movie);
                });
                chunks.push({ movies: movies });
            }

            var movieList = $('#movie-list');

            movieList.html('');

            $.each(chunks, function(index, chunk) {
                movieList.mustache('movie-row', chunk);
            });

            // initialize all the modals for detailed movie info
            $('.modal').modal({
                show: false
            });
        },
        
        fixUpMovieHeights: function () {

            var maxHeight = 0;

            $('#movie-list').children('.row-fluid').children('.span3').children('.well').each(function(index, movie) {
                var height = $(movie).height();
                if (height > maxHeight) {
                    maxHeight = height;
                }
            });

            $('#movie-list').children('.row-fluid').children('.span3').children('.well').each(function(index, movie) {
                $(movie).height(maxHeight);
            });
        },
        
        displayPageNumbers: function (numResults, offset) {
            var moviesPerPage = 20;
            var pageList = $('#pagination-list');
            pageList.show();

            if (numResults <= moviesPerPage) {
                // we only have one page of data, so hide pages and we're done
                pageList.hide();
                return;
            }

            // make sure offset is a multiple of moviesPerPage
            offset = moviesPerPage * Math.floor(offset / moviesPerPage);

            var numPages = Math.floor(numResults / moviesPerPage);
            var activePage = offset / moviesPerPage;

            var prevPage = { offset: offset - moviesPerPage, numDisplay: '&larr; Prev', disabled: activePage == 0 };
            var nextPage = { offset: offset + moviesPerPage, numDisplay: 'Next &rarr;', disabled: activePage == numPages };

            var pages = [ prevPage ];

            for (var i = 0; i <= numPages; i++) {
                var page = { offset: i * moviesPerPage, numDisplay: i + 1, active: i == activePage };
                pages.push(page);
            }

            pages.push(nextPage);

            pageList.mustache('page-numbers', {pages:pages}, { method: 'html' });
        },

        getMovieForDisplay: function (movie) {
        return {
            title: movie.display_title,
            headline: movie.headline,
            summary: movie.summary_short,
            imgSrc: ((movie.multimedia || {}).resource || {}).src || 'http://www.worldimpex.com/images/no_image_available.gif',
            reviewerName: movie.byline,
            reviewPubDate: moment(movie.publication_date).format('MMM Do YYYY'),
            openedInTheatresDate: movie.opening_date ? moment(movie.opening_date).format('MMM Do YYYY') : null,
            dvdReleaseDate: movie.dvd_release_date ? moment(movie.dvd_release_date).format('MMM Do YYYY') : null,
            isCriticsPick: movie.critics_pick == 1,
            isThousandBest: movie.thousand_best == "1",
            reviewSnippet: movie.capsule_review,
            reviewUrl: movie.link.url,
            movieId: movie.nyt_movie_id,
            relatedUrls: movie.related_urls
        };
    },

        getBioForDisplay: function (biography) {
            return {
                reviewerName: biography.display_name,
                bioText: biography.bio || 'Sorry, New York Times does not have any information about ' + biography.display_name,
            };
        }

    };

})(adq.module('movieReviews'));



//** up to 3 of the following FILTERS - omit for all
//query - keywords; matches titles and indexed terms =wild+west or ='wild+west' for exact match
//critics-pick (Y/N) 
//thousand-best (Y/N) - 1000 best movies ever
//dvd (Y/N) - released on dvd yet
//reviewer - 'manohla-dargis'
//publication-date - of review, start and end date: YYYY-MM-DD;YYYY-MM-DD
//opening-date - of movie in NY, single date: YYYY-MM-DD

//relatedUrl types overview, showtimes, awards, community, trailers