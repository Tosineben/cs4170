Name:  Alden Quimby
UNI:   adq2101
Email: adq2101@columbia.edu

Instructions:
To run my application, please run MovieReviews/Index.html from your local webserver.
I used the proxy.php file provided for the assignment, so you will need php installed.


UI Design decisions:
1. Searching. The starting screen is intentionally very simple, with an input propmting users
to search movies by title/keyword. This follows one of Neilson's usability heuristics 'minimalist
design', because the most common search case will be by title. Users also have the option to open
'advanced search' options, for additional filters. The idea of advanced search options should be
very familiar to any internet user. Keeping these options hidden by default makes the UI cleaner, 
and after expanding the advanced options, they are offered the ability to minimize them back to
'quick search' only. This follows the 'user control and freedom' hueristic by allowing users to
undo if they were just exploring the advanced option and didn't actually want to use it.
Following the 'visability of system status' hueristic, the search button becomes disabled and 
changes from 'Search' to 'Searching...' when a user executes a search. This tells the user to wait
for search results to appear. Putting opening date and critics pick filters in the search tells 
the user to expect these two fields to be displayed in search results; showing these fields in 
results follows the 'consistency' heuristic.

2. Search Results. Results of a movies search are laid out in a thumbnail grid format, allowing
users to see relevant information of multiple results at once. Each thumbnail shows the movie title,
opening date, whether or not it's a critics' pick, headline (if it exists), and an image.
This should be more than enough info for users searching for a specific movie, and
allow quick comparison of different movies for users that are browsing. If a user decides they're
interested in a particular movie, they can get more information by clicking 'Details'. At the bottom 
of the search results are page numbers. This tells the user that their query may have more results, 
and allows them to easily flip to the next 20 at a time. When a page number is clicked, all page 
numbers become disabled to make it clear that the click was recognized and that the user should wait 
for the next set of results to come up. When those results do appear, the window scrolls back up to 
the top of the newest result set for the user to examine. This setup follows the consistency, user control, 
visibility of status, and flexibility/efficiency heuristics.

3. Movie Details. This view shows additional information about an individual movie in a modal, while
dimming the background to make it clear that the user should focus on the modal. All of the 
information from the thumbnail is redisplayed in the modal, following the 'recognition rather 
than recall' heuristic. Additionally, users can read a short summary of the movie, a snippet from
the NYT review, and navigate via links to show times, trailers and more. Users can also read a full
review on the NYT site, and in the footer of the modal, they can learn more about the reviewer.
With a clear close button in the top right corner, users can back out of the modal when they've
finished. The modal also supports some expert-user functionality, by closing with the Esc key.

4. Error handling. The UI helps users with three common erorrs, which follows the 'help 
users recognize, diagnose, and recover from errors' heuristic. First, if a user 
clicks search without entering a keyword, the input field turns red and a warning/error 
icon appears, making it clear that this field should be filled before searching. To be more 
explicit, the help text inside the input changes from 'Search by title or keyword...' to 
'Please enter a keyword to search', to help guide the user. Second, if the NYT api responds 
with an error, a closable error dialog appears explaining the issue and asking them to try 
again at another time. Third, if the user's search returns 0 results, this is clearly displayed 
so that the user knows that the search was completed and does not wait indefinitely for 
results to load. The user is asked to try searching for something less specific.


Optional functionality:
On top of the requirements for the assignment, I implemented filtering search results by
Critics' Picks only, because I thought users would want to look for the best movies if browsing.
I also implmented querying the NYT api for reviewer bio information from the movie detail modal,
because users may want to learn more about reviewers after reading a review.


Sources and Libaries:
All movie reviews data comes from http://developer.nytimes.com/docs/read/movie_reviews_api
The image for "no image available" comes from http://www.worldimpex.com/images/no_image_available.gif

I used multiple libraries to implement the application:
1. jquery
2. twitter bootstrap for basic styling and components - http://twitter.github.com/bootstrap/
3. moment.js for dates - http://momentjs.com/
4. mustache.js for html templating - http://mustache.github.com/
    Note that these are not pre-built templates, this is simply a library
    for creating html partial views that can be rendered in javascript
    and reused through an application. For example, the thumbnail I created
    to display a movie in the search results is a template that gets
    rendered with a "movie model" up to 20 times depending on the result set.