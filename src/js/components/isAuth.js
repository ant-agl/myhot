export default async function isAuth() {
  return new Promise(async (resolve) => {
    let token = document.cookie
      .split(";")
      .map((item) => {
        let t = item.split("=").map((t) => t.trim());
        return { key: t[0], value: t[1] };
      })
      .find((item) => item.key == "token")?.value;
    localStorage.token = token || "";

    debugger;
    if (!token) {
      resolve({
        ok: false,
      });
    }

    if (location.hostname == "localhost") {
      resolve({
        name: "wefew",
        surname: "wefewf",
        patronymic: "wefefw",
        ok: true,
      });
      return;
    }

    debugger;
    $.ajax({
      type: "GET",
      url: "https://wehotel.ru/handler/auth.php",
      headers: {
        "X-Auth": token,
      },
      success: (data) => {
        debugger;
        data = JSON.parse(data);
        data.ok = true;
        console.log(data);

        $.ajax({
          type: "GET",
          url: "https://wehotel.ru/handler/get_pre_reserve.php",
          headers: {
            "X-Auth": token,
          },
          success: (pre_reserve) => {
            pre_reserve = JSON.parse(pre_reserve);
            console.log(pre_reserve);
            data.pre_reserve = pre_reserve.pre_reserve;
            resolve(data);
          },
        });
      },
      error: (xhr) => {
        debugger;
        document.cookie = "token=; path=/; max-age=-1";
        localStorage.clear("token");

        console.error(xhr);
        resolve({
          ok: false,
        });
      },
    });
  });
}
