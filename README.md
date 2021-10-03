# session-xp

----

<p align="center"><img src="https://raw.githubusercontent.com/rxogum/session-xp/main/.github/xp.png"></a></p>

<p align="center">An express-session storage with mongoose.connection (MongoDB)</p>

----

## Installation

    $ npm install https://github.com/rxogum/session-xp

## Example

```js
const mongoose = require("mongoose")
const app = require("express")()
const session = require("express-session")
const sessionXp = require("session-xp")

mongoose.connect("MONGODB_URI", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

app.use(
  session({
    secret: "keyboard cat",
    store: new sessionXp({
      /* All options are optional */
      collection: "sessions",
      dbname: "myotherdb",
      /* How to use expires option:
      https://date-fns.org/docs/add */
      expires: { days: 7 },
    }),
    /* About resave and saveUninitialized:
    https://stackoverflow.com/a/40396102/15275415 */
    resave: false,
    saveUninitialized: false,
  })
)

app.listen(3000)
```

That's it!