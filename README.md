# Social Media Site
Demo link: https://mern-social-client-git-main-realmastergods-projects.vercel.app/

# Table of Content

1. About The App
2. Technologies
3. Prerequisites
4. Setup
5. Status

# 1. About The App
Social Media Site is a typical social media website. You can create your account, create new posts, upload images, update your account, follow/unfollow other users,
and see which friends are online
Additionally it has a real time chat feature (it is not included in the demo link though). So you chat with your Online friends

# 2. Technologies
I have used  ReactJs to create the frontend and it uses Context API.
The backend is done in Node/ExpressJs and it uses mongodb as database.
For the real time chat feature. I used the socket.io's web socket server.

## React 

### To create your own react + vite app run this command:
```bash
npx create-react-app app_name
```
The above command is for npm version greater than or equal to 5.6, otherwise use the command below
```bash
npm install -g create-react-app
create-react-app app_name
```
Or you may refer to https://legacy.reactjs.org/docs/create-a-new-react-app.html   for more details.

## NodeJs

NodeJs has become a popular choice for writing backend. It has many advantages but the most convienent is that it let's us write backend in JavaScript
Refer to https://nodejs.org/en to learn more about it

## ExpressJs

It is a web framework for node.js. Writing backend in plain Node.js is possible, however it'd a tiresome job, using express.js makes it easier and faster 
to work with node.js
To add it to your project use:
```bash
npm i express
```
Learn about express.js https://expressjs.com/

## MongoDb

A nosql database that is popular nowadays is mongodb specially when it comes to node.js.
To add it to your project use:
```bash
npm i mongoose
```
Refer to https://mongoosejs.com/ for more information

# 3. Prerequisites
## Install Node Package Manager
Refer to https://docs.npmjs.com/downloading-and-installing-node-js-and-npm

# 4. Setup Locally
- Clone the repository or download as zip.
- Go to the cloned folder on your local machine.
- Open terminal in api folder and also create a .env file where you have to create a variable MONGODB_URI and assign your mongodb database to this. 
- Open terminal and run the following commands in order.
  ```bash
  npm install
  ```
  ```bash
  npm start
  ```
- Similarly open terminal in client folder and also create a .env file where you have to create a variable REACT_APP_BASE_URL and assign the url your api is running on.
- Now in client folder just run the above two commands.
- Now just click/copy the link that would appear in the console and paste on your browser and hit enter. That's it you can now see the project on your local machine.

# 5. Status
Still some small things are pending, I will update it when I have time.


