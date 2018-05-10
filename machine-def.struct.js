module.exports = {

  friendlyName: 'Do something',


  description: 'Do a thing (should be <=80 characters written in the imperative mood)',


  extendedDescription: 'Longer description. Markdown syntax supported.',


  moreInfoUrl: 'http://hello.com',


  habitat: 'sails', // either omit or set as "request", "sails", "node", or "browser".


  //sync: true, // either omit or set as `true`


  // sideEffects: 'idempotent', // either omit or set as "cacheable" or "idempotent"


  handleUndo: async function(inputs){ // either omit or set as a function
    // ^^ should never be defined for a "cacheable" machine

    // Reverse `fn`'s side effect.
    // (Note that this is not a GLOBAL UNDO!!!  In this example, this code could
    // not attempt to handle any changes that might have befallen the global var
    // from other logic.  It can really only attempt to reverse the side effects
    // of running `fn` with these inputs, and even then only assuming `fn`
    // triggered its success exit.)
    
    // Realistically, it's not super possible w/ this example, but we can at
    // least fudge it a little bit:
    if (global.foo) {
      // if we knew how much to subtract, we could do that here, for example
    }

    // (In reality, this example isn't really reversible, so we would not
    // want to define a handleUndo function at all!)

  },


  inputs: {

    someInput: require('./input-def.struct')

  },


  exits: {

    someExit: require('./exit-def.struct')

  },


  fn: async function (inputs, exits) {

    // Import any dependencies here
    var _ = require('@sailshq/lodash');

    // Do asynchronous things with callbacks if you like
    // (or better yet, use `await`!)
    setTimeout(function (){

      try {

        let luckyNum = Math.random();
        if (luckyNum > 0.5) {
          throw new Error('whatever');
        }
        else if (luckyNum < 0.1) {
          // Exit `someExit` with no output.
          return exits.someExit();
          // > NOTE:
          // > To send back output, could have done:
          // > ```
          // > return exits.someExit(luckyNum);
          // > ```
          // > (^^but if so, we would need to define an `outputExample` in our `someExit` definition!)
        }

      } catch (e) { return exits.error(e); }

      // --• OK so if we made it here, `luckyNum` must be between 0.1 and 0.5 (exclusive).

      // Maybe do some kind of side effect.
      global.foo = (global.foo || 0) + luckyNum;

      // Exit `success` with no output.
      return exits.success();
      // > NOTE:
      // > To send back output, could have done:
      // > ```
      // > return exits.success(luckyNum);
      // > ```
      // > (^^but if so, we would need to define `success` exit with an `outputExample`!)

    }, 500);//</setTimeout>
  }


};
