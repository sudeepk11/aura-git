export async function getUserIPInfo() {
  try {
    const res = await fetch("https://ipinfo.io/json");

    const ipInfo = await res.json();

    return {
      ip: ipInfo.ip,
    };
  } catch (e) {
    console.error(e);
  }
}
