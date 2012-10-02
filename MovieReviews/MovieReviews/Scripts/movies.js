var adq = adq || {};

(function (module) {

    module.movieReviews = {

        init: function (settings) {
            var self = this;
            self.settings = settings;

            $('#mainSearch-button').click(function () {
                var queryObj = $('#mainSearch-query');
                
                var query = queryObj.val().trim().replace(/ /g, '+');
                var criticsPick = $('#mainSearch-criticsPick').is(':checked');
                var start = moment($('#mainSearch-startDate').val());
                var end = moment($('#mainSearch-endDate').val());

                if (query == '') {
                    queryObj.parents('.control-group').addClass('error');
                    queryObj.parents('.control-group').find('.add-on').removeClass('hidden');
                    return;
                }

                queryObj.parents('.control-group').removeClass('error');
                queryObj.parents('.control-group').find('.add-on').addClass('hidden');

                // no offset for initial query
                self.search = { query: query, offset: 0 };

                if (criticsPick) {
                    self.search.criticsPick = "Y";
                }

                if (start && end) {
                    var dateRange = start.format("YYYY-MM-DD") + ';' + end.format("YYYY-MM-DD");
                    self.search.openDate = dateRange;
                }

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

        doSearch: function() {
            var self = this;

            $('#navSearchButton').button('loading');
            $('#mainSearch-button').button('loading');

            var url = self.settings.getSearchUrl(self.search.query, self.search.offset, self.search.criticsPick, self.search.openDate);

            var proxyUrl = "proxy.php?url=" + encodeURIComponent(url);

            // disable page numbers to make it clear that we're in the middle of searching
            $.each($('.page-number'), function(index, pageNumber) {
                $(pageNumber).parent().addClass('disabled');
            });
            
            $.getJSON(proxyUrl, function (rawResponse) {

                var resp = jQuery.parseJSON(rawResponse);

                // close any open alerts if user hasn't yet
                $('.alert').alert('close');

                // reset search button now that search is complete
                $('#navSearchButton').button('reset');
                $('#mainSearch-button').button('reset');

                if (resp && resp.status == "OK") {
                    self.displayPageNumbers(resp.num_results, self.search.offset);
                    self.displaySearchResults(resp.results);
                    self.fixUpMovieHeights();
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

            if (!results || results.length == 0) {
                self.displayAlert('Your search returned no results. Try searching for something less specific.', false);
                return;
            }
            
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

            var pages = [prevPage];

            for (var i = 0; i <= numPages; i++) {
                var page = { offset: i * moviesPerPage, numDisplay: i + 1, active: i == activePage };
                pages.push(page);
            }

            pages.push(nextPage);

            pageList.mustache('page-numbers', { pages: pages }, { method: 'html' });
        },

        fixUpMovieHeights: function () {
            var maxHeight = 130;

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