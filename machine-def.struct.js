module.exports = {

  friendlyName: 'Do something',


  description: 'Do a thing (should be <=140 characters written in the imperative mood)',


  extendedDescription: 'Longer description. Markdown syntax supported.',


  moreInfoUrl: 'http://hello.com',


  sideEffects: 'idempotent', // either omit or set as "cacheable" or "idempotent"


  habitat: 'sails', // either omit or set as "request" or "sails"


  sync: true, // either omit or set as `true`


  inputs: {

    someInput: require('./input-def.struct')

  },


  exits: {

    someExit: require('./exit-def.struct')

  },
  
  
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
  // FUTURE:
  // In the machine specification, we always leverage "s-selection"; that is, the implementation exposes named
  // inputs, allowing a caller invoking a machine to configure runtime arguments for particular inputs based
  // on their meaning.  But this contrasts with how traditional subroutines in many programming languages are
  // addressed.  Most languages use "c-selection" to assign runtime arguments to parameters (i.e. inputs) of
  // a function.
  //
  // While these kind of syntactic/grammatical relations can be precisely imitated by runtime tooling, it is
  // helpful to be able to declare it in a standardized way, as part of the machine definition itself.  This
  // has practical utility for when full or partial serial assignment is the only option (e.g. a web-based API
  // that must support taking in data via route/path parameters in its URL pattern; or a CLI script that must
  // accept serial command-line arguments).
  // > For an example, see:
  // > • https://github.com/sailshq/machine-as-script/tree/e1a54d18d65809eb4cfa64bfe9db4ae925146e77#using-serial-command-line-arguments
  // 
  // ```
  // args: ['someInput']
  // ```
  //
  // I. What about variadic usage?
  // Currently, the machine specification does not allow for variadic usage (although there is limited,
  // non-standard support for this in machine-as-script).  This is something that makes perfect sense for
  // future versions of the spec.  This would allow for numerous additional possibilities; e.g.
  // ```
  // args: [
  //   ['foo', 'bar', 'baz'],             // << indicating order, and which inputs can be satisfied via serial usage (not all of them must be, necessarily -- imagine serial CLI arguments (`sails new foo`) vs. CLI options (`sails new foo --without='grunt'`) )
  //   ['foo', 'baz'],                    // << indicating structual optional-ness of serial args (both of these usages existing indicates that either usage is acceptable)
  //   ['foo', 'bar', 'baz', 'blazes[]'], // << n-ary/variadic functions that support bundling of extra serial arguments as an array, then passing that array in for a particular input (but note that this is the LAST serial argument, and also that it is only acceptable if it lists at least one more argument than every other serial usage that has been declared.  This is just to avoid ambiguity / unnecessary runtime performance degredation for extra data-type checking.)
  //   ['done()'],                        // << this special, parentheses-trailed syntax indicates that this serial argument is actually a replacement for `exits` (note that this is not recommended with variadic usage, since the callback should always be the last argument, and variadic usage would force the callback to come first.  The name before the parentheses does not actually matter.)
  // ]
  // ```
  //
  // II. Does this affect the implementation (`fn`)?  Or is it just a guideline for runners as far as providing usage?
  // Out of the box, `args` does not necessarily have any impact on usage.  That's up to the runner.
  // As far as the implementation: by itself, the presence of `args` does not change the expected implementation of `fn`.
  // However, that can be instrumented (see below).
  //
  // III. Can I use special syntax for an asynchronous callback with a synchronous (blocking) machine?
  // No.  When `sync: true`, special callback syntax (e.g. `done()`) is NOT permitted in `args`.
  // 
  // IV. Can I specify special syntax for more than one asynchronous callback?
  // No.  Only standard Node callback syntax is supported in the spec.  (Just about any imaginable mash-up
  // can be exposed at the runner level using only this abstraction-- including support for promises, async/await,
  // generators, and even fibers.)
  // 
  // > See also:
  // > • https://en.wikipedia.org/wiki/Theta_role
  // > • https://en.wikipedia.org/wiki/Theta_criterion
  // > • https://en.wikipedia.org/wiki/Morphosyntactic_alignment
  // > • https://en.wikipedia.org/wiki/Grammatical_relation
  // > • https://en.wikipedia.org/wiki/Arity#Variable_arity
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
  
  
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
  // FUTURE:
  // In certain situations (mainly just for low-level machines, such as adding two numbers), the default approach
  // for implementing machines adds a certain amount of inconvenient overhead & latency; at least when compared
  // with a traditional userland function or native operator.  This performance hit is irrespective of the runner
  // being used-- it's tied to the fact that an `exits` object and multiple handler callbacks must be constructed
  // (whereas normally, you can add two numbers without doing all that).
  //
  // So to work around that, a machine could declare `implementationType: 'traditional'`, which indicates that `args`
  // must also be provided, and that `fn` should be implemented something like the following:
  // > • Remember: when `sync: true`, special syntax for an asynchronous callback (e.g. `done()`) is NOT permitted in `args`!
  // > • If `args` is omitted, runners might opt to rely on key order of `inputs`. (But if they fall back to this, they should log a warning.)
  // ```
  // sync: true,
  // args: ['numerator','denominator'],
  // inputs: { /*...*/ },
  // exits: {
  //   success: { outputFriendlyName: 'Quotient', outputExample: 123 },
  //   badDenominator: {
  //     description: 'That is not a valid denominator.',
  //     outputFriendlyName: 'Approximation',
  //     outputExample: 9007199254740991
  //   }
  // },
  // implementationType: 'classic',
  // fn: function(numerator, denominator) {
  //   var flaverr = require('flaverr');
  //   
  //   if (Object.is(denominator, -0)) {
  //     throw flaverr({
  //       exit: 'badDenominator',
  //       output: Number.MIN_SAFE_INTEGER||-9007199254740991
  //     }, new Error('Cannot divide by zero!));
  //   }
  //   else if (Object.is(denominator, 0)) {
  //     throw flaverr({
  //       exit: 'badDenominator',
  //       output: Number.MAX_SAFE_INTEGER||9007199254740991
  //     }, new Error('Cannot divide by zero!));
  //   }
  //   else {
  //     return numerator / denominator;
  //   }
  //
  //   // (Finally, note: to get access to `env`, you can do `this` -- e.g. `this.req`).
  // }
  // ```
  //
  // Now consider the same thing, but for an asynchronous function:
  // > Note that `args` is required, and that it must contain a special item indicating the callback -- e.g. `done()`
  // > Also note that other lambda functions -- e.g. an iteratee function -- do not get the `()` suffix!
  // > • Since `sync` is not enabled, special syntax like `done()` is REQUIRED in the `args` list
  // > • Since `sync` is not enabled, the return value is ignored.  In the incident of a caught exception (key word "CAUGHT" -- careful in your callbacks!), the `error` exit is assumed, and triggered automatically.
  // ```
  // friendlyName: 'For each user...',
  // args: [
  //   ['criteria','populates','handleEachRecord','done()'],
  //   ['criteria','handleEachRecord','done()'],
  // ],
  // inputs: { /*...*/ },
  // exits: {
  //   success:  { outputFriendlyName: 'Num streamed', outputExample: 3 },
  //   badCriteria: { description: 'Invalid `criteria`.' },
  //   badPopulates: { description: 'Invalid `populates`.' },
  // },
  // implementationType: 'classic',
  // fn: function(criteria, populatesOrHandleEachRecord, handleEachRecordOrDone, doneMaybe) {
  //   var _ = require('lodash');
  //   var flaverr = require('flaverr');
  //
  //   // If there are only 3 arguments, then we know `populates` must have been omitted.
  //   // (so shift everything over as needed)
  //   var done;
  //   var handleEachRecord;
  //   if (_.isUndefined(done)) {
  //     done = handleEachRecordOrDone;
  //     handleEachRecord = populatesOrHandleEachRecord;
  //   }
  //   else {
  //     done = doneMaybe;
  //     handleEachRecord = handleEachRecordOrDone;
  //   }
  //
  //   var numRecordsStreamed = 0;
  //   User.stream(criteria, populates)
  //   .eachRecord(function(record, next){
  //     handleEachRecord(record);
  //     numRecordsStreamed++;
  //     return next();
  //   })
  //   .exec(function (err) {
  //     if (err && err.name === 'UsageError' && err.code === 'E_BAD_CRITERIA') {
  //       return done(flaverr({exit: 'badCriteria'}, err);
  //     }
  //     if (err && err.name === 'UsageError' && err.code === 'E_BAD_POPULATES') {
  //       return done(flaverr({exit: 'badPopulates'}, err);
  //     }
  //     else if (err) { return done(err); } // << misc. (===`error` exit)
  //     else { return done(undefined, numRecordsStreamed); }
  //   });
  // }
  // ```
  //
  // For reference, here's an equivalent way to write the same example as above:
  // (equivalent from a usage perspective, anyway)
  // ```
  // friendlyName: 'For each user...',
  // args: [
  //   ['criteria','populates','handleEachRecord','done()'],
  //   ['criteria','handleEachRecord','done()'],
  // ],
  // inputs: { /*...*/ },
  // exits: { /*...*/ },
  // (Notice we removed the `implementationType`!)
  // fn: function (inputs, exits) {
  //
  //   // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
  //   // Note that variadics are take care of automatically by our runner
  //   // when it maps the incoming data over to this implementation type. 
  //   // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
  //
  //   var numRecordsStreamed = 0;
  //   User.stream(inputs.criteria, inputs.populates)
  //   .eachRecord(function(record, next){
  //     inputs.handleEachRecord(record);
  //     numRecordsStreamed++;
  //     return next();
  //   })
  //   .exec(function (err) {
  //     if (err && err.name === 'UsageError' && err.code === 'E_BAD_CRITERIA') {
  //       return exits.badCriteria(err);
  //     }
  //     if (err && err.name === 'UsageError' && err.code === 'E_BAD_POPULATES') {
  //       return exits.badPopulates(err);
  //     }
  //     else if (err) { return done(err); } // << misc. (===`error` exit)
  //     else { return exits.success(numRecordsStreamed); }
  //   });
  // }
  // ```
  //
  // > See also:
  // > • https://en.wikipedia.org/wiki/Evaluation_strategy
  // > • https://en.wikipedia.org/wiki/Parameter_(computer_programming)#Named_parameters
  // > • http://stackoverflow.com/a/7223395/486547  (as an aside re negative zero vs. positive zero and about `Object.is()`)
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 


  fn: function (inputs, exits) {

    var _ = require('@sailshq/lodash');

    setTimeout(function (){

      try {

        var luckyNum = Math.random();
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
