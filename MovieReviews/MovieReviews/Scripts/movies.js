var adq = adq || {};

(function (module) {

    module.movieReviews = {

        init: function (settings) {
            var self = this;
            self.settings = settings;

            // show/hide the advanced/quick search
            $('#advancedSearchLink').click(function() {
                $(this).hide();
                $('#quickSearchLink').show();
                $('#advancedSearch').slideDown();
            });

            $('#quickSearchLink').click(function () {
                $(this).hide();
                $('#advancedSearchLink').show();
                $('#advancedSearch').slideUp();
            });

            $('#mainSearch-button').click(function () {
                var queryObj = $('#mainSearch-query');
                
                var query = queryObj.val().trim().replace(/ /g, '+');
                var criticsPick = $('#mainSearch-criticsPick').is(':checked');
                var start = moment($('#mainSearch-start').val());
                var end = moment($('#mainSearch-end').val());

                if (query == '') {
                    queryObj.parents('.control-group').addClass('error');
                    queryObj.parents('.control-group').find('.add-on').removeClass('hidden');
                    queryObj.attr('placeholder', 'Please enter a keyword to search');
                    return;
                }

                // clear any previous errors from the form
                queryObj.parents('.control-group').removeClass('error');
                queryObj.parents('.control-group').find('.add-on').addClass('hidden');
                queryObj.attr('placeholder', 'Search by title or keyword...');

                // no offset for initial query
                self.search = { query: query, offset: 0 };

                if (criticsPick) {
                    self.search.criticsPick = "Y";
                }

                if (start || end) {
                    if (!start) {
                        start = moment('1850-1-1');
                    }
                    if (!end) {
                        end = moment();
                    }

                    self.search.openDate = start.format("YYYY-MM-DD") + ';' + end.format("YYYY-MM-DD");
                }

                self.doSearch(); 
            });

            // when page num is clicked, keep all the same search data, use new offset
            $('.page-number').live('click', function(event) {
                self.search.offset = parseInt($(event.target).attr('data-offset'));
                self.doSearch();
            });
            
            $('.reviewer-bio').live('click', function (event) {
                var name = $(event.target).text();
                var movieId = $(event.target).attr('data-id');
                var url = self.settings.getBioUrl(name);
                var proxyUrl = "proxy.php?url=" + encodeURIComponent(url);
                $.getJSON(proxyUrl, function (rawResponse) {
                    var resp = $.parseJSON(rawResponse);
                    var bio = self.getBioForDisplay(resp.results[0]);
                    $('#reviewer-bio-modal-' + movieId).mustache('biography', bio, {method:'html'});
                });
            });
        },

        doSearch: function() {
            var self = this;

            // change search button to loading status
            $('#mainSearch-button').button('loading');

            // disable page numbers to make it clear that we're in the middle of searching
            $.each($('.page-number'), function (index, pageNumber) {
                $(pageNumber).parent().addClass('disabled');
            });

            var url = self.settings.getSearchUrl(self.search.query, self.search.offset, self.search.criticsPick, self.search.openDate);
            var proxyUrl = "proxy.php?url=" + encodeURIComponent(url);

            $.getJSON(proxyUrl, function (rawResponse) {

                var resp = $.parseJSON(rawResponse);

                // close any open alerts if user hasn't yet
                $('.alert').alert('close');

                // reset search button now that search is complete
                $('#mainSearch-button').button('reset');

                if (resp && resp.status == "OK") {
                    if (!resp.results || resp.num_results == 0) {
                        self.displayAlert('Your search returned no results. Try searching for something less specific.', false);

                        // keep the previous search so page numbers from existing results work
                        self.search = self.lastSearch; 
                        self.displayPageNumbers(self.lastSearch.num_results, self.lastSearch.offset);
                    }
                    else {
                        self.displayPageNumbers(resp.num_results, self.search.offset);
                        self.displaySearchResults(resp.results);
                        self.fixUpMovieHeights();
                        self.lastSearch = self.search;
                        self.lastSearch.num_results = resp.num_results;
                    }
                }
                else {
                    self.displayAlert('Looks like the New York Times Movie Reviews API might be down, please try again later.', true);
                }
            });
        },
        
        displayAlert: function (alertMsg, scroll) {
            $('#alertContainer').mustache('alert', { message: alertMsg }, { method: 'html' });
            $('.alert').alert();
            
            if (scroll) {
                // scroll page so user can see error
                var top = $('#alertContainer').position().top - 20;
                $("html, body").animate({ scrollTop: top }, "slow");
            }
        },

        displaySearchResults: function(results){
            var self = this;
            
            // scroll page to top of movie list, slowly
            var top = $('#movie-list-separator').position().top;
            $("html, body").animate({ scrollTop: top }, "slow");

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

        displayPageNumbers: function (numResults, currentOffset) {
            var moviesPerPage = 20;
            var pageList = $('#pagination-list');
            pageList.show();

            if (numResults <= moviesPerPage) {
                // we only have one page of data, so hide pages and we're done
                pageList.hide();
                return;
            }

            // make sure offset is a multiple of moviesPerPage
            currentOffset = moviesPerPage * Math.floor(currentOffset / moviesPerPage);

            var numPages = Math.floor(numResults / moviesPerPage);
            var activePage = currentOffset / moviesPerPage;

            var prevPage = { offset: currentOffset - moviesPerPage, numDisplay: '&larr; Prev', disabled: activePage == 0 };
            var nextPage = { offset: currentOffset + moviesPerPage, numDisplay: 'Next &rarr;', disabled: activePage == numPages };

            var pages = [prevPage];

            for (var i = 0; i <= numPages; i++) {
                var page = { offset: i * moviesPerPage, numDisplay: i + 1, active: i == activePage };
                pages.push(page);
            }

            pages.push(nextPage);

            pageList.mustache('page-numbers', { pages: pages }, { method: 'html' });
        },
        
        fixUpMovieHeights: function () {
            // make sure all thumbnails are the same size

            var maxHeight = 0;

            $('#movie-list').find('.well').each(function(index, movie) {
                var height = $(movie).height();
                if (height > maxHeight) {
                    maxHeight = height;
                }
            });

            $('#movie-list').find('.well').each(function (index, movie) {
                $(movie).height(maxHeight);
            });
        },
        
        getMovieForDisplay: function (movie) {
            var m = {
                title: movie.display_title,
                headline: movie.headline,
                summary: movie.summary_short,
                imgSrc: movie.multimedia ? movie.multimedia.resource.src : 'http://www.worldimpex.com/images/no_image_available.gif',
                reviewerName: movie.byline,
                reviewPubDate: moment(movie.publication_date).format('MMM Do YYYY'),
                openedInTheatresDate: movie.opening_date ? moment(movie.opening_date).format('MMM Do YYYY') : null,
                dvdReleaseDate: movie.dvd_release_date ? moment(movie.dvd_release_date).format('MMM Do YYYY') : null,
                isCriticsPick: movie.critics_pick == 1,
                reviewSnippet: movie.capsule_review,
                reviewUrl: movie.link.url,
                movieId: movie.nyt_movie_id,
                relatedUrls: movie.related_urls,
                anyUrls: (movie.related_urls || {}).length > 0
            };

            $.each(m.relatedUrls, function(index, relatedUrl) {
                relatedUrl.linkText = relatedUrl.suggested_link_text.replace(' of ' + m.title, '')
                                                                    .replace(' for ' + m.title, '');
            });

            return m;
        },

        getBioForDisplay: function (biography) {
            return {
                reviewerName: biography.display_name,
                bioText: biography.bio || 'Sorry, New York Times does not have any information about ' + biography.display_name,
            };
        }

    };

})(adq);