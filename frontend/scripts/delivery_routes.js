document.addEventListener("DOMContentLoaded", async () => {
    await fetchActiveRoutes();
})

async function fetchActiveRoutes() {
  try {
    const res = await fetch(`/driver/get_routes`);
    const data = await res.json();

    const element = document.getElementById("routes-body")

    

    data.forEach(route => {
        const row = element.appendChild(document.createElement("tr"))
        row.appendChild(document.createElement("td")).textContent = route.route_id
        row.appendChild(document.createElement("td")).textContent = route.route_name
        row.appendChild(document.createElement("td")).textContent = route.status
        row.appendChild(document.createElement("td")).textContent = route.origin + " → " + route.destination
        row.appendChild(document.createElement("td")).textContent = route.truck


        const anchor = document.createElement("a")

        anchor.href = "/driver/get_stops/" + route.route_id
        anchor.innerText = "click"
        
        row.appendChild(document.createElement("td")).appendChild(anchor)

    });

  } catch (err) {
    console.error(err);
  }
}



// async function fetchStops(route_id) {
//   try {
//     const res = await fetch(`${API_BASE}/routes/${route_id}/stops`, {
//       headers: getAuthHeaders(),
//     });
//     const data = await res.json();

//     const list = document.getElementById("stops-list");
//     if (!res.ok) {
//       list.innerHTML = `<li>${data.message}</li>`;
//       return;
//     }

//     data.forEach(stop => {
//       const li = document.createElement("li");
//       li.textContent = stop.address + (stop.special_instructions ? ` (${stop.special_instructions})` : "");
//       list.appendChild(li);
//     });
//   } catch (err) {
//     console.error(err);
//     document.getElementById("stops-list").innerHTML = "<li>Error loading stops.</li>";
//   }
// }
