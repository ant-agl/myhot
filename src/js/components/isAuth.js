export default async function isAuth() {
  return new Promise(async (resolve) => {
    let token = localStorage.token;
    if (!token)
      resolve({
        ok: false,
      });
    resolve({
      name: "wefew",
      surname: "wefewf",
      patronymic: "wefefw",
      ok: true,
    });
    return;
    $.ajax({
      type: "GET",
      url: "https://wehotel.ru/handler/auth.php",
      headers: {
        "X-Auth": token,
      },
      success: (data) => {
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
