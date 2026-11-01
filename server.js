/**
 * Agricultural Supply Chain Management System
 * Node.js Native HTTP Backend & REST API
 * Zero external dependencies required!
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'db.json');
const PUBLIC_DIR = path.join(__dirname, 'public');

// Initial seed data
const initialData = {
  farmers: [
    { id: 1, name: "Ramesh Kumar", phone: "+91 98765 43210", location: "Ludhiana, Punjab", acres: 15.5 },
    { id: 2, name: "Sita Devi", phone: "+91 98112 23344", location: "Nashik, Maharashtra", acres: 8.2 },
    { id: 3, name: "Balwinder Singh", phone: "+91 94567 89012", location: "Karnal, Haryana", acres: 22.0 },
    { id: 4, name: "Arun Patel", phone: "+91 97234 56789", location: "Anand, Gujarat", acres: 12.0 }
  ],
  crops: [
    { id: 1, name: "Basmati Rice 1121", category: "Grains", basePrice: 85.0 },
    { id: 2, name: "Organic Wheat (Sharbati)", category: "Grains", basePrice: 42.0 },
    { id: 3, name: "Alphonso Mango", category: "Fruits", basePrice: 250.0 },
    { id: 4, name: "Red Onion", category: "Vegetables", basePrice: 28.0 },
    { id: 5, name: "Turmeric (Organic Lakadong)", category: "Spices", basePrice: 140.0 }
  ],
  batches: [
    {
      id: "BATCH-2026-RICE-01",
      farmerId: 1,
      farmerName: "Ramesh Kumar",
      farmLocation: "Ludhiana, Punjab",
      cropId: 1,
      cropName: "Basmati Rice 1121",
      quantityKg: 5000,
      harvestDate: "2026-10-15",
      qualityGrade: "Grade A (Export)",
      currentStatus: "In Transit",
      storageTemp: 20.0,
      createdAt: "2026-10-15T09:00:00Z"
    },
    {
      id: "BATCH-2026-WHEAT-02",
      farmerId: 3,
      farmerName: "Balwinder Singh",
      farmLocation: "Karnal, Haryana",
      cropId: 2,
      cropName: "Organic Wheat (Sharbati)",
      quantityKg: 8500,
      harvestDate: "2026-10-18",
      qualityGrade: "Grade A (Export)",
      currentStatus: "Cold Storage",
      storageTemp: 18.0,
      createdAt: "2026-10-18T10:30:00Z"
    },
    {
      id: "BATCH-2026-MANGO-03",
      farmerId: 2,
      farmerName: "Sita Devi",
      farmLocation: "Nashik, Maharashtra",
      cropId: 3,
      cropName: "Alphonso Mango",
      quantityKg: 1200,
      harvestDate: "2026-10-22",
      qualityGrade: "Grade A (Export)",
      currentStatus: "Distributed",
      storageTemp: 12.5,
      createdAt: "2026-10-22T08:15:00Z"
    },
    {
      id: "BATCH-2026-ONION-04",
      farmerId: 4,
      farmerName: "Arun Patel",
      farmLocation: "Anand, Gujarat",
      cropId: 4,
      cropName: "Red Onion",
      quantityKg: 3000,
      harvestDate: "2026-10-25",
      qualityGrade: "Grade B (Premium)",
      currentStatus: "Retail Shelved",
      storageTemp: 22.0,
      createdAt: "2026-10-25T11:00:00Z"
    }
  ],
  logistics: [
    {
      id: 1,
      batchId: "BATCH-2026-RICE-01",
      transporterName: "Kisan Express Cold Transit",
      vehicleNumber: "PB-10-CX-4521",
      pickupLocation: "Ludhiana Mandi Gate 2",
      dropLocation: "Delhi Central Logistics Hub",
      dispatchDate: "2026-10-27",
      transitStatus: "In Transit",
      temperatureCelsius: 19.5
    },
    {
      id: 2,
      batchId: "BATCH-2026-MANGO-03",
      transporterName: "Sahyadri Cold Logistics",
      vehicleNumber: "MH-15-TR-9988",
      pickupLocation: "Nashik Farm Gate",
      dropLocation: "Mumbai APMC Vashi Terminal",
      dispatchDate: "2026-10-24",
      transitStatus: "Reached Destination",
      temperatureCelsius: 13.0
    }
  ],
  orders: [
    {
      id: 1,
      batchId: "BATCH-2026-MANGO-03",
      cropName: "Alphonso Mango",
      retailerName: "Nature Fresh Supermarkets",
      city: "Mumbai",
      quantityKg: 500,
      pricePerKg: 290.0,
      totalAmount: 145000,
      orderDate: "2026-10-26",
      status: "Delivered"
    },
    {
      id: 2,
      batchId: "BATCH-2026-ONION-04",
      cropName: "Red Onion",
      retailerName: "Daily Greens Mart",
      city: "Ahmedabad",
      quantityKg: 1200,
      pricePerKg: 35.0,
      totalAmount: 42000,
      orderDate: "2026-10-28",
      status: "Confirmed"
    }
  ]
};

// Database persistence helpers
function loadDatabase() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2));
      return initialData;
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading db.json, returning default data:', err);
    return initialData;
  }
}

function saveDatabase(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error writing to db.json:', err);
  }
}

let db = loadDatabase();

// MIME Types
const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf'
};

// Server
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // --- API ROUTES ---
  if (pathname.startsWith('/api/')) {
    res.setHeader('Content-Type', 'application/json');

    // 1. Stats
    if (pathname === '/api/stats' && method === 'GET') {
      const totalVolume = db.batches.reduce((sum, b) => sum + Number(b.quantityKg || 0), 0);
      const inTransit = db.batches.filter(b => b.currentStatus === 'In Transit').length;
      const stats = {
        totalFarmers: db.farmers.length,
        totalBatches: db.batches.length,
        totalVolumeKg: totalVolume,
        inTransitShipments: inTransit,
        totalOrders: db.orders.length,
        revenueINR: db.orders.reduce((sum, o) => sum + Number(o.totalAmount || 0), 0)
      };
      res.writeHead(200);
      res.end(JSON.stringify(stats));
      return;
    }

    // 2. Farmers List
    if (pathname === '/api/farmers' && method === 'GET') {
      res.writeHead(200);
      res.end(JSON.stringify(db.farmers));
      return;
    }

    // 3. Crops List
    if (pathname === '/api/crops' && method === 'GET') {
      res.writeHead(200);
      res.end(JSON.stringify(db.crops));
      return;
    }

    // 4. Batches List & Create
    if (pathname === '/api/batches' && method === 'GET') {
      res.writeHead(200);
      res.end(JSON.stringify(db.batches));
      return;
    }

    if (pathname === '/api/batches' && method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const payload = JSON.parse(body);
          const farmer = db.farmers.find(f => f.id === Number(payload.farmerId)) || { name: 'Local Farmer', location: 'Punjab' };
          const crop = db.crops.find(c => c.id === Number(payload.cropId)) || { name: payload.cropName || 'Organic Crop' };

          const newBatch = {
            id: payload.id || `BATCH-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
            farmerId: Number(payload.farmerId),
            farmerName: farmer.name,
            farmLocation: farmer.location,
            cropId: Number(payload.cropId),
            cropName: crop.name,
            quantityKg: Number(payload.quantityKg),
            harvestDate: payload.harvestDate || new Date().toISOString().split('T')[0],
            qualityGrade: payload.qualityGrade || 'Grade A (Export)',
            currentStatus: payload.currentStatus || 'Harvested',
            storageTemp: Number(payload.storageTemp) || 18.0,
            createdAt: new Date().toISOString()
          };

          db.batches.unshift(newBatch);
          saveDatabase(db);

          res.writeHead(201);
          res.end(JSON.stringify({ success: true, batch: newBatch }));
        } catch (err) {
          res.writeHead(400);
          res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
        }
      });
      return;
    }

    // 5. Update Batch Status
    if (pathname.match(/^\/api\/batches\/([^/]+)\/status$/) && method === 'PUT') {
      const batchId = decodeURIComponent(pathname.split('/')[3]);
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const payload = JSON.parse(body);
          const batch = db.batches.find(b => b.id === batchId);
          if (!batch) {
            res.writeHead(404);
            res.end(JSON.stringify({ error: 'Batch not found' }));
            return;
          }
          batch.currentStatus = payload.status;
          saveDatabase(db);
          res.writeHead(200);
          res.end(JSON.stringify({ success: true, batch }));
        } catch (err) {
          res.writeHead(400);
          res.end(JSON.stringify({ error: 'Failed to update status' }));
        }
      });
      return;
    }

    // 6. Logistics List & Dispatch
    if (pathname === '/api/logistics' && method === 'GET') {
      res.writeHead(200);
      res.end(JSON.stringify(db.logistics));
      return;
    }

    if (pathname === '/api/logistics' && method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const payload = JSON.parse(body);
          const newLogistics = {
            id: db.logistics.length + 1,
            batchId: payload.batchId,
            transporterName: payload.transporterName,
            vehicleNumber: payload.vehicleNumber,
            pickupLocation: payload.pickupLocation,
            dropLocation: payload.dropLocation,
            dispatchDate: payload.dispatchDate || new Date().toISOString().split('T')[0],
            transitStatus: payload.transitStatus || 'In Transit',
            temperatureCelsius: Number(payload.temperatureCelsius) || 16.0
          };

          db.logistics.unshift(newLogistics);

          // Update matching batch status to In Transit
          const batch = db.batches.find(b => b.id === payload.batchId);
          if (batch) {
            batch.currentStatus = 'In Transit';
          }

          saveDatabase(db);
          res.writeHead(201);
          res.end(JSON.stringify({ success: true, logistics: newLogistics }));
        } catch (err) {
          res.writeHead(400);
          res.end(JSON.stringify({ error: 'Invalid logistics payload' }));
        }
      });
      return;
    }

    // 7. Orders List & Place Order
    if (pathname === '/api/orders' && method === 'GET') {
      res.writeHead(200);
      res.end(JSON.stringify(db.orders));
      return;
    }

    if (pathname === '/api/orders' && method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const payload = JSON.parse(body);
          const batch = db.batches.find(b => b.id === payload.batchId);
          const cropName = batch ? batch.cropName : (payload.cropName || 'Fresh Produce');

          const newOrder = {
            id: db.orders.length + 1,
            batchId: payload.batchId,
            cropName: cropName,
            retailerName: payload.retailerName,
            city: payload.city || 'Delhi',
            quantityKg: Number(payload.quantityKg),
            pricePerKg: Number(payload.pricePerKg),
            totalAmount: Number(payload.quantityKg) * Number(payload.pricePerKg),
            orderDate: new Date().toISOString().split('T')[0],
            status: 'Confirmed'
          };

          db.orders.unshift(newOrder);

          if (batch) {
            batch.currentStatus = 'Sold';
          }

          saveDatabase(db);
          res.writeHead(201);
          res.end(JSON.stringify({ success: true, order: newOrder }));
        } catch (err) {
          res.writeHead(400);
          res.end(JSON.stringify({ error: 'Failed to create order' }));
        }
      });
      return;
    }

    // 8. Traceability Journey Lookup
    if (pathname.match(/^\/api\/trace\/([^/]+)$/) && method === 'GET') {
      const batchId = decodeURIComponent(pathname.split('/')[3]);
      const batch = db.batches.find(b => b.id.toLowerCase() === batchId.toLowerCase());

      if (!batch) {
        res.writeHead(404);
        res.end(JSON.stringify({ error: `No harvest batch record found for Batch ID: ${batchId}` }));
        return;
      }

      const farmer = db.farmers.find(f => f.id === batch.farmerId) || { name: batch.farmerName, location: batch.farmLocation };
      const logisticsList = db.logistics.filter(l => l.batchId.toLowerCase() === batchId.toLowerCase());
      const order = db.orders.find(o => o.batchId.toLowerCase() === batchId.toLowerCase());

      const journey = {
        batchId: batch.id,
        cropName: batch.cropName,
        quantityKg: batch.quantityKg,
        qualityGrade: batch.qualityGrade,
        currentStatus: batch.currentStatus,
        storageTemp: batch.storageTemp,
        stages: [
          {
            stage: 'Farm Harvest & Registration',
            timestamp: batch.harvestDate,
            actor: farmer.name,
            location: farmer.location,
            verified: true,
            details: `Harvested ${batch.quantityKg} kg of ${batch.cropName} with ${batch.qualityGrade}. Soil & moisture tested.`
          },
          {
            stage: 'Cold Storage & Quality Inspection',
            timestamp: batch.harvestDate,
            actor: 'State Agri Quality Board',
            location: 'Regional Ag-Hub',
            verified: true,
            details: `Quality certified. Cold storage maintained at ${batch.storageTemp}°C.`
          }
        ]
      };

      if (logisticsList.length > 0) {
        logisticsList.forEach(log => {
          journey.stages.push({
            stage: 'Logistics & Transit',
            timestamp: log.dispatchDate,
            actor: log.transporterName,
            location: `${log.pickupLocation} ➔ ${log.dropLocation}`,
            verified: true,
            details: `Vehicle No: ${log.vehicleNumber} | Status: ${log.transitStatus} | Temperature: ${log.temperatureCelsius}°C`
          });
        });
      }

      if (order) {
        journey.stages.push({
          stage: 'Retail Store & Consumer Shelf',
          timestamp: order.orderDate,
          actor: order.retailerName,
          location: order.city,
          verified: true,
          details: `Distributed to consumers at ₹${order.pricePerKg}/kg. Status: ${order.status}.`
        });
      }

      res.writeHead(200);
      res.end(JSON.stringify(journey));
      return;
    }

    // 404 for unknown api
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Endpoint not found' }));
    return;
  }

  // --- STATIC FILE SERVING ---
  let filePath = path.join(PUBLIC_DIR, pathname === '/' ? 'index.html' : pathname);
  const ext = path.extname(filePath);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      filePath = path.join(PUBLIC_DIR, 'index.html');
    }

    const contentType = MIME_TYPES[path.extname(filePath)] || 'text/plain';
    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(500);
        res.end('500 Server Error');
        return;
      }
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    });
  });
});

server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🌾 Agricultural Supply Chain Management System`);
  console.log(`🚀 Web Application running at: http://localhost:${PORT}`);
  console.log(`=======================================================`);
});
