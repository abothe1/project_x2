# project_x2
This is the website for banda,inc.
 Dont steal it lol

# Update 26 Jan. 2019
## -ab-frontend-edits

# index.html
* Lots of cosmetic changes made to the rainDrop instances. Extensively modified the
object constructor and added more stepper/randomization functions regarding that.
* Asset names may be changed. I haven't moved out the old assets into a 'depricated' folder yet. To make sure the assets are right, just cmd-f and search for file extensions (.png, .jpg, etc.) on both index.html & index.css

## Remaining work to be done:
* Hook up ticker to real-time values.
* Create a programmatic switch for the search status (events or bands) ((REAL EASY))
* Have a search input + enter redirect to the search page.

# search.html
* Added an init method to the search.js script. It populates the grid with images and nameplates.
## Remaining work to be done:
* a 'click' event on one of the grid cells should redirect to the musician/event page as necessary. Alternatively, we have a 'preview' modal that has a button to redirect to the actual page.
* Hover events?
* Connect search bar at the top to a new search.
* add the 'band selector' dropdown menu where the three toggleable states are currently.


# control-center.html
* created the control center & each carousel is managed by a simple script.
* added a contacts button and a contacts sidebar.
* created a header class and multiple carousels that can be pre-fabricated in code later for generating a page.

## Remaining work to be done:
* create 'add gig' and 'add clip' buttons.
* general layout (need to talk to Shadey about adding more labels)
* chat window layout and data mgt
* Hook up the page navigation links for each band (see left side of page)
* add some method that manages how stars display (currently nothing)
* alter the carousel prev & next buttons.
* figure out how the contacts sidebar will display information.
