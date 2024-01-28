const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://t5cm4v4fol.execute-api.us-west-2.amazonaws.com/"
    : "https://yozv3qlx9a.execute-api.us-west-2.amazonaws.com/";

export async function postData(path, data = {}) {
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
