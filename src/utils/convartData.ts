const convertData = (input: any): any => {
  try {
    // Check if input is a string that needs to be parsed (may include escaped quotes)
    if (
      typeof input === 'string' &&
      input.startsWith('"') &&
      input.endsWith('"')
    ) {
      return false;
    } else {
      const jsonObj = JSON.parse(input);
      return jsonObj;
    }
  } catch {
    return false;
  }
};

export default convertData;