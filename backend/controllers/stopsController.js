
const db = require("mysql2").createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    ssl: { rejectUnauthorized: true },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
}).promise();

async function getStop(stop_id) {
    
    const [rows] = db.execute("SELECT * FROM stops WHERE stop_id = ?", [stop_id])

    return rows
}

async function getOrderedStopsByRouteId(route_id) {
    const [rows] = await db.execute("SELECT * FROM stops WHERE route_id = ?", [route_id]);
    if (rows.length === 0) return [];

    const stopMap = {};
    rows.forEach(stop => {
        stopMap[stop.stop_id] = stop;
    });

    let current = rows.find(stop => stop.previous_stop_id === null);
    if (!current) {
        throw new Error("No starting stop found");
    }

    const orderedStops = [];
    while (current) {
        orderedStops.push(current);
        current = current.next_stop_id ? stopMap[current.next_stop_id] : null;
    }

    return orderedStops;
}



async function createStop(route_id, address, special_instructions, previous_stop_id) {
    const [result] = await db.execute(
        "INSERT INTO stops (route_id, address, special_instructions, previous_stop_id) VALUES (?, ?, ?, ?, ?)",
        [route_id, address, special_instructions, previous_stop_id]
    );

    if (previous_stop_id != null){
        await db.execute("REPLACE INTO stops (stop_id, next_stop_id) VALUES (?,?)", [previous_stop_id, result.insertId]);
    }
    
    return result.insertId;
}

async function deleteStop(stop_id) {
    const [stops] = await db.execute("SELECT * FROM stops WHERE stop_id = ?", [stop_id]);
    if (stops.length === 0) {
        return 0;
    }

    const stop = stops[0];
    const { previous_stop_id, next_stop_id } = stop;

    if (previous_stop_id) {
        await db.execute(
            "UPDATE stops SET next_stop_id = ? WHERE stop_id = ?",
            [next_stop_id, previous_stop_id]
        );
    }

    if (next_stop_id) {
        await db.execute(
            "UPDATE stops SET previous_stop_id = ? WHERE stop_id = ?",
            [previous_stop_id, next_stop_id]
        );
    }

    const [result] = await db.execute("DELETE FROM stops WHERE stop_id = ?", [stop_id]);
    return result.affectedRows;
}

module.exports = {
    getStop,
    getOrderedStopsByRouteId,
    createStop,
    deleteStop
}