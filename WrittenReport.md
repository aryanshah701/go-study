# Project Proposal Document

## Who is on your team?

  Our team members are Eli Frank, Nicholas Bagley, Frank Pizzella,
and Aryan Shah.

## What is the URL of your deployed app?

https://gostudy.aryanshah.tech/

## What is the URL of your github repository?

https://github.com/aryanshah701/go-study

## Is your app deployed and working?

Yes, our deployed app is fully deployed and functional.

## For each team member, what work did that person do on the project?

## Frank

I created the forms for comments and reviews using react
forms. I did a majority of the written report. One major contribution
I made was learning about the tasks every other group member had.
This was in order to understand and explain every single feature of
our app especially the use of the Google Places API. I also helped
film the presentation video.

## Nick

I worked on authorization rules for the user when using the
app. I worked on the controllers for the various objects we
have communicating in our app. This handles the access rules
that are applied to users when creating and deleting objects.
Most of my work was in comments and ratings and finalizing those.
I created and edited the video presentation for our project.

## Eli

I worked on the feed page, which displays nearby study spaces to
users. I primarily used a library called React Google Maps to add a
map and markers to denote where each study space is located. The
geolocation api was used to determine where the user is currently
located. I also performed general bug fixes and testing for the app.

## Aryan

On the server, I worked on the designing and implementing the App's
schema's, context modules, controllers and JSON views along with
User Sessions using Phoenix Web Tokens. I further implemented the
server side logic for authenticating a new Space being created by
using the Google Places API along with the /recommendations endpoint
to suggest new relavent Spaces nearby the user. Finally, I
implemented the Phoenix Space channels with authentication and
autherization for live comments.

On the client side, I designed UI and implemented the Create Space,
Show Space, Register, Login, Show User, and NavBar componenets. I
also implemented the socket.js file for live comments and the Redux
store.js file for caching. I deployed the website and setup secure
https and wss support in order to allow us to use the browser
Geolocation API.  

## App

## What does your project 2 app do?

Our app allows users to find study locations near them that fit their
needs. Users can add new study spaces, comment on existing spaces,
and leave reviews for other users to see.

## How has your app concept changed since the proposal?

We originally intended to allow user to upload photos of study
spaces. We now upload photos from the Google Places API. We added an
instantaneous average rating system. We added links to the
location's website. We have also included wifi availability status.
Each location now also includes a table of open hours. The team
developed a user's page which contains all the comments, spaces,
and reviews that the user contributed along with aggregate totals
of said fields. Another cool feature is the ability to click
on the share button under a location and automatically copy a
link to the space on our website.

## How do users interact with your application?

Users can find study locations in their area. They can also compare
various study locations by viewing their google rating along with
their *Go Study* rating. Furthermore, users can also add new study
locations they might enjoy. It is also possible for users to
interact with existing spaces by adding comments and reviews for
others to view.

## What can they accomplish by doing so?

Users can join an exciting group of studiers. They can also gain
a wealth of information about common study places in their area.
This can allow for more productive and enjoyable studying.

## For each project requirement, how does your app fulfil it?

* In general, this application should be significantly more ambitious
and have more features and functions than either the bulls-and-cows
game or the event invites app.

The *Go Study* project is significantly more robust than any previous
assignments submitted for this class.

* Your app must be built as two separate components:  

A) A back-end built with Elixir / Phoenix that includes a significant
amount of application logic and exposes a JSON API authenticated
with JWTs.  

The backend of our app is built with elixir using the Phoenix
framework. We use the REST API to contain a significant amount of
our authentication logic. We use Phoenix token in order to
authenticate users. Users can only delete their own comments.
Users only have access to create spaces and add comments when
logged in. We used JSON endpoints to ensure a new space has
a valid place ID in the Google Place's API. We also use
JSON endpoints to add recommendations based on user location.

B) A front-end built with Create React App. This should be structured
as an SPA and should communicate with the server via the JSON API and
Channels. In production, this should be deployed as a static site.

The front end of our app is built using React. Our app is designed
as a single page application and communicates with the JSON API
for access to our data.

* All of your app must be deployed to the VPS(es) of one or more
members of your team. The only exception is libraries for external
APIs that are not designed to be hosted locally (e.g. Google Maps).

Our app is deployed to Aryan Shah's VPS.

* Your application must have user accounts with local password
authentication (implemented securely).

We used Argon2 to implement secure password authentication by
creating a password hash for the user. Our app also enforces
passwords be at least 8 characters long. Users must also reconfirm
passwords.

* Users must be stored in a Postgres database, along with some other
persistent state.

Users, spaces, comments, and reviews are all stored in a Postgres
Database.

* Your application’s server-side code must use an external API that
requires authentication of your app, your app’s user, or both.

We use the Google Place's API to require authentication from our
server using an API key. We use this in two key features on our
server side. The first is to add recommendations for new spaces based
on a user's location. The second is to authenticate the place ID of
a new space a user entered. This is to ensure users only add real
places to the app.


* Your application must use Phoenix Channels to push realtime updates
to users, triggered either from an external API or from actions by
other concurrent users.

When logged in, we can visit the spaces page which connects to
a Phoenix Channel to handle live update for comments and reviews.
This incentivizes users to create an account which is incredibly
important for our app. The main content of our app is places created
by users.

* Your app should do something neat that is not explicitly covered 
by a requirement above.

Our app finds the user's current location and suggests nearby places
from the Google Place's API that the user may add as a new study
space. Also, the Google Place's autocomplete feature when creating a
new space.

* You are expected to effectively test your app.

We thoroughly tested all functionality of app. We tested registering
new users and loggin in with previously created users. We had to
ensure that only authenticated users had access to create new spaces
and leave comments. Another test was to ensure that only the
owner of comments could delete the comment. One of the more
complex features was the web socket live updating of comments.
This was tested by opening multiple browsers to ensure comments
were updated in real time without refreshing the page. Another
complex feature we tested was that our recommendations were updated
based on our location. We tested this by physically moving to a new
location and ensuring that different places were recommended to the
user. We tested the autocomplete feature by typing in common
places in our area and ensuring they popped up in the drop down.
Another test we tried was to create an invalid place. We ensured
that our site threw an error so that only real places would be
created by users.

* What’s the complex part of your app?

The most important and complex part of our app is the create a space
feature. We dedicated a lot of time and complexity to this feature
because our app is driven by user content. We intended to make
this feature very user friendly so that users are encouraged
to add new spaces. The goal was to pull data from the Google
Places API in order to allow the user to have to input as
little data as possible. We also
added recommendations based on the user's location. This
allows users to quickly add a study space they might be near.

* How did you design that component and why?

We implemented autocomplete while
entering a space from the Google Place's API. This shortcut
allows a user to quickly find their intended space. We pull
the location, validate the place ID, and add data such as
open hours. This allows a robust space to be created with
only minimal information entered from the user. By validating
the place ID we ensure that only real places are created.

* What was the most significant challenge you encountered and how
did you solve it?

Throughout the course of creating this app, we encountered a few
significant challenges. Implementing web sockets so that only
authenticated users receive live updates. The spaces page had
to support both web sockets and http requests without duplicating
data. In order to get the live updates to work, we had to implement
the web sockets server side with the same logic from the http
controller using plugs. Another significant problem we faced was
making our app an https site. This was necessary for location
services with web sockets. To solve this we had to use WSS to create
secure web sockets and we also had to change our deployment
configurations. The last significant challenge we faced was that
it took a while for our location to load. This caused a delay when
loading the feed and new space page. In order to fix this delay,
we saved the location to cache using redux on the initial page load.