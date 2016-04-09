'use strict';

/**
 * Extend an Object with another Object's properties.
 *
 * The source objects are specified as additional arguments.
 *
 * @param dst Object the object to extend.
 *
 * @return Object the final object.
 */
const _extend = function(dst) {
  const sources = Array.prototype.slice.call(arguments, 1);
  let i;
  for (i=0; i<sources.length; ++i) {
    let src = sources[i], p;
    for (p in src) {
      if (src.hasOwnProperty(p)) dst[p] = src[p];
    }
  }
  return dst;
};


/**
  Performs droid placement and movement operations on a 2D grid, checking for collision.
  Droids are placed and moved sequentially: place droid 1, move droid 1, place droid 2,
  move droid 2, and so on. A droid can be placed, and then not moved (it will lose its
  chance to move when a new droid is placed).

  Options:
   - width: width of the grid (default 16)
   - height: height of the grid (default 16)

  Usage:
    const DroidGrid = require('droidgrid');
    const opts = { width: 6, height: 6 };
    let grid = new DroidGrid(opts);
    grid.placeDroid(1, 2, 'north');
    grid.moveDroid(['left', 'move', 'right', 'move']);
    let snapshot = grid.snapshot();
 */
function DroidGrid(options) {
  var defaults = {
    width: 16,
    height: 16
  };
  this.options = _extend({}, defaults, options);

  this.init();
}

DroidGrid.prototype.init = function() {
  if (this.options.droids) {
    this.validateDroids(this.options.droids);
  }
  this.droids = this.options.droids || [];
  this.width = this.options.width;
  this.height = this.options.height;

  if (this.width < 1 || this.height < 1) {
    throw new Error('Invalid grid size, must be integers greater than 1');
  }
};

// TODO: Refactor these valid* into callback form maybe, better error handling
DroidGrid.prototype.validDroidObject = function (droid) {
  function validCoordinate (coord, bound) {
    return coord && Number.isInteger(coord) && coord < bound;
  }
  return validCoordinate(droid.x, this.width) && validCoordinate(droid.y, this.height);
};

DroidGrid.prototype.validDroidCoordinates = function (droid) {
  function validFacing (droid) {
    const validFacings = ['north', 'south', 'west', 'east'];
    return droid.facing && validFacings.indexOf(droid.facing) !== -1;
  }
  function withinBounds (droid) {
    return droid.x !== undefined && droid.y !== undefined && droid.x >= 0 && droid.y >= 0;
  }
  return droid && (typeof droid === 'object') && withinBounds(droid) && validFacing(droid);
};

DroidGrid.prototype.droidsOverlapping = function (droids) {
  let i, pi, overlap = false;
  for (i = 1; i < droids.length && !overlap; i++) {
    for (pi = i - 1; pi >= 0 && !overlap; pi--) {
      // Match every droid's coordinates against previous ones, error if match found
      if (droids[i].x === droids[pi].x && droids[i].y === droids[pi].y) {
        overlap = true;
      }
    }
  }

  return overlap;
};

DroidGrid.prototype.validateDroids = function (droids) {
  if (!Array.isArray(droids)) {
    throw new Error('Invalid droids: not an array');
  }

  if (!droids.every(this.validDroidObject)) {
    throw new Error('Invalid droid object');
  }

  if (!droids.every(this.validDroidCoordinates)) {
    throw new Error('Invalid coordinates for droid');
  }

  if (this.droidsOverlapping(droids)) {
    throw new Error('Droids are overlapping');
  }

  return true;
};

DroidGrid.prototype.placeDroid = function(x, y, facing) {
  let droid = {
    x: x,
    y: y,
    facing: facing
  };

  if (!this.validDroidObject(droid)) {
    throw new Error('Invalid droid object');
  }

  if (!this.validDroidCoordinates(droid)) {
    throw new Error('Invalid coordinates for droid');
  }

  if (this.droids.length) {
    let checkDroids = this.droids.slice();
    checkDroids.push(droid);
    if (this.droidsOverlapping(checkDroids)) {
      throw new Error('Coordinates occupied');
    }
  }

  this.droids.push(droid);
};

DroidGrid.prototype.moveForward = function() {
  const movement = {
    north: [0, 1],
    east: [1, 0],
    south: [0, -1],
    west: [-1, 0]
  };

  const currentDroid = this.droids[this.droids.length - 1];
  const curX = currentDroid.x;
  const curY = currentDroid.y;
  const moveAction = movement[currentDroid.facing];
  const nextX = curX + moveAction[0];
  const nextY = curY + moveAction[1];

  let tentativeDroid = {
    x: nextX,
    y: nextY,
    facing: currentDroid.facing
  };

  if (!this.validDroidCoordinates(tentativeDroid)) {
    throw new Error('Movement out of bounds');
  }

  if (this.droids.length > 1) {
    let otherDroids = this.droids.slice(0, -1);

    otherDroids.push(tentativeDroid);

    if (this.droidsOverlapping(otherDroids)) {
      throw new Error('Movement action collides with other droid');
    }
  }

  currentDroid.x = nextX;
  currentDroid.y = nextY;
};

DroidGrid.prototype.rotateDroid = function(step) {
  const rotateClockwise = ['north', 'east', 'south', 'west'];
  const currentFacing = this.droids[this.droids.length - 1].facing;
  const currentFacingIndex = rotateClockwise.indexOf(currentFacing);
  let newIndex = Math.abs(currentFacingIndex + step) % rotateClockwise.length;
  if ((currentFacingIndex + step) < 0) {
    newIndex = rotateClockwise.length - newIndex;
  }

  this.droids[this.droids.length - 1].facing = rotateClockwise[newIndex];
};

DroidGrid.prototype.moveDroid = function(actions) {
  if (!Array.isArray(actions)) {
    actions = [actions];
  }

  function validAction (action) {
    const validActions = ['left', 'right', 'move'];
    return validActions.indexOf(action) !== -1;
  }

  if (!actions.every(validAction)) {
    throw new Error('Invalid move action');
  }

  let i;
  for (i = 0; i < actions.length; i++) {
    switch (actions[i]) {
      case 'left':
        this.rotateDroid(-1);
        break;
      case 'right':
        this.rotateDroid(1);
        break;
      case 'move':
        this.moveForward();
        break;
      default:
        throw new Error('Invalid move action');
    }
  }
};

DroidGrid.prototype.snapshot = function() {
  return {
    width: this.width,
    height: this.height,
    droids: this.droids
  };
};

module.exports = DroidGrid;
