const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://t5cm4v4fol.execute-api.us-west-2.amazonaws.com/"
    : "https://yozv3qlx9a.execute-api.us-west-2.amazonaws.com/";

export async function postData(path, data = {}) {
  try {
    const response = await fetch(`${API_URL}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(data),
    });
    return response.json();
  } catch (error) {
    return {
      result: "error",
      message: "An error has occurred. Please try again.",
    };
  }
}

export async function getData(path) {
  try {
    const response = await fetch(`${API_URL}${path}`);
    const body = await response.json();
    return { statusCode: response.status, data: body };
  } catch (error) {
    return {};
  }
}
