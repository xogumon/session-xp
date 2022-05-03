const mongoose = require("mongoose");
const Store = require("express-session").Store;
const add = require("date-fns/add");
const sessionSchema = new mongoose.Schema(
  {
    _id: { type: String },
    access: { type: Date, default: new Date(), index: true },
    expires: { type: Date, index: true },
    session: { type: Object },
  },
  { versionKey: false }
);
const defOpts = {
  collection: "sessions",
  expires: { days: 7 },
};
/**
 * Return the `sessionXp` extending `express`'s session Store.
 *
 * @param {Object} options Optional
 */
class sessionXp extends Store {
  constructor(options = {}) {
    super(options);
    this._opts = Object.assign({}, defOpts, options);
    this._db =
      this._opts && this._opts.hasOwnProperty("dbname")
        ? mongoose.connection.useDb(this._opts.dbname)
        : mongoose.connection;
    this._client = this._db.model(this._opts.collection, sessionSchema);
  }
  get(_id, callback) {
    this._client.findById(_id, function (err, sess) {
      if (err) return callback && callback(err, null);
      if (!sess) return callback && callback();
      callback && callback(null, sess.session);
    });
  }
  set(_id, session, callback) {
    try {
      const self = this;
      const Client = self._client;
      const _session = {};
      for (const key in session) {
        if (key === "cookie") {
          _session[key] = session[key].toJSON
            ? session[key].toJSON()
            : session[key];
        } else {
          _session[key] = session[key];
        }
      }
      Client.findById(_id, function (err, sess) {
        if (err) return callback && callback(err);
        if (!sess) sess = new Client({ _id });
        sess.session = _session;
        if (session && session.cookie && session.cookie.expires) {
          sess.expires = new Date(session.cookie.expires);
        } else {
          sess.expires = add(new Date(), self._opts.expires);
        }
        if (sess.isNew) {
          sess.access = new Date();
        }
        sess.save(function (err) {
          if (err) return callback && callback(err);
          callback && callback(null, sess);
        });
      });
    } catch (err) {
      callback && callback(err);
    }
  }
  touch(...args) {
    return this.set(...args);
  }
  destroy(_id, callback) {
    this._client.deleteOne({ _id }, function (err, sess) {
      if (err) return callback && callback(err);
      callback && callback(null, sess);
    });
  }
  all(callback) {
    this._client.find(function (err, sess) {
      if (err) return callback && callback(err);
      callback && callback(null, sess);
    });
  }
  length(callback) {
    this._client.count(function (err, count) {
      if (err) return callback && callback(err);
      callback && callback(null, count);
    });
  }
  clear(callback) {
    this._client.deleteMany(function (err) {
      if (err) return callback && callback(err);
      callback && callback();
    });
  }
}
module.exports = sessionXp;
