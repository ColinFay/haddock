# Haddock

A very experimental Proof Of Concept for a Shiny server built with NodeJS.

## How does it work?

Before launching the server, you'll have to define a list of N available port to open on your server. Once the node app is launched, the first thing it does is launching N instances of the Shiny App on the N ports you've defined. 

When a new user connect to the server, they either get an available app (a free port), or an error message. 

What happens in the background is that the Node JS app keeps track of the "available" ports, and serve an available port throught an iframe to the user.

## How to use haddock

Install deps

```
npm install yaml
npm install socket.io
```

### Getting the project

First, `git clone` the project on your server.

``` 
git clone https://github.com/ColinFay/haddock.git
cd haddock
```

### Config

Change things in the `config.yml` file: 

+ available ports

```
available: [1234, 1235]
```

An array of all the ports you want to open (one shiny app will be launched by port listed here).

+ cmd

```
cmd: "prenomsapp::run_app()"
```

The cmd element (here `prenomsapp::run_app()`) is the command used to launch the Shiny App with a command line call. In the background, it will be passed to `R -e "{cmd}"`. It can be either a call to a package that launch the app, or a `shiny::runApp(/folder/to/app.R)`. Well, in fact it can be any kind of R code as long as it can be passed to `R -e "{cmd}"`. 

+ Content & Message of webpage 

```
title: "My Shiny App"
```

This piece of code defines the title displayed on the pages

```
no_port: "No port available"
```

Sentence displayed when there is no port available.

+ Port of the server 

```
port_server: 8080
```

This port is the port used to access the node app. 

### Run 

Go to your terminal, and run:

```
node server.js
```

Then go to your browser and open at the port you've specified on `server.listen` (default is 8080).

## Roadmap 

### Near future 

+ Today, the node app doesn't launch any new shiny app when there is no port available. That should be made possible. Then, the user could define a number of open ports at launch, then a threshold, and when the threshold of available port is reached, new shiny processes are launched. 

+ The server should be able to host multiple Shiny Apps. 

+ There should be a home page listing all the available app. 

+ Launching shiny apps contained in Docker containers should be possible. 

### Far future 

+ Anything you could expect from a decent server :) (auth, ...)


## FAQ

### Should I use it in production? 

Of course you shouldn't. This is just a Proof Of Concept and won't be production ready until a significant amount of work. 

### The Node code seems weird

I'm using this project as an excuse to learn NodeJS, so... sorry :) 

### Should I contribute? 

Of course you should. Please add any comment you might have in the issue section, and feel free to do PR!

