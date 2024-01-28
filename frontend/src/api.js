const API_URL = "/api/v1";

export async function postData(data = {}) {
  console.log({ data });
  const response = await fetch(API_URL + "/requests", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(data),
  });
  return response.json();
}
