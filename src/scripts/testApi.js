const BASE = "http://localhost:5000/api";

async function test() {
  try {
    // 1. Login with seeded admin
    const loginRes = await fetch(`${BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "admin@pragati.com",
        password: "admin123",
      }),
    });
    const loginData = await loginRes.json();
    console.log("Login:", loginData.success ? "OK" : loginData.message);

    const authToken = loginData.data?.token;

    // 2. Get Profile
    const profileRes = await fetch(`${BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    const profileData = await profileRes.json();
    console.log("Profile:", profileData.success ? "OK" : profileData.message);
    if (profileData.data) {
      console.log("  User:", profileData.data.fullName);
      console.log("  Roles:", profileData.data.roles?.map((r) => r.name).join(", "));
    }

    // 3. Get Permissions
    const permRes = await fetch(`${BASE}/permissions`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    const permData = await permRes.json();
    console.log("Permissions:", permData.success ? `${permData.count} permissions` : permData.message);

    // 4. Get Roles
    const roleRes = await fetch(`${BASE}/roles`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    const roleData = await roleRes.json();
    console.log("Roles:", roleData.success ? `${roleData.count} roles` : roleData.message);

    // 5. Register new employee (as admin)
    const registerRes = await fetch(`${BASE}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        employeeCode: "EMP002",
        fullName: "Test Employee",
        email: "employee@pragati.com",
        password: "employee123",
        roleIds: [],
      }),
    });
    const registerData = await registerRes.json();
    console.log("Register:", registerData.success ? "OK" : registerData.message);

    console.log("\nAll tests completed!");
  } catch (err) {
    console.error("Test failed:", err.message);
  }
}

test();

