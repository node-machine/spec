module.exports = {
  friendlyName: 'Some input',
  description: 'The brand of gummy worms.',
  extendedDescription: 'The provided value will be matched against all known gummy worm brands.  The match is case-insensitive, and tolerant of typos within Levenstein edit distance <= 2 (if ambiguous, prefers whichever brand comes first alphabetically)',
  moreInfoUrl: 'http://gummy-worms.org/common-brands?countries=all',
  whereToGet: {
    description: 'Look at the giant branding on the front of the package.  Copy and paste with your brain.',
    extendedDescription: 'If you don\'t have a package of gummy worms handy, this probably isn\'t the machine for you.  Check out the `order()` machine in this pack.',
    url: 'http://gummy-worms.org/how-to-check-your-brand'
  },
  example: 'haribo',
  required: true,

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // Note: One can also imagine a poetic sort of "semantic role" for inputs, akin to a "purpose".  This is more or less
  // equivalent to the concept of a "thematic relation" (aka thematic role); where the input is analagous to a linguistic
  // parameter, and the containing machine is analogous to a verb.  More specifically, the _thematic relation_ is a
  // standardized way of indicating how any given runtime value (aka argin) provided for a particular input will be used by
  // the machine.
  //
  // Thus far, this hasn't been sufficiently necessary or beneficial to warrant further prioritization or consideration;
  // neither for runtime tooling, nor for design, nor for static analysis.  Still, when time allows, or if it is revealed
  // this is something that we ought to explore sooner after all, here's the loose spec & motivation:
  //
  // ```
  // thematicRelations: ['manner'],
  // ```
  //
  // I. Why more than one?
  // It's easy to imagine that every input has exactly one, "primary" thematic relation-- but, while this is often true,
  // it is also possible to have an input which exhibits the characteristics of two or more competing thematic roles.
  // For example, an input named `apiToken` in a "Send text message" machine might be assumed to play the role of a
  // "credential", since it is provided in order to identify the caller -- and nothing more.  But in the context of an
  // "Invalidate API token" machine, you might consider the `apiToken` input to be BOTH a "credential" and a "patient"
  // (often the direct object), since the `apiToken` input indicates the thing being destroyed while simultaneously also
  // being used as a credential (e.g. since only an API token's owner or a super-administrator should be allowed to
  // permanently invalidate a particular API token.)
  // > See also:
  // > • https://en.wikipedia.org/wiki/Thematic_relation
  // > • https://en.wikipedia.org/wiki/Transitivity_(grammar)#Form.E2.80.93function_mappings
  //
  // II. Why no "actor", or "force"?
  // One major caveat: the "Actor" thematic relation is a bit wishy-washy when dealing exclusively with the imperative mood.
  // The "true actor" is effectively always the machine itself-- or the currently running process-- or the computer, and thus
  // can't be specified as an argument.  It _is_ tempting to consider that a machine can still do something on _behalf of_ some
  // actor.  For example, in a machine that causes a particular client socket to join a Socket.io room, it could be said that
  // the `socketId` exhibits the "agent" thematic relation.  Still, even then, if you shuffle the words a bit, it would actually
  // be much clearer to say that "(This machine [Agent] will) subscribe the socket w/ this id [Patient/Theme] to notifications
  // from the room with this particular name [Location/Channel])".
  // > See also:
  // > • https://en.wikipedia.org/wiki/Volition_(linguistics))
  //
  // III. What about adjectives?
  // In some cases, an input represents more of an "adjective" -- a property of some other noun-y concept.  For example, in
  // a "Find teddy bears" machine, there might be a `color` input that indicates which color of teddy bears should be returned.
  // In cases like this, it can be pretty hard to determine which thematic relation is appropriate.  In fact, this has not
  // always been consistent in language either; historically, some linguistic traditions never made a distinction between
  // adjectives and adverbs.  For our purposes here, we consider adjectives on a case by case basis.  Since they exist as
  // modifiers, their thematic relation is always related to making the meaning of some noun more precise-- whether that's
  // another input, or something less tangible.  Continuing with our example from above, the `color` input of "Find teddy bears"
  // actually applies to the behavior of the machine directly, since it refers to "teddy bears".  But if our machine was actually
  // "Find stuffed animal products", then you might say that the `color` input might actually provide a narrower meaning on top
  // of some second input, e.g. `stuffedAnimalSpecies`, since it would indicate to our machine that we want to search for "red bears".
  // If ever in doubt, it's safe to assume that adjective inputs should be understood to have "manner" as their thematic relation,
  // since they most often function as adverbs anyway, at least in the context of programming.
  // > See also:
  // > • https://en.wikipedia.org/wiki/Adjective
  //
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  
};
