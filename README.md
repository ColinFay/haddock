# Haddock

POC for a Shiny server built with NodeJS

## How does it work?

When you launch the server, N instances of the Shiny App are launched on the N ports you've defined. 

When a new user connect to the server, they either get an available app (a free port), or an error message. 

## How to 

``` 
git clone http:
cd haddock
```

In the `server.js` file, you can change several parameters: 

+ available ports

```
var available = [1234, 1235]
```

List here all the ports you want to open (one shiny app will be launched by port)

+ launchShinyApps

```
shiny.launchShinyApps("prenomsapp::run_app()", available)
```

The cmd element (here `prenomsapp::run_app()`) is the command to launch the Shiny App. It will be passed to `R -e "{cmd}"`. It can be either a call to a package that launch the app, or a `shiny::runApp(/folder)`.

+ Content & Message of webpage 

```
shiny.noPort(
	title = "My Shiny App", 
	message = "No available port"
)
```

This piece of code defines the title + sentence displayed when there is no port available. You can also change the title here:

```
shiny.genPage(
	port, 
	title = "My Shiny App"
)
```

+ Port of the server 

```
var port_server = 8080
```

## Run 

```
node server.js
```

Then go to your browser and open at the port you've specified on `server.listen` (default is 8080).

## Should I use it in production? 

Of course you shouldn't. This is just a Proof Of Concept and won't be production ready until a significant amount of work. 

## Should I contribute? 

Of course you should. Please add any comment you might have in the issue section, and feel free to do PR!

