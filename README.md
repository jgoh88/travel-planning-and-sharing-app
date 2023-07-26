# Tripping
## Introduction/Overview
This project was built for people who likes to travel and is looking for a tool to plan their trips. Users can create and manage their trip plans by the day. They in turn can browse trip plans from others to get ideas for their own trips. If they had an enjoyable trip, they can choose to share their own plans with others. This was built within 4 days as part of my GA second project.

Features of web part of the application:
* Register account and login
* Browse through places to visit
* Admin page to maintain places to visit
* Create, manage planning for a trip and share with others
* Browse trip plans from other users and add to favorites

![alt text](./assets/screenshots/tripping.png "Tripping feature screenshots")

## Getting Started
### Prerequisite
Make sure that you have Node.js installed together with a package manager like npm or yarn.
Apart from that you'll also need to have a mongoDB account and cluster, and also a cloudinary account. You can register for free on [mongodb.com](https://www.mongodb.com/) and [cloudinary.com](https://cloudinary.com/)

### Installation
```bash
# Clone repository
$ git clone https://github.com/jgoh88/travel-planning-and-sharing-app.git

# Install dependencies
$ cd travel-planning-and-sharing-app
$ npm install   # or yarn install

# Setup environment variables
# Create a .env file with the required variables. Refer to .env_sample 

# Run application
$ node server   # or nodemon index if you have nodemon installed. This will start the application
```

## Demo
For demo of the application, you can refer [here](https://travel-planning-and-sharing-app.onrender.com). 
