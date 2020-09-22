# Assignment for Helmes frontend

## 1. Navigate to project root
    $ cd C:\Users\username\workspace\assignment-helmes-frontend

## 2. [OPTION 1] Building and running with docker-compose
    ($ docker-compose down)
    ($ docker-compose build --no-cache)
    $ docker-compose up
    
## 2. [OPTION 2] Building and running with docker
    $ docker build -t assignment-ui .
    $ docker run -p 3000:3000 assignment-ui .
    
## 2. [OPTION 3] Building and running the application with npm
    $ npm run-script build
    $ npm start
    
## 3. Open http://localhost:3000/

#### Technologies and frameworks in use:
* ReactJS https://github.com/facebook/create-react-app
* Docker https://docs.docker.com/docker-for-windows/ and https://hub.docker.com/_/node

##### UI:
* PrimeReact <a>https://www.primefaces.org/primereact
* reactstrap https://reactstrap.github.io/

##### Translations:
* i18next https://www.i18next.com/

##### Data fetching (better HTTP requests) and error handling:
* axios https://github.com/axios/axios

##### Useful guides
* https://reactjs.org/docs/getting-started.html
* https://github.com/facebook/create-react-app
* ReactStrap components - https://reactstrap.github.io/components/