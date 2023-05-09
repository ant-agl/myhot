export function reg_hash(data) {
  console.log(data);
  return new Promise((resolve, reject) => {
    $.ajax({
      type: "POST",
      url: "https://wehotel.ru/handler/reg_hash.php",
      data,
      success: (data) => {
        try {
          data = JSON.parse(data);
          resolve(data);
        } catch (e) {
          reject(e.message);
        }
      },
      error: (xhr) => {
        reject(xhr);
      },
    });
  });
}
export function reg_gen(data) {
  console.log(data);
  return new Promise((resolve, reject) => {
    $.ajax({
      type: "POST",
      url: "https://wehotel.ru/handler/reg_gen.php",
      data,
      success: (data) => {
        console.log(data);
        try {
          data = JSON.parse(data);
          resolve(data);
        } catch (e) {
          reject(e.message);
        }
      },
      error: (xhr) => {
        reject(xhr);
      },
    });
  });
}

export function login_hash(data) {
  console.log(data);
  return new Promise((resolve, reject) => {
    $.ajax({
      type: "POST",
      url: "https://wehotel.ru/handler/login_hash.php",
      data,
      success: (data) => {
        try {
          data = JSON.parse(data);
          resolve(data);
        } catch (e) {
          reject(e.message);
        }
      },
      error: (xhr) => {
        reject(xhr);
      },
    });
  });
}
export function login(data) {
  console.log(data);
  return new Promise((resolve, reject) => {
    $.ajax({
      type: "POST",
      url: "https://wehotel.ru/handler/login.php",
      data,
      success: (data) => {
        try {
          data = JSON.parse(data);
          resolve(data);
        } catch (e) {
          reject(e.message);
        }
      },
      error: (xhr) => {
        reject(xhr);
      },
    });
  });
}
export function forgot_hash(data) {
  console.log(data);
  return new Promise((resolve, reject) => {
    $.ajax({
      type: "POST",
      url: "https://wehotel.ru/handler/recovery_hash.php",
      data,
      success: (data) => {
        try {
          data = JSON.parse(data);
          resolve(data);
        } catch (e) {
          reject(e.message);
        }
      },
      error: (xhr) => {
        reject(xhr);
      },
    });
  });
}
export function recovery_password(data) {
  console.log(data);
  return new Promise((resolve, reject) => {
    $.ajax({
      type: "POST",
      url: "https://wehotel.ru/handler/recovery_password.php",
      data,
      success: (data) => {
        try {
          data = JSON.parse(data);
          resolve(data);
        } catch (e) {
          reject(e.message);
        }
      },
      error: (xhr) => {
        reject(xhr);
      },
    });
  });
}
