// TODO: This is kind of the start of a structural validation library for
// objects. I wish there was an open source library that I trusted enough to use
// instead.
function pathToString(path) {
  return path.join('.');
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function toArrayPath(path) {
  if(typeof path === 'string') {
    return [path];
  }

  if(path.constructor === Array) {
    return path;
  }

  throw new Error(`Value ${path} must be either a key or a path.`);
}

function requiredProp(object, context, path) {
  let value = object,
      arrayPath = toArrayPath(path);

  for(let i = 0; i < arrayPath.length; i++) {
    const key = arrayPath[i];
    value = value[key];
    if(!value) {
      throw new Error(`Missing required ${context} property: ${pathToString(arrayPath)}`);
    }
  }

  return value;
}

function typeError(path, context, value, expectedType, actualType) {
  const capitalizedContext = capitalizeFirstLetter(context),
        message = `${capitalizedContext} property ${pathToString(path)}` +
                  `with value "${value}" must be a ${expectedType}; got ${actualType}.`;
  return new Error(message);
}

export function isObject(value) {
  return typeof value === 'object';
}

export function assertObject(value, context, path) {
  if(!isObject(value)) {
    throw typeError(path, context, value, 'object', typeof value);
  }
}

export function requiredString(object, context, path) {
  let value = requiredProp(object, context, path);

  const type = typeof value;
  if(type === 'string') {
    return value;
  }

  throw typeError(path, context, value, 'string', type);
}

export function requiredStrings(object, context, paths) {
  paths.forEach(path => requiredString(object, context, path));
}

export function requiredInt(object, context, path) {
  let value = requiredProp(object, context, path);

  if(value === parseInt(value, 10)) {
    return value;
  }

  throw typeError(object, context, path, 'integer', typeof value);
}

export function requiredObject(object, context, path) {
  let value = requiredProp(object, context, path);

  if(!isObject(value)) {
    throw typeError(object, context, path, 'object', typeof value);
  }
}
