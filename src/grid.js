'use strict';

const Droid = require('./droid');

class Grid {
  constructor (width, height) {
    if (width < 1 || height < 1) {
      throw new Error('Invalid grid size, must be integers greater than 1');
    }

    this.width = width;
    this.height = height;
    this._droids = [];
  }

  add (droid) {
    this._boundCheck(droid);
    if (this._droids.length) {
      let checkDroids = this._droids.slice();
      checkDroids.push(droid);
      if (Droid.collisionCheck(checkDroids)) {
        throw new Error('Coordinates occupied');
      }
    }

    this._droids.push(droid);
  }

  execute (actions) {
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

    const droid = this._droids[this._droids.length - 1];

    let i;
    for (i = 0; i < actions.length; i++) {
      switch (actions[i]) {
        case 'left':
          droid.rotate(false);
          break;
        case 'right':
          droid.rotate(true);
          break;
        case 'move':
          droid.move();
          if (Droid.collisionCheck(this._droids)) {
            droid.back();
            throw new Error('Droid collision detected');
          }
          break;
        default:
          throw new Error('Invalid move action');
      }
    }
  }

  dump () {
    return {
      width: this.width,
      height: this.height,
      droids: this._droids.map((droid) => { return droid.dump() })
    }
  }

  _boundCheck (droid) {
    if (!(droid instanceof Droid)) {
      throw new Error('Invalid droid object');
    }

    if (droid.x >= this.width || droid.y >= this.height) {
      throw new Error('Droid is out of grid bounds');
    }
  }
}

module.exports = Grid;
