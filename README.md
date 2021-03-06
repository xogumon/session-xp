# session-xp

----

<p align="center"><img src="https://raw.githubusercontent.com/xogumon/session-xp/main/.github/xp.png"></a></p>
<p align="center">An express-session storage with mongoose.connection (MongoDB)</p>

----

## Installation

    $ npm install session-xp

## Example

```js
const app = require("express")()
const session = require("express-session")
const sessionXp = require("session-xp")
const mongoose = require("mongoose")
mongoose.connect(process.env.MONGODB_URI);
app.use(
  session({
    secret: "keyboard cat",
    store: new sessionXp({
      /* All options are optional */
      collection: "sessions",
      dbname: "myotherdbname",
      /* How to use expires option:
      https://date-fns.org/docs/add */
      expires: { days: 7 },
    }),
    /* About resave and saveUninitialized:
    https://stackoverflow.com/a/40396102/15275415 */
    saveUninitialized: false,
    resave: false,
  })
)
app.listen(3000)
```
