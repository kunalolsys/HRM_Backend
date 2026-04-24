const BASE = "http://localhost:5000/api";

async function test() {
  try {
    console.log("========== REFRESH TOKEN FLOW TEST ==========\n");

    // 1. LOGIN
    console.log("1. POST /auth/login");
    const loginRes = await fetch(`${BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "admin@pragati.com",
        password: "admin123",
      }),
    });
    const loginData = await loginRes.json();
    console.log("   Login:", loginData.success ? "OK" : loginData.message);

    const accessToken = loginData.data?.accessToken;
    const refreshToken = loginData.data?.refreshToken;
    console.log("   Access Token:", accessToken ? accessToken.substring(0, 50) + "..." : "none");
    console.log("   Refresh Token:", refreshToken ? refreshToken.substring(0, 50) + "..." : "none");
    console.log("   User:", loginData.data?.user?.fullName);
    console.log("   Roles:", loginData.data?.user?.roles?.map((r) => r.name).join(", "));

    // 2. GET PROFILE (with access token)
    console.log("\n2. GET /auth/me (with access token)");
    const profileRes = await fetch(`${BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const profileData = await profileRes.json();
    console.log("   Profile:", profileData.success ? "OK" : profileData.message);

    // 3. REFRESH ACCESS TOKEN
    console.log("\n3. POST /auth/refresh (with refresh token)");
    const refreshRes = await fetch(`${BASE}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    const refreshData = await refreshRes.json();
    console.log("   Refresh:", refreshData.success ? "OK" : refreshData.message);
    const newAccessToken = refreshData.data?.accessToken;
    console.log("   New Access Token:", newAccessToken ? newAccessToken.substring(0, 50) + "..." : "none");

    // 4. GET PROFILE (with new access token)
    console.log("\n4. GET /auth/me (with NEW access token)");
    const profile2Res = await fetch(`${BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${newAccessToken}` },
    });
    const profile2Data = await profile2Res.json();
    console.log("   Profile:", profile2Data.success ? "OK" : profile2Data.message);

    // 5. LOGOUT
    console.log("\n5. POST /auth/logout");
    const logoutRes = await fetch(`${BASE}/auth/logout`, {
      method: "POST",
      headers: { Authorization: `Bearer ${newAccessToken}` },
    });
    const logoutData = await logoutRes.json();
    console.log("   Logout:", logoutData.success ? "OK" : logoutData.message);

    // 6. TRY REFRESH AGAIN (should fail after logout)
    console.log("\n6. POST /auth/refresh (after logout - should fail)");
    const refresh2Res = await fetch(`${BASE}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    const refresh2Data = await refresh2Res.json();
    console.log("   Refresh:", refresh2Data.success ? "OK" : refresh2Data.message);

    console.log("\n========== ALL TESTS COMPLETED ==========");
  } catch (err) {
    console.error("Test failed:", err.message);
  }
}

test();

