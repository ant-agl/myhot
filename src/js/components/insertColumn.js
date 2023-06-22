export default function insertColumn($col1, $col2, html) {
  let h1 = 0;
  $col1.find("> *").each((i, el) => (h1 += $(el).outerHeight()));
  let h2 = 0;
  $col2.find("> *").each((i, el) => (h2 += $(el).outerHeight()));

  if (h1 <= h2) $col1.append(html);
  else $col2.append(html);
}
