# 437socialapp
repo for the 437 project fall 2019
client folder holds the react front-end
api folder hodes the node back-end

Followed a tutorial here to set this all up: https://www.freecodecamp.org/news/create-a-react-frontend-a-node-express-backend-and-connect-them-together-c5798926047c/

to run things, generally you want to cd into the folder and do npm install then npm start. This installs local dependencies and runs the app on a port.
Front end is set to 3000 and the backend api is set to 9000, but will move if something else is using that port, it'll give you info about what port its running on. Then just go to http://localhost:3000/ (3000 = port number) to see the app.

Example to work on development for the front end:
cd client
npm install
npm start

you should only have to do npm install once, but doing it multiple times probably won't hurt anything.

To get the api working I opened it to all webtraffic and just connected to the public dns instead of localhost.
If you want to make changes to the api on your computer and get data from that without pushing to the instance,
change line 12 in client/src/App.js and switch the url from whats there to http://localhost:9000/testAPI


to get data from front end to backend: form with post that targets invisible iframe on the bottom of the page.
example in client/app.js. example of recieving in api/testAPI.js. probably copy paste that syntx. data will be given as an object with the field you want being the name of the data on the form. req.body.[fieldname] will give all data,and from there it can be used however we need.
