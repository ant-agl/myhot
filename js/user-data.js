$.get('', data => {
  data = {
    "name": "Иван", 
    "surname": "Иванов", 
    "second_name": "Иванович", 
    "email": "ivanovivan@gmail.ru",
    "date": "11.10.1992",
    "number": 79617910592,
    "change_password": "12.03.2023", 
    "image": "ссылка"
  };

  for (let name in data) {
    $(`[name="${name}"]`).val(data[name]);
  }
});