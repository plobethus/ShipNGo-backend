// /ShipNGo-frontend/scripts/shipment.js

document.getElementById("submitShipment").addEventListener("click", function (event) {
    event.preventDefault(); // Prevent form reload

    const senderId = document.getElementById("sender_id").value.trim();
    const recipientId = document.getElementById("recipient_id").value.trim();
    const weight = document.getElementById("weight").value.trim();
    const dimensions = document.getElementById("dimensions").value.trim();
    const shippingCost = document.getElementById("shipping_cost").value.trim();
    const deliveryDate = document.getElementById("delivery_date").value.trim();

    // Simple form validation
    if (!senderId || !recipientId || !weight || !dimensions || !shippingCost || !deliveryDate) {
        alert("Please fill in all fields before submitting.");
        return;
    }

    const shipmentData = {
        sender_id: senderId,
        recipient_id: recipientId,
        weight: weight,
        dimensions: dimensions,
        shipping_cost: shippingCost,
        delivery_date: deliveryDate
    };

    fetch("http://localhost:3000/shipment/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(shipmentData)
    })
    .then(response => response.json())
    .then(data => {
        alert("Shipment created successfully!");
        console.log("Server Response:", data); // Debugging
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Failed to create shipment. Please try again.");
    });
});
