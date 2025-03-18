const db = require("../config/db");

exports.register_delivery_point = async (req, res) => {
    const {name, special_instructions, delivery_type, entrance_address} = req.body

    //Delivery type being a enum ('Mailroom','Front Desk','Locker','Group Mailbox')


    let entrance_address_id;

    try {

        const [addressRows] = await db.execute("SELECT * FROM addresses WHERE address = ?", [entrance_address.toLowerCase()])

        if (addressRows > 0 || addressRows[0].customer_id) {
            entrance_address_id = addressRows[0].address_id
        } else {
            const [insert_result] = await db.execute("INSERT INTO addresses (address, name) VALUES (?)", [entrance_address.toLowerCase])
            entrance_address_id = insert_result.insertId
        }

        const [result] = await db.execute("INSERT INTO deliverypoint (name, special_instructions, delivery_type, entrance_address_id) VALUES (?, ?, ?, ?, ?, ?)", [name, special_instructions, delivery_type, entrance_address_id]);

        res.status(200).json({message: "Delivery Point Registration Successful", id: result.insertId})
    } catch (error) {
        console.error("Delivery point registeration error:", error);
        // If an error occurs, return a server error response
        res.status(500).json({ message: "Server error", error: error.message });
    }
}