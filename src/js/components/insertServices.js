import insertColumn from "./insertColumn";
import GetData from "./GetData";
import { relativeTimeRounding } from "moment";
let allService;
export function insertServices(services, columns, options = {}) {
  return new Promise((resolve) => {
    if (!allService) {
      let getData = new GetData();
      getData.getAllServices().then((data) => {
        allService = data;
      });
    }
    let interval = setInterval(() => {
      if (!allService) return;

      if (services.free.length == 0) {
        insertColumn(
          columns.free.$col1,
          columns.free.$col2,
          "Услуги отсутствуют"
        );
      }
      services.free.forEach((id) => {
        if (!columns.free) return;
        let html = "";
        let $category;
        if (options.$block) {
          $category = options.$block.find(
            `.${columns.free.class} [data-category="${allService[id].category}"]`
          );
        } else {
          $category = $(
            `.${columns.free.class} [data-category="${allService[id].category}"]`
          );
        }
        let category = allService[id].category ?? "";

        let item = `<div class="${options.classes.row}">${allService[id].name}</div>`;

        if ($category.length == 0 && category) {
          html += `<div class="${options.classes.category}" data-category="${category}">${category}</div>`;
          html += item;
          insertColumn(columns.free.$col1, columns.free.$col2, html);
        } else if ($category.length > 0 && category) {
          html += item;
          $category.after(html);
        } else {
          html += item;
          insertColumn(columns.free.$col1, columns.free.$col2, html);
        }
      });
      if (services.paid.length == 0) {
        insertColumn(
          columns.paid.$col1,
          columns.paid.$col2,
          "Услуги отсутствуют"
        );
      }
      services.paid.forEach((id, i) => {
        if (!columns.paid) return;
        let html = "";
        let $category;
        if (options.$block) {
          $category = options.$block.find(
            `.${columns.paid.class} [data-category="${allService[id].category}"]`
          );
        } else {
          $category = $(
            `.${columns.paid.class} [data-category="${allService[id].category}"]`
          );
        }

        let category = allService[id].category ?? "";

        let item = "";
        if (options.isInput) {
          item = `
            <div class="${options.classes.row}">
              <label>
                <input type="checkbox" value="${
                  services.price[i]
                }" data-id="${id}">
                ${allService[id].name}
              </label>
              <div class="${options.classes.price}">${services.price[
            i
          ].toLocaleString()} руб.</div>
            </div>
          `;
        } else {
          item = `
            <div class="${options.classes.row}">
              <span>${allService[id].name}</span>
              <span class="${options.classes.price}">${services.price[
            i
          ].toLocaleString()} руб.</span>
            </div>
          `;
        }

        if ($category.length == 0 && category) {
          html += `<div class="${options.classes.category}" data-category="${category}">${category}</div>`;
          html += item;
          insertColumn(columns.paid.$col1, columns.paid.$col2, html);
        } else if ($category.length > 0 && category) {
          html += item;
          $category.after(html);
        } else {
          html += item;
          insertColumn(columns.paid.$col1, columns.paid.$col2, html);
        }
      });

      resolve();
      clearInterval(interval);
    }, 1);
  });
}
