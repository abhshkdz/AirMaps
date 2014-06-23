(function (airmaps) {
  'use strict';

  var street = street || {};

  street.init = function () {
    $('.side').css('display', 'none');
    $('#street').css('display', 'block');
    this._heading = 0;
  };

  street._fetchImages = function () {

  };

  street.turn = function (direction) {
    if (direction === 'left') {

    } else if (direction === 'right') {

    }
  };

  airmaps.street = street;

})(airmaps);
