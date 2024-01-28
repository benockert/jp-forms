const API_URL = "https://yozv3qlx9a.execute-api.us-west-2.amazonaws.com/";

export async function postData(path, data = {}) {
  console.log({ data });
  const response = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(data),
  });
  return response.json();
}

export async function getData(path) {
  const response = await fetch(`${API_URL}${path}`);
  return response.json();
}