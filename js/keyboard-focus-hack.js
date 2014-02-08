/*
Copyright 2008 Google Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

/**
 * This method prevents the Google Earth Plugin from getting keyboard focus
 * by perpetually reassigning the DOMWindow focus. Elements in the page
 * aren't affected and when the window gets onfocus/onblur events, this
 * is enabled/disabled.
 *
 * NOTE: Only works in Firefox currently. Fails gracefully in other
 * browsers.
 */
function keyboardFocusHack(ge) {
  // first turn off mouse navigation
  ge.getOptions().setMouseNavigationEnabled(false);
  
  if (navigator.userAgent.indexOf('Firefox') < 0)
    return;
  
  // event handling helper
  function addEventHandler(obj, evt, handler) {
    if ('attachEvent' in obj)
      obj.attachEvent('on' + evt, handler);
    else
      obj.addEventListener(evt, handler, false);
  }

  // set up force window focus
  var forceFocusInterval = null;

  function turnForceFocusOff() {
    if (forceFocusInterval)
      clearInterval(forceFocusInterval);
    
    forceFocusInterval = null;
  }

  function turnForceFocusOn() {
    turnForceFocusOff();
    forceFocusInterval = setInterval(function() {
      if (forceFocusInterval)
        window.focus();
    }, 200);
  }

  turnForceFocusOn();
  addEventHandler(window, 'focus', turnForceFocusOn);
  addEventHandler(window, 'blur',  turnForceFocusOff);
  
  // prevent page scrolling with up/down and page up/page down arrows
  addEventHandler(window, 'keydown', function(evt) {
    // TODO: only for arrow keys!
    if ((37 <= evt.keyCode && evt.keyCode <= 40) || // arrow keys
        (33 <= evt.keyCode && evt.keyCode <= 34)) { // page up/down
      evt.preventDefault();
      evt.stopPropagation();
    }
  });
};
