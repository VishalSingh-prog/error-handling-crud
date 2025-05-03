const out = document.getElementById("output");

function show(data) {
  out.textContent = typeof data === "string"
    ? data
    : JSON.stringify(data, null, 2);
}

async function request(path, opts = {}) {
  const start = performance.now();
  try {
    const r = await fetch(`http://localhost:3001${path}`, {
      headers: { "Content-Type": "application/json" },
      ...opts
    });
    const body = await r.json().catch(() => {
      throw new Error("Invalid JSON received");
    });
    if (!r.ok) throw new Error(body.message || r.statusText);
    return body;
  } catch (err) {
    console.error(err);
    show(`❌ ${err.message}`);
    return null;
  } finally {
    console.debug(`${opts.method ?? "GET"} ${path} – ${Date.now()-start}ms`);
  }
}

document.getElementById("load").onclick = async () => {
  const data = await request("/posts");
  if (data) show(data.slice(0, 5)); // limit output
};

document.getElementById("add").onclick = async () => {
  const data = await request("/posts", {
    method: "POST",
    body: JSON.stringify({ title: "foo", body: "bar", userId: 1 })
  });
  if (data) show(data);
};
