# LanguagePractice

German language practicing project supporting multiple kinds of tasks, random task check order and entering new tasks.

The project is a Zoneless angular projects, which uses ngrx for state management, and makes use of `NgComponentOutlet` for displaying the different kinds of tasks.


This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.3.10.

## How to run?

Simply run the `start-server.bat` install dependencies and launch a minimal webserver, that supports persisting tasks in a file as to lot lose them once the browser cache is cleared.

Or in manual steps:

    npm ci
    ng build --configuration production
    node micro-ws

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

