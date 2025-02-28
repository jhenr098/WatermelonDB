"use strict";

var _index = require("../index");
var collection = null;
var t = null;
var c = null;

// Check that queries don't break
collection.query();
collection.query(_index.Q.where(c, true));
collection.query(_index.Q.and(_index.Q.where(c, true)));
collection.query(_index.Q.or(_index.Q.where(c, true)));
collection.query(_index.Q.on(t, _index.Q.where(c, true)));
collection.query().extend(_index.Q.where(c, true));

// Same as above, but as an array
collection.query([]);
collection.query([_index.Q.where(c, true)]);
collection.query(_index.Q.and([_index.Q.where(c, true)]));
collection.query(_index.Q.or([_index.Q.where(c, true)]));
collection.query(_index.Q.on(t, [_index.Q.where(c, true)]));
collection.query().extend([_index.Q.where(c, true)]);