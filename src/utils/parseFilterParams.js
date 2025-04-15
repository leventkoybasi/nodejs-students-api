const parseNumber = (value) => {
  const parsedValue = Number(value);
  if (isNaN(parsedValue)) {
    return null;
  }
  return parsedValue;
};

const parseGenderValue = (value) => {
  const genderValues = ['male', 'female', 'other'];

  if (genderValues.includes(value)) {
    return value;
  }
  return null;
};

/*
gender
maxAge
minAge
maxAvgMark
minAvgMark
*/

export const parseFilterParams = (query) => {
  const { gender, maxAge, minAge, maxAvgMark, minAvgMark } = query;

  const genderValue = parseGenderValue(gender);
  const maxAgeValue = parseNumber(maxAge);
  const minAgeValue = parseNumber(minAge);
  const maxAvgMarkValue = parseNumber(maxAvgMark);
  const minAvgMarkValue = parseNumber(minAvgMark);

  return {
    maxAge: maxAgeValue,
    minAge: minAgeValue,
    maxAvgMark: maxAvgMarkValue,
    minAvgMark: minAvgMarkValue,
    gender: genderValue,
  };
};
