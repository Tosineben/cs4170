Name:  Alden Quimby
UNI:   adq2101
Email: adq2101@columbia.edu

Instructions:
To run my application, please run MovieReviews/Index.html from your local webserver.
I used the proxy.php file provided for the assignment, so you will need php installed.


UI Design decisions:
1. Searching. When a users clicks the search button or hits enter, the primary search button
changes to a disabled state, and says 'Searching...' to indicate that the user should wait
for search results to appear. This fits into Neilsen's 1st usability heuristic, 'visibility
of system status'.

2. Search Results. page numbers ftw. Changes pages again fits into the heuristic 'visibility
of system status'. When a page number is click, all page numbers become disabled to make it
clear that the click was recognized and that the user should wait for the next set of results 
to come up. When those results do appear, the window scrolls back up to the top of the newest
result set for the user to examine. Shows things important for choosing results: 
title, image, headline, opening date, critics pick

3. Movie Details. Links to show times, NYT review, and in the footer, can get biography of reviewer

4. Error handling. The interface also handles three common erorr cases. First, if a user clicks search without
entering a keyword, the input field turns red and a warning/error icon appears, making it clear 
that this field should be filled before searching. To be more explicit, the help text inside
the input changes from 'Search by title or keyword...' to 'Please enter a keyword to search',
to help guide the user. Second, if the NYT api responds with an error, a closable error 
dialog appears explaining the issue and asking them to try again at another time. Third, if
the user's search returns 0 results, this is clearly displayed so that the user knows that
the search was completed and does not wait indefinitely for results to load. The user is
asked to try searchinf for something less specific.


Optional functionality:
Users can filter search results by Critics' Picks only.
Can get biography information about the NYT reviewer after clicking "Details"


Sources and Libaries:
All movie reviews data comes from http://developer.nytimes.com/docs/read/movie_reviews_api
The image for "no image available" comes from http://www.worldimpex.com/images/no_image_available.gif

I used multiple libraries to implement the application.
1. jquery
2. twitter bootstrap for basic styling and components - http://twitter.github.com/bootstrap/
3. moment.js for handling dates - http://momentjs.com/
4. mustache.js for html templating - http://mustache.github.com/
    Note that these are not pre-built templates, this is simply a library
    for creating html partial views that can be rendered in javascript
    and reused through an application. For example, the thumbnail I created
    to display a movie in the search results is a template that gets
    rendered with a "movie model" up to 20 times depending on the result set.