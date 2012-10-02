no_image_avail from 
http://www.worldimpex.com/images/no_image_available.gif

data from 
http://developer.nytimes.com/docs/read/movie_reviews_api

new york times image
http://www.gamification.co/wp-content/uploads/2011/03/New-York-Times-Logo-300x194.png

Error handling:
If a user searches for nothing, make the search bar red to indicate that the field
should be filled out. Also add help text telling the user what they did wrong.

If the NYT api responds with an error, show an error dialog that the user can close
explaining the issue and asking them to try again at another time.

If the search returns no results, tell the user, instead of leaving them wondering.

Status updates:
When they click search, the button changes to disabled and say "searching..." to make
it clear that the user should wait

When a page number is clicked, all page numbers are disabled, to make it clear that
the user should wait for the next page of information to load

Main search:
Shows things important for choosing results: title, image, headline, opening date, critics pick

More info:
Links to show times, NYT review, and in the footer, can get biography of reviewer