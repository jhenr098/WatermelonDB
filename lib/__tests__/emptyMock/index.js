"use strict";

// Mock out stupid Node packages that expect (jest) requires
module.exports = {
  read: function read() {}
};