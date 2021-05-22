# Experiment to combine React.js Views with toad.js Models

This experiment brings the [MVVM](https://en.wikipedia.org/wiki/Model–view–viewmodel) ViewModels from [toad.js](https://github.com/markandre13/toad.js)' to [React.js](https://reactjs.org).

* Apply Clean Architecture principles to your frontend by separating the View from the Business Domain Model.
* Insanely simplify your React code.
* Two-Way Binding

Much to my surprise, JSX allowed binding the Views directly to the Models with TypeScript providing typesafety at compile time and in VS Code.

The downside is that, compared to web components, the need to compile the JSX slows the UI development cycle down by 5s per iteration.

https://resthooks.io/docs/api/useresource

