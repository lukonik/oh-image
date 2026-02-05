import queryString from "query-string";

const parse = (query: string) => {
  return queryString.parse(query, {
    parseBooleans: true,
    parseNumbers: true,
    arrayFormat: "comma",
  });
};

const parseFromId = (id: string) => {
  const query = id.split("?")[1];
  return query ? parse(query) : null;
};

export { parseFromId };
