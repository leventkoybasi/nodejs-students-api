//with regular function
export function ctrlWrapper(controller) {
  return async function (req, res, next) {
    try {
      await controller(req, res, next);
    } catch (error) {
      next(error);
    }
  };
}

// with arrow function
export const ctrlWrapper2 = (controller) => async (req, res, next) => {
  try {
    await controller(req, res, next);
  } catch (error) {
    next(error);
  }
};
