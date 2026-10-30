/**
 * Agricultural Supply Chain Management System
 * Frontend Client Logic
 */

// State
let farmers = [];
let crops = [];
let batches = [];

// DOM Elements
const navButtons = document.querySelectorAll('.nav-btn');
const tabPanes = document.querySelectorAll('.tab-pane');
const toastEl = document.getElementById('toast');

// Init
document.addEventListener('DOMContentLoaded', () => {
  setupTabs();
  loadAllData();
  setupForms();
});

// Navigation / Tabs
function setupTabs() {
  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.getAttribute('data-tab');
      switchTab(tabId);
    });
  });

  const refreshBtn = document.getElementById('refreshBtn');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      loadAllData();
      showToast('Data refreshed successfully');
    });
  }

  const traceBtn = document.getElementById('traceBtn');
  if (traceBtn) {
    traceBtn.addEventListener('click', () => {
      const id = document.getElementById('traceInput').value.trim();
      if (id) runTrace(id);
    });
  }
}

function switchTab(tabId) {
  navButtons.forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
  });
  tabPanes.forEach(pane => {
    pane.classList.toggle('active', pane.id === `tab-${tabId}`);
  });
}

// Data Fetching
async function loadAllData() {
  try {
    await Promise.all([
      fetchStats(),
      fetchFarmers(),
      fetchCrops(),
      fetchBatches(),
      fetchLogistics(),
      fetchOrders()
    ]);
  } catch (err) {
    console.error('Error loading data:', err);
  }
}

async function fetchStats() {
  try {
    const res = await fetch('/api/stats');
    const data = await res.json();
    document.getElementById('statVolume').textContent = `${(data.totalVolumeKg || 0).toLocaleString()} kg`;
    document.getElementById('statBatches').textContent = data.totalBatches || 0;
    document.getElementById('statTransit').textContent = data.inTransitShipments || 0;
    document.getElementById('statRevenue').textContent = `₹ ${(data.revenueINR || 0).toLocaleString()}`;
  } catch (e) {
    console.error('Failed to load stats', e);
  }
}

async function fetchFarmers() {
  try {
    const res = await fetch('/api/farmers');
    farmers = await res.json();

    const select = document.getElementById('farmerSelect');
    if (select) {
      select.innerHTML = farmers.map(f => `<option value="${f.id}">${f.name} (${f.location} - ${f.acres} acres)</option>`).join('');
    }

    const listEl = document.getElementById('farmerList');
    if (listEl) {
      listEl.innerHTML = farmers.map(f => `
        <div class="farmer-item">
          <div class="item-header">
            <span class="item-title">🚜 ${f.name}</span>
            <span class="item-meta">${f.acres} Acres</span>
          </div>
          <div class="item-meta">📍 ${f.location} | 📞 ${f.phone}</div>
        </div>
      `).join('');
    }
  } catch (e) {
    console.error('Failed to load farmers', e);
  }
}

async function fetchCrops() {
  try {
    const res = await fetch('/api/crops');
    crops = await res.json();

    const select = document.getElementById('cropSelect');
    if (select) {
      select.innerHTML = crops.map(c => `<option value="${c.id}">${c.name} [${c.category}] - Base ₹${c.basePrice}/kg</option>`).join('');
    }
  } catch (e) {
    console.error('Failed to load crops', e);
  }
}

async function fetchBatches() {
  try {
    const res = await fetch('/api/batches');
    batches = await res.json();

    renderBatchTable(batches);
    populateBatchSelects(batches);
  } catch (e) {
    console.error('Failed to load batches', e);
  }
}

function renderBatchTable(list) {
  const tbody = document.getElementById('batchTableBody');
  if (!tbody) return;

  if (list.length === 0) {
    tbody.innerHTML = '<tr><td colspan="9" style="text-align:center; padding: 2rem;">No batches recorded yet.</td></tr>';
    return;
  }

  tbody.innerHTML = list.map(b => `
    <tr>
      <td><span class="batch-code">${b.id}</span></td>
      <td><strong>${b.cropName}</strong></td>
      <td>${b.farmerName} <br><small class="text-muted">📍 ${b.farmLocation}</small></td>
      <td><strong>${Number(b.quantityKg).toLocaleString()}</strong> kg</td>
      <td><span class="item-meta">${b.qualityGrade}</span></td>
      <td>${b.harvestDate}</td>
      <td>${b.storageTemp}°C</td>
      <td><span class="badge ${getBadgeClass(b.currentStatus)}">${b.currentStatus}</span></td>
      <td>
        <button class="btn btn-secondary btn-sm" onclick="quickTrace('${b.id}')">🔍 Trace</button>
      </td>
    </tr>
  `).join('');
}

function getBadgeClass(status) {
  switch (status) {
    case 'Harvested': return 'badge-harvested';
    case 'Cold Storage': return 'badge-storage';
    case 'In Transit': return 'badge-transit';
    case 'Distributed': return 'badge-distributed';
    case 'Retail Shelved': return 'badge-retail';
    case 'Sold': return 'badge-sold';
    default: return 'badge-harvested';
  }
}

function populateBatchSelects(list) {
  const logisticsSelect = document.getElementById('logisticsBatchSelect');
  if (logisticsSelect) {
    logisticsSelect.innerHTML = list.map(b => `<option value="${b.id}">${b.id} - ${b.cropName} (${b.quantityKg} kg, ${b.currentStatus})</option>`).join('');
  }

  const orderSelect = document.getElementById('orderBatchSelect');
  if (orderSelect) {
    const available = list.filter(b => b.currentStatus !== 'Sold');
    orderSelect.innerHTML = available.map(b => `<option value="${b.id}">${b.id} - ${b.cropName} (${b.quantityKg} kg)</option>`).join('');
  }
}

async function fetchLogistics() {
  try {
    const res = await fetch('/api/logistics');
    const logs = await res.json();
    const listEl = document.getElementById('shipmentList');
    if (!listEl) return;

    if (logs.length === 0) {
      listEl.innerHTML = '<p class="text-muted">No logistics shipments dispatched yet.</p>';
      return;
    }

    listEl.innerHTML = logs.map(l => `
      <div class="shipment-item">
        <div class="item-header">
          <span class="item-title">🚚 ${l.transporterName}</span>
          <span class="badge badge-transit">${l.transitStatus}</span>
        </div>
        <div class="item-meta">
          <strong>Batch:</strong> <span class="batch-code">${l.batchId}</span> | <strong>Vehicle:</strong> ${l.vehicleNumber}
        </div>
        <div class="item-meta" style="margin-top: 4px;">
          📍 ${l.pickupLocation} ➔ ${l.dropLocation} | ❄️ ${l.temperatureCelsius}°C
        </div>
      </div>
    `).join('');
  } catch (e) {
    console.error('Failed to load logistics', e);
  }
}

async function fetchOrders() {
  try {
    const res = await fetch('/api/orders');
    const orders = await res.json();
    const listEl = document.getElementById('orderList');
    if (!listEl) return;

    if (orders.length === 0) {
      listEl.innerHTML = '<p class="text-muted">No retail orders completed yet.</p>';
      return;
    }

    listEl.innerHTML = orders.map(o => `
      <div class="order-item">
        <div class="item-header">
          <span class="item-title">🏪 ${o.retailerName} (${o.city})</span>
          <span class="badge badge-retail">${o.status}</span>
        </div>
        <div class="item-meta">
          <strong>Crop:</strong> ${o.cropName} | <strong>Quantity:</strong> ${o.quantityKg} kg @ ₹${o.pricePerKg}/kg
        </div>
        <div class="item-meta" style="margin-top: 4px;">
          <strong>Total Value:</strong> ₹ ${Number(o.totalAmount).toLocaleString()} | <strong>Date:</strong> ${o.orderDate}
        </div>
      </div>
    `).join('');
  } catch (e) {
    console.error('Failed to load orders', e);
  }
}

// Form Handlers
function setupForms() {
  // 1. Create Batch Form
  const batchForm = document.getElementById('createBatchForm');
  if (batchForm) {
    // Generate default batch ID
    document.getElementById('batchId').value = `BATCH-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    batchForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const payload = {
        id: document.getElementById('batchId').value.trim(),
        farmerId: document.getElementById('farmerSelect').value,
        cropId: document.getElementById('cropSelect').value,
        quantityKg: document.getElementById('quantityKg').value,
        qualityGrade: document.getElementById('qualityGrade').value,
        storageTemp: document.getElementById('storageTemp').value
      };

      try {
        const res = await fetch('/api/batches', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success) {
          showToast(`Harvest Batch ${payload.id} successfully recorded!`);
          batchForm.reset();
          document.getElementById('batchId').value = `BATCH-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
          loadAllData();
          switchTab('dashboard');
        }
      } catch (err) {
        showToast('Error saving batch');
      }
    });
  }

  // 2. Logistics Dispatch Form
  const logisticsForm = document.getElementById('logisticsForm');
  if (logisticsForm) {
    logisticsForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const payload = {
        batchId: document.getElementById('logisticsBatchSelect').value,
        transporterName: document.getElementById('transporterName').value.trim(),
        vehicleNumber: document.getElementById('vehicleNumber').value.trim(),
        pickupLocation: document.getElementById('pickupLocation').value.trim(),
        dropLocation: document.getElementById('dropLocation').value.trim(),
        temperatureCelsius: document.getElementById('tempCelsius').value
      };

      try {
        const res = await fetch('/api/logistics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success) {
          showToast(`Fleet dispatched for Batch ${payload.batchId}!`);
          logisticsForm.reset();
          loadAllData();
        }
      } catch (err) {
        showToast('Error dispatching logistics');
      }
    });
  }

  // 3. Retail Order Form
  const orderForm = document.getElementById('orderForm');
  if (orderForm) {
    orderForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const payload = {
        batchId: document.getElementById('orderBatchSelect').value,
        retailerName: document.getElementById('retailerName').value.trim(),
        city: document.getElementById('orderCity').value.trim(),
        quantityKg: document.getElementById('orderQuantityKg').value,
        pricePerKg: document.getElementById('orderPrice').value
      };

      try {
        const res = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success) {
          showToast(`Order confirmed for ${payload.retailerName}!`);
          orderForm.reset();
          loadAllData();
        }
      } catch (err) {
        showToast('Error submitting order');
      }
    });
  }
}

// Traceability
async function runTrace(batchId) {
  const container = document.getElementById('traceResults');
  container.style.display = 'block';
  container.innerHTML = '<p class="text-muted">Fetching cryptographic supply chain audit trail...</p>';

  try {
    const res = await fetch(`/api/trace/${encodeURIComponent(batchId)}`);
    const data = await res.json();

    if (data.error) {
      container.innerHTML = `<div style="color: #ef4444; padding: 1rem;">⚠️ ${data.error}</div>`;
      return;
    }

    container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px solid var(--border); padding-bottom: 1rem;">
        <div>
          <h3 style="font-size: 1.3rem; font-weight: 800;">${data.cropName}</h3>
          <div style="display: flex; gap: 0.5rem; margin-top: 0.4rem; align-items: center;">
            <span class="batch-code">${data.batchId}</span>
            <span class="badge ${getBadgeClass(data.currentStatus)}">${data.currentStatus}</span>
            <span class="badge badge-storage">❄️ ${data.storageTemp}°C</span>
          </div>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 1.2rem; font-weight: 800; color: var(--primary);">✓ Verified Authentic</div>
          <div style="font-size: 0.8rem; color: var(--text-muted);">${data.quantityKg} kg Harvest Volume</div>
        </div>
      </div>

      <div class="timeline">
        ${data.stages.map((st, i) => `
          <div class="timeline-step">
            <div class="timeline-node"></div>
            <div class="timeline-card">
              <div class="timeline-title">
                <span>Stage ${i + 1}: ${st.stage}</span>
                <span style="font-size: 0.8rem; font-weight: normal; color: var(--text-muted);">${st.timestamp}</span>
              </div>
              <div class="timeline-actor">👤 <strong>Responsible:</strong> ${st.actor} | 📍 ${st.location}</div>
              <div class="timeline-desc">${st.details}</div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  } catch (err) {
    container.innerHTML = '<div style="color: #ef4444;">Failed to load journey. Please verify server connection.</div>';
  }
}

function quickTrace(batchId) {
  switchTab('trace');
  document.getElementById('traceInput').value = batchId;
  runTrace(batchId);
}

// Toast
function showToast(msg) {
  toastEl.textContent = msg;
  toastEl.style.display = 'block';
  setTimeout(() => {
    toastEl.style.display = 'none';
  }, 3500);
}
