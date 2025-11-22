# LanguagePractice

German language practicing project supporting multiple kinds of tasks, random task check order and entering new tasks.

The project is a Zoneless angular projects, which uses ngrx for state management, and makes use of `NgComponentOutlet` for displaying the different kinds of tasks.

You can check out a live version of this project [here](https://lsoleyl.de/language-practice/). The tasks are stored in the local storage of the browser.
You can run the project in the locally provide `micro-ws` webserver, which supports persisting the created tasks to a tasks.json file to not lose all tasks when clearing the browser storage.

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.3.10.

## How to run?

Simply run the `start-server.bat` install dependencies and launch a minimal webserver, that supports persisting tasks in a file as to lot lose them once the browser cache is cleared.

Or in manual steps:

    npm ci
    npm run build
    node micro-ws

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

