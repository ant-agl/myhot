export default async function isAuth() {
  return new Promise(async (resolve) => {
    let token = document.cookie
      .split(";")
      .map((item) => {
        let t = item.split("=").map((t) => t.trim());
        return { key: t[0], value: t[1] };
      })
      .find((item) => item.key == "token")?.value;
    localStorage.token = token;
    if (!token)
      resolve({
        ok: false,
      });
    // resolve({
    //   name: "wefew",
    //   surname: "wefewf",
    //   patronymic: "wefefw",
    //   ok: true,
    // });
    // return;
    $.ajax({
      type: "GET",
      url: "https://wehotel.ru/handler/auth.php",
      headers: {
        "X-Auth": token,
      },
      success: (data) => {
        data = JSON.parse(data);
        data.ok = true;
        console.log(data);
        resolve(data);
      },
      error: (xhr) => {
        console.error(xhr);
        resolve({
          ok: false,
        });
      },
    });
  });
}
