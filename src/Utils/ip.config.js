export async function getUserIPInfo() {
  try {
    const res = await fetch("https://ipinfo.io/");
    const ipInfo = await res.json();

    return {
      ip: ipInfo.ip,
      isVpnEnabled: ipInfo.privacy.vpn,
    };
  } catch (e) {
    console.error(e);
  }
}
