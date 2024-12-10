export async function fetchData(filters = {}) {
  const params = new URLSearchParams(filters);
  function getTokenFromCookies() {
    const cookies = document.cookie.split("; ");
    for (let cookie of cookies) {
      const [key, value] = cookie.split("=");
      if (key === "token") return value;
    }
    return null;
  }

  const token = getTokenFromCookies();
  if (!token) {
    alert("No token found. Please log in again.");
    window.location.href = "/login.html";
    return [];
  }

  try {
    const response = await axios.get(
      `https://assigmet02server.vercel.app/api/dataset?${params}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log(response, "response");
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);

    if (error.response && error.response.status === 401) {
      alert("Session expired. Please log in again.");
      document.cookie = "token=; path=/; max-age=0;";
      window.location.href = "/login.html";
    } else {
      alert("No Data Found For this Specfic Date Range,Try Another date");
    }

    return [];
  }
}
