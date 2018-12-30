
export const explain = ({ given, should }) => `should ${should} given ${given}`;

export const assert = ({ given, should, expected, actual } = {}, fn) => {
  if (typeof fn === 'function') {
    return it(explain({ given, should }), fn);
  }
  else {
    return it(explain({ given, should }), () => expect(actual).toEqual(expected));
  }
};

