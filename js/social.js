(function (airmaps) {
  'use strict';

  var social = social || {};

  social.init = function (address) {
    $('.side').css('display', 'none');
    $('#social').css('display', 'block');
    this._address = address;
    // this._fetchFeed(this._renderFeed);
  };

  social._fetchFeed = function (callback) {
    var _this = this;
    var feed  = '';

    this._fetchTweets(function (tweets) {
      // Organize the feed
      callback(feed);
    });
  };

  social._fetchTweets = function (callback) {
    var _this = this;
    $.ajax({
      url: 'request/twitter.php?address=' + _this._address,
      dataType: 'json',
      sucess: function (data) {
        if (typeof data !== 'object') data = JSON.parse(data);
        console.log(data);
      },
      error: function (xhr, status, error) {
        console.log(xhr);
      }
    });
  };

  social._renderFeed = function (feed) {
    $('#social #city').html(this.address);
    $('#social #feed').html(feed);
  };

  airmaps.social = social;

})(airmaps);
