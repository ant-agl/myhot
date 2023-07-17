import Validation from "./Validation";
import GetData from "./GetData";
import { get2data, data2get } from "./data2get";
import moment from "moment";

import "./search";

let searchValid = new Validation(".search", {
  isOutputErrors: false,
});

$(".form-search-room").on("submit", function (e) {
  e.preventDefault();

  if (!searchValid.validate()) return;

  let data = get2data();
  data.input_date = Math.floor(from.getTime() / 1000);
  data.output_date = Math.floor(to.getTime() / 1000);

  let getData = new GetData();
  if (!data.id) return;
  getData.rooms_search(
    data.id,
    data.input_date,
    data.output_date,
    data.person || 1
  );
});

$(".form-search-room input").on("change", updateGet);
$(".form-search-room").on("click", ".add-child, .delete-child", function () {
  setTimeout(() => {
    updateGet();
  });
});

function updateGet() {
  let dates = $('[name="dates"]').val().trim();
  let adult = $('[name="adult"]').val();
  let childAge = [];
  $('.count-child [name="age"]').each((i, el) => {
    childAge.push($(el).val());
  });
  let child = childAge.length;
  childAge = encodeURIComponent(JSON.stringify(childAge));

  let input_date = moment(dates.split(" - ")[0], "DD.MM.YYYY").valueOf();
  input_date = Math.floor(input_date / 1000);
  let output_date = moment(dates.split(" - ")[1], "DD.MM.YYYY").valueOf();
  output_date = Math.floor(output_date / 1000);
  let person = Number(adult) + Number(child);

  let searchData = { input_date, output_date, person, adult, childAge };

  let data = { ...get2data(), ...searchData };

  window.history.pushState({}, "", data2get(data));
}
