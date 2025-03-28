// /ShipNGo/frontend/scripts/shipment.js
document.getElementById("submitShipment").addEventListener("click", function (event) {
  event.preventDefault();

  const senderId = document.getElementById("sender_id").value.trim();
  const recipientId = document.getElementById("recipient_id").value.trim();
  const weight = document.getElementById("weight").value.trim();
  const dimensions = document.getElementById("dimensions").value.trim();
  const shippingCost = document.getElementById("shipping_cost").value.trim();
  const deliveryDate = document.getElementById("delivery_date").value.trim();

  if (!senderId || !recipientId || !weight || !dimensions || !shippingCost || !deliveryDate) {
    alert("Please fill in all fields before submitting.");
    return;
  }

  const shipmentData = {
    sender_id: senderId,
    recipient_id: recipientId,
    weight,
    dimensions,
    shipping_cost: shippingCost,
    delivery_date: deliveryDate
  };

  fetch("/shipment", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(shipmentData)
  })
    .then(response => response.json())
    .then(data => {
      alert("Shipment created successfully!");
      console.log("Server Response:", data);
    })
    .catch(error => {
      console.error("Error:", error);
      alert("Failed to create shipment. Please try again.");
    });
});