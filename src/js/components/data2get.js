export default function data2get(data) {
  let query = "?";
  for (let key in data) {
    query += `${key}=${data[key]}&`;
  }
  query = query.slice(0, -1);
  return query;
}
