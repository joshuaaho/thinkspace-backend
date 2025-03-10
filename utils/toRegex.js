const toRegex = (q) => {
  const trimmedQuery = q.trim();
  if (trimmedQuery === '') {
    return /.*/; // Return a regex that matches any string
  }

  // Split the trimmed query into keywords
  const keywords = trimmedQuery
    .split(' ')
    .map((keyword) => keyword.trim())
    .filter(Boolean);

  // Create a regex pattern from the keywords
  const pattern = new RegExp(keywords.join('|'), 'i'); // 'i' for case-insensitive matching

  // Filter posts that match the regex pattern

  return pattern;
};

export default toRegex;
