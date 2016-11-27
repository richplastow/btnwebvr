/**
 * @author richplastow / http://richplastow.com/
 *
 * An A-Frame component which  provides mouseenter and mouseleave listeners for
 * ‘control-columns’. It modifies the control heights, and applies the value
 * to a post-processing effect.
 */


!function () {
  var $scene           // the <A-SCENE> element
    , $upper = null    // the top element of the current control-column
    , $lower = null    // the bottom element of the current control-column
    , $text = null     // the 'bmfont-text' element, showing the current value
    , value = null     // derived from the current control-column’s height
    , displayValue     // the current value converted to 3 significant figures
    , thin = 0         // used to limit the number of times `$text` is changed
    , velocity = 0.001 // speed at which the control-column changes height
    , isReducing       // true if the cursor is currently over the lower element
    , pos              // the (x,y,z) coordinates of the current control-column
    , id               // eg 'channel-boost-rBoost-upper'
    , upperOrLower     // a string, either 'upper' or 'lower'
    , key              // eg 'rBoost' to change the red of a channel-boost
    , effect           // eg 'channel-boost'
    , upperMultiplier  // `$upper`’s 'multiplier' parameter
    , lowerMultiplier  // `$lower`’s 'multiplier' parameter
    , upperOffset      // `$upper`’s 'offset' parameter
    , lowerOffset      // `$lower`’s 'offset' parameter
  ;

  AFRAME.registerComponent('upper-lower-control', {

    schema: {
      multiplier: { default: 1.0 },
      offset:     { default: 0.0 },
    },

    init: function () {
      $scene = document.querySelector('a-scene');

      this.el.addEventListener('mouseenter', function () {
        id   = this.id;
        pos  = this.getAttribute('position');

        //// Parse the id.
        if (! id) return reset(); // eg <A-SKY> or the floor-plane
        var parts = id.split('-');
        upperOrLower = parts.pop();
        key          = parts.pop();
        effect       = parts.join('-');

        //// Get a reference to the control-column’s text element.
        $text = document.getElementById( id.slice(0,-6) + '-text' );

        //// Get references to the upper and lower control-column elements.
        if ('upper' === upperOrLower) {
          isReducing = false;
          $upper = this;
          $lower = document.getElementById( id.slice(0,-6) + '-lower' );

        } else if ('lower' === upperOrLower) {
          isReducing = true;
          $lower = this;
          $upper = document.getElementById( id.slice(0,-6) + '-upper' );

        } else {
          console.warn("Unexpected 'upper-lower-control' id: " + id);
        }

        //// Get the control-column range.
        var upperData = $upper.getAttribute('upper-lower-control');
        var lowerData = $lower.getAttribute('upper-lower-control');
        upperMultiplier = +upperData.multiplier;
        lowerMultiplier = +lowerData.multiplier;
        upperOffset     = +upperData.offset;
        lowerOffset     = +lowerData.offset;
        // var most  = +upperRange.to;
        // var mid   = +upperRange.from;
        // var least = +lowerRange.from;
        // if (lowerRange.to !== mid) { console.warn('lower control range `to` ' +
        //   lowerRange.to + ' !== upper control range `from` ' + mid);
        // }

      });
      this.el.addEventListener('mouseleave', reset);
    },

    tick: tick

  });

  function tick () {

    if (! $upper) return; // nothing hovered

    //// Increase the speed at which the control-column changes height.
    if (0.01 > velocity) velocity += 0.00001;

    //// Resize the upper and lower halves of the control-column.
    var upperHeight = +$upper.getAttribute('height');
    var lowerHeight = +$lower.getAttribute('height');
    if (isReducing) {
      upperHeight += velocity;
      lowerHeight -= velocity;
      if (0.5 > lowerHeight) return; // too short
    } else {
      upperHeight -= velocity;
      lowerHeight += velocity;
      if (0.5 > upperHeight) return; // too tall
    }
    $upper.setAttribute('height', upperHeight);
    $lower.setAttribute('height', lowerHeight);
    $upper.setAttribute('position', pos.x+' '+(4-upperHeight/2)+' '+pos.z);
    $lower.setAttribute('position', pos.x+' '+( lowerHeight/2 )+' '+pos.z);

    //// Convert the height of the lower element to a value.
    if (3.4 < lowerHeight) { // 3.499 to 3.5
      value = upperMultiplier + upperOffset;
    } else if (0.6 > lowerHeight) { // 0.5 to 0.599
      value = lowerOffset;
    } else if (2 < lowerHeight) { // 2.001 to 3.4
      value = (lowerHeight-2) / 1.5; // 0.000667 to 0.9333
      value = value * upperMultiplier + upperOffset;
    } else if (2 > lowerHeight) { // 0.6 to 1.999
      value = (lowerHeight-0.5) / 1.5; // 0.0667 to 0.999333
      value = value * lowerMultiplier + lowerOffset;
    } else { // 2
      value = upperOffset; // 0 * upperMultiplier + upperOffset
    }
    $scene.setAttribute(effect, key, value);

    //// Update the text, about once a second (assuming 60 ticks per second).
    if ($text) {
      thin++;
      if (60 < thin) { // thinning
        thin = 0;
        updateText(value);
      }
    }

  } // `tick()`


  //// Called when the cursor leaves a control-column element.
  function reset () {
    if ($upper) updateText(value);
    $upper = $lower = $text = valueStr = null;
    velocity = 0.001;
    thin = 0;
  }


  //// Called by `tick()` and `reset()`
  function updateText (value) {
    var newValue;
    if (1000 <= value) {
      newValue = ''+Math.floor(value);
    } else {
      newValue = value.toPrecision(3);
    }
    if ( -1 !== newValue.indexOf('e') ) newValue = parseFloat(newValue);
    if (99 < newValue && 101 > newValue) {
      newValue = 100;
    } else if (9.9 < newValue && 10.1 > newValue) {
      newValue = '10.0';
    } else if (0.99 < newValue && 1.1 > newValue) {
      newValue = '1.00';
    } else if (0.001 > newValue) {
      newValue = '0.00';
    }
    if (displayValue !== newValue) {
      displayValue = newValue;
      $text.setAttribute('bmfont-text', 'text', displayValue);
    }
  }

}();
