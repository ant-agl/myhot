export default function data2get(data) {
  let query = "?";
  for (let key in data) {
    if (key) query += `${key}=${data[key]}&`;
  }
  query = query.slice(0, -1);
  return query;
}

export function get2data(get = false) {
  if (!get) {
    get = window.location.search;
  }
  get = get.slice(1);

  let data = {};
  get.split("&").forEach((item) => {
    let t = item.split("=");
    if (t[0] && t[1] !== undefined) data[t[0]] = t[1];
  });
  return data;
}
