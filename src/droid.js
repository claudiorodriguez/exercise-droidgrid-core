'use strict';

class Droid {
  constructor (x, y, facing) {
    if (!Droid._validFacing(facing)) {
      throw new Error('Invalid droid initial facing');
    }

    function validCoordinate (coord) {
      return coord !== undefined && Number.isInteger(coord) && coord >= 0;
    }
    if (!validCoordinate(x) || !validCoordinate(y)) {
      throw new Error('Invalid droid coordinates');
    }

    this.facing = facing;
    this.x = x;
    this.y = y;
  }

  move (back) {
    const movement = {
      north: [0, 1],
      east: [1, 0],
      south: [0, -1],
      west: [-1, 0]
    };

    const moveAction = movement[this.facing];
    const xStep = moveAction[0];
    const yStep = moveAction[1];

    if (back) {
      xStep = 0 - xStep;
      yStep = 0 - yStep;
    }

    this.x += moveAction[0];
    this.y += moveAction[1];
  }

  back () {
    this.move(true);
  }

  rotate (clockwise) {
    const rotateClockwise = ['north', 'east', 'south', 'west'];
    const currentFacingIndex = rotateClockwise.indexOf(this.facing);
    const step = clockwise ? 1 : -1;
    let newIndex = Math.abs(currentFacingIndex + step) % rotateClockwise.length;
    if ((currentFacingIndex + step) < 0) {
      newIndex = rotateClockwise.length - newIndex;
    }

    this.facing = rotateClockwise[newIndex];
  }

  dump () {
    return {
      x: this.x,
      y: this.y,
      facing: this.facing
    };
  }

  static collisionCheck (droids) {
    let i, pi, collision = false;
    for (i = 1; i < droids.length && !collision; i++) {
      for (pi = i - 1; pi >= 0 && !collision; pi--) {
        // Match every droid's coordinates against previous ones, collision if match found
        if (droids[i].x === droids[pi].x && droids[i].y === droids[pi].y) {
          collision = true;
        }
      }
    }
    return collision;
  }

  static _validFacing (facing) {
    const facings = ['north', 'west', 'south', 'east'];
    return facings.indexOf(facing) !== -1;
  }
}

module.exports = Droid;
