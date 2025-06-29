export const body = () => {
  const chain = {
    isEmail: () => chain,
    isLength: () => chain,
    matches: () => chain,
    notEmpty: () => chain,
    optional: () => chain,
    isString: () => chain,
    isInt: () => chain,
    isDate: () => chain,
    withMessage: () => chain,
    run: async () => ({
      isEmpty: () => true,
      array: () => []
    })
  };
  return chain;
};

export const param = body;
export const query = body;
export const validationResult = () => ({
  isEmpty: () => true,
  array: () => []
});

export default { body, param, query, validationResult }; 