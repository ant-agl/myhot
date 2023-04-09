export default function getColor(number) {
  let color = "green";
  if (number <= 7) color = "lightgreen";
  if (number <= 5) color = "yellow";
  if (number <= 3) color = "red";
  return color;
}
