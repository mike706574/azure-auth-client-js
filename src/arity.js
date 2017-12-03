class ArityError extends Error {}

export default function arity(args, arity) {
  if(args.length !== arity) {
    const actualArity = args.length;
    const message = `ArityError: Function expected to be called with ${arity} arguments, but got ${actualArity}.`;
    throw new ArityError(message);
  }
}
