# Paw Dates Frontend

React app for dog owners to schedule playdates.

## Initial Setup:

Create .env file
npm install

## Paw Dates Backend

http://localhost:3000

---

## Foundation

1. Install react-router
2. Create AuthContext.jsx
3. Create api.js with all fetch functions
4. Create Layout.jsx
5. Create Navbar.jsx with:
   - Logo (links to Welcome page)
   - Navigation links: Meet the doggos (links to search page)| Profile(links to users page)| Messages(links to messages page)
     if not logged in, they all take you to login/register
   - Logout button (if logged in)
   - Login/Register button (if not logged in)
   - Message/Playdate notification badge
6. Tests
7. Connect to backend

## AN:

WelcomePage.jsx - welcome screen, description, login/register
Search.jsx - display dogs within 10 mile radius (default) search bar, search filters, fetch dogs, display dog cards,

## KY:

UserPage.jsx - user profile, user info, dogs list, message popup button (import from MessagePopup components)
UserCard.jsx - user card component
users.js
navbar

## AL:

DogsPage.jsx - dog profile, dog info, breed, age, distance, ratings, gallery, owner info, message/playdate buttons (import from components)
DogCard.jsx - reusable dog card
dogs.js
ratings.js

## SHA:

MessagesPage.jsx - conversation list, message thread, fetch messages, send message
MessagePopup.jsx - send message form popup
PlaydateRequestPopup.jsx - request playdate form popup
messages.js
playdates.js
