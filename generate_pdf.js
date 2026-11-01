const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const OUTPUT_PDF = path.join(__dirname, 'Agricultural_Supply_Chain_Project_Report.pdf');

// Create document (A4, 54pt ~ 0.75 in margins)
const doc = new PDFDocument({
  size: 'A4',
  margins: { top: 54, bottom: 54, left: 54, right: 54 },
  autoFirstPage: false,
  bufferPages: true
});

const writeStream = fs.createWriteStream(OUTPUT_PDF);
doc.pipe(writeStream);

// Colors
const PRIMARY = '#1b5e20'; // Forest Green
const ACCENT = '#2e7d32';
const TEXT_DARK = '#1a1a1a';
const TEXT_MUTED = '#555555';
const BORDER_COLOR = '#d0d7de';
const BG_HEADER = '#f4f6f8';
const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const MARGIN = 54;
const CONTENT_WIDTH = PAGE_WIDTH - 2 * MARGIN;

// Helper: Add page with bottom page number
let pageCount = 0;
function addReportPage(isRoman = false, romanStr = '') {
  doc.addPage();
  pageCount++;
  return pageCount;
}

function printFooter(numStr) {
  doc.save();
  doc.font('Helvetica').fontSize(10).fillColor(TEXT_MUTED);
  doc.text(numStr, MARGIN, PAGE_HEIGHT - 40, { width: CONTENT_WIDTH, align: 'center' });
  doc.restore();
}

// Helper: Table drawer
function drawTable(startY, headers, rows, colWidths, alignments = []) {
  let y = startY;
  const rowHeight = 22;
  const headerHeight = 24;

  // Header background
  doc.save();
  doc.rect(MARGIN, y, CONTENT_WIDTH, headerHeight).fill(BG_HEADER);
  doc.rect(MARGIN, y, CONTENT_WIDTH, headerHeight).stroke(BORDER_COLOR);

  // Header text
  doc.font('Helvetica-Bold').fontSize(9).fillColor(TEXT_DARK);
  let curX = MARGIN;
  headers.forEach((h, i) => {
    const w = colWidths[i];
    const align = alignments[i] || 'left';
    doc.text(h, curX + 6, y + 7, { width: w - 12, align: align });
    curX += w;
  });
  doc.restore();

  y += headerHeight;

  // Rows
  rows.forEach((row, rIdx) => {
    // Check if near bottom
    if (y + rowHeight > PAGE_HEIGHT - 60) {
      addReportPage();
      y = MARGIN;
    }

    doc.save();
    if (rIdx % 2 === 1) {
      doc.rect(MARGIN, y, CONTENT_WIDTH, rowHeight).fill('#fafbfc');
    }
    doc.rect(MARGIN, y, CONTENT_WIDTH, rowHeight).stroke(BORDER_COLOR);

    doc.font('Helvetica').fontSize(8.5).fillColor(TEXT_DARK);
    let x = MARGIN;
    row.forEach((cell, cIdx) => {
      const w = colWidths[cIdx];
      const align = alignments[cIdx] || 'left';
      doc.text(String(cell), x + 6, y + 6, { width: w - 12, align: align });
      x += w;
    });
    doc.restore();
    y += rowHeight;
  });

  return y + 15;
}

// ==========================================
// PAGE 1: TITLE PAGE
// ==========================================
doc.addPage();
doc.moveDown(2);

// University Header Simulation
doc.save();
// Emblem vector circle
doc.circle(PAGE_WIDTH / 2 - 120, 95, 20).lineWidth(2).stroke(PRIMARY);
doc.font('Helvetica-Bold').fontSize(14).fillColor(PRIMARY).text('AGRI', PAGE_WIDTH / 2 - 134, 90);

doc.font('Helvetica-Bold').fontSize(22).fillColor('#c62828').text('MANIPAL', PAGE_WIDTH / 2 - 90, 80);
doc.font('Helvetica').fontSize(18).fillColor(TEXT_DARK).text('UNIVERSITY JAIPUR', PAGE_WIDTH / 2 - 90, 102);
doc.font('Helvetica-Oblique').fontSize(8).fillColor(TEXT_MUTED).text('(University under Section 2(f) of the UGC Act)', PAGE_WIDTH / 2 - 90, 122);
doc.restore();

doc.y = 230;
doc.font('Helvetica-Bold').fontSize(22).fillColor(TEXT_DARK).text('AGRICULTURAL SUPPLY CHAIN', { align: 'center' });
doc.font('Helvetica-Bold').fontSize(22).fillColor(TEXT_DARK).text('MANAGEMENT SYSTEM', { align: 'center' });

doc.moveDown(2.5);
doc.font('Helvetica-Bold').fontSize(13).fillColor(TEXT_DARK).text('RDBMS Lab Project Report', { align: 'center' });

doc.moveDown(3);
doc.font('Helvetica').fontSize(12).fillColor(TEXT_DARK).text('Submitted by:', { align: 'center' });
doc.moveDown(0.6);
doc.font('Helvetica-Bold').fontSize(14).fillColor(TEXT_DARK).text('VANSH PODDAR', { align: 'center' });
doc.font('Helvetica').fontSize(11).fillColor(TEXT_DARK).text('sec – S4', { align: 'center' });
doc.font('Helvetica').fontSize(11).fillColor(TEXT_DARK).text('RegNo: 2502052774', { align: 'center' });

doc.moveDown(2.5);
doc.font('Helvetica').fontSize(11).fillColor(TEXT_DARK).text('Under the supervision of:', { align: 'center' });
doc.moveDown(0.5);
doc.font('Helvetica-Bold').fontSize(13).fillColor(TEXT_DARK).text('DR. Ruchika Katariya', { align: 'center' });

// Bottom Department Info
doc.y = PAGE_HEIGHT - 130;
doc.font('Helvetica-Bold').fontSize(11).fillColor(TEXT_DARK).text('Department of Computer Science and Engineering', { align: 'center' });
doc.font('Helvetica-Bold').fontSize(11).fillColor(TEXT_DARK).text('Manipal University Jaipur', { align: 'center' });
doc.font('Helvetica').fontSize(9).fillColor(TEXT_MUTED).text('Dehmi Kalan, Near GVK Toll Plaza, Jaipur-Ajmer Expressway,', { align: 'center' });
doc.font('Helvetica').fontSize(9).fillColor(TEXT_MUTED).text('Jaipur, Rajasthan 303007', { align: 'center' });

// ==========================================
// PAGE 2: ABSTRACT
// ==========================================
addReportPage();
printFooter('1');

doc.font('Helvetica-Bold').fontSize(22).fillColor(TEXT_DARK).text('Abstract', MARGIN, 80, { align: 'center' });
doc.moveDown(2);

const abstractPara1 = `The Agricultural Supply Chain Management System is a comprehensive database-driven platform developed to provide an efficient, transparent, and user-friendly platform for tracking agricultural produce from farm harvest to consumer retail shelves. The project focuses on combining an interactive web interface with a relational database to manage supply-chain-related information efficiently.`;

const abstractPara2 = `The application provides features such as farmer harvest registration, cold storage monitoring, real-time logistics fleet dispatch, wholesale and retail distribution orders, and farm-to-table consumer traceability. Its modular interface and intuitive navigation make the different stages of the agricultural supply lifecycle easily accessible.`;

const abstractPara3 = `MySQL is used as the database management system to store and organize information related to farmers, crops, harvest batches, logistics transits, and retail orders. The database consists of five normalized tables and uses primary keys, foreign keys, and enumerated domain constraints to maintain data integrity and establish relationships between records.`;

const abstractPara4 = `The project demonstrates the practical application of database design, relational schema development, SQL DDL/DML, and client-server connectivity in building a database-driven supply chain portal. It also provides hands-on experience in integrating real-world logistical workflows with structured relational data management.`;

const abstractPara5 = `Overall, the project serves as an academic implementation of an agricultural supply chain management application while demonstrating fundamental concepts of relational database management systems and modern software development.`;

doc.font('Helvetica').fontSize(10.5).fillColor(TEXT_DARK).text(abstractPara1, { align: 'justify', lineGap: 5 });
doc.moveDown(1.2);
doc.text(abstractPara2, { align: 'justify', lineGap: 5 });
doc.moveDown(1.2);
doc.text(abstractPara3, { align: 'justify', lineGap: 5 });
doc.moveDown(1.2);
doc.text(abstractPara4, { align: 'justify', lineGap: 5 });
doc.moveDown(1.2);
doc.text(abstractPara5, { align: 'justify', lineGap: 5 });

// ==========================================
// PAGE 3: TABLE OF CONTENTS (Part 1)
// ==========================================
addReportPage();
printFooter('2');

doc.font('Helvetica-Bold').fontSize(20).fillColor(TEXT_DARK).text('TABLE OF CONTENTS', MARGIN, 70, { align: 'center' });
doc.moveDown(1.5);

const tocData1 = [
  ['', 'Abstract', '1'],
  ['', 'Table of Contents', '2'],
  ['', 'List of Figures', '4'],
  ['', 'List of Tables', '5'],
  ['1', 'Introduction', '6'],
  ['1.1', 'Project Overview', '6'],
  ['1.2', 'Objectives of the Project', '6'],
  ['1.3', 'Importance and Relevance', '6'],
  ['1.4', 'Scope and Limitations', '7'],
  ['2', 'System Design', '8'],
  ['2.1', 'Database Design Overview', '8'],
  ['2.2', 'Entity-Relationship (ER) Diagram', '8'],
  ['2.3', 'Entity Relationships & Cardinalities', '9'],
  ['2.4', 'Description of Tables and Attributes', '10'],
  ['3', 'Frontend Implementation and Screenshots', '12'],
  ['3.1', 'Overview', '12'],
  ['3.2', 'Live Supply Chain Operations Dashboard', '13'],
  ['3.3', 'Farmer Harvest Registration Feature', '14']
];

drawTable(doc.y, ['S. No.', 'Contents', 'Page No.'], tocData1, [50, 360, 77], ['left', 'left', 'center']);

// ==========================================
// PAGE 4: TABLE OF CONTENTS (Part 2)
// ==========================================
addReportPage();
printFooter('3');

const tocData2 = [
  ['3.4', 'Cold Chain Logistics and Fleet Transit', '15'],
  ['3.5', 'Retail Hub and Supermarket Orders', '15'],
  ['3.6', 'Farm-to-Table Consumer Traceability Feature', '16'],
  ['3.7', 'Java Desktop & Applet JDBC Interface', '16'],
  ['4', 'Conclusion', '17'],
  ['4.1', 'Summary of Project Work', '17'],
  ['4.2', 'Achievement of Project Objectives', '17'],
  ['4.3', 'Future Enhancements', '18']
];

doc.y = 80;
drawTable(doc.y, ['S. No.', 'Contents', 'Page No.'], tocData2, [50, 360, 77], ['left', 'left', 'center']);

// ==========================================
// PAGE 5: LIST OF FIGURES
// ==========================================
addReportPage();
printFooter('4');

doc.font('Helvetica-Bold').fontSize(20).fillColor(TEXT_DARK).text('List of Figures', MARGIN, 70, { align: 'center' });
doc.moveDown(1.5);

const figuresData = [
  ['Figure 2.1', 'ER Diagram for Agricultural Supply Chain System', '9'],
  ['Figure 3.1', '3-Tier System Architecture Diagram', '12'],
  ['Figure 3.2', 'Live Operations Dashboard – Inventory and KPI View', '13'],
  ['Figure 3.3', 'Farmer Harvest Registration and Producer Directory', '14'],
  ['Figure 3.4', 'Cold Chain Logistics and Dispatch Tracking', '15'],
  ['Figure 3.5', 'Retail Hub and Distribution Order Placement', '15'],
  ['Figure 3.6', 'Farm-to-Table Verified Consumer Audit Timeline', '16'],
  ['Figure 3.7', 'Java Desktop / JApplet Interface with MySQL JDBC', '16']
];

drawTable(doc.y, ['Figure No.', 'Figure Title', 'Page No.'], figuresData, [80, 330, 77], ['left', 'left', 'center']);

// ==========================================
// PAGE 6: LIST OF TABLES
// ==========================================
addReportPage();
printFooter('5');

doc.font('Helvetica-Bold').fontSize(20).fillColor(TEXT_DARK).text('List of Tables', MARGIN, 70, { align: 'center' });
doc.moveDown(1.5);

const tablesListData = [
  ['Table 2.1', 'Farmers Table Schema', '10'],
  ['Table 2.2', 'Crops Table Schema', '10'],
  ['Table 2.3', 'Batches Table Schema', '11'],
  ['Table 2.4', 'Logistics Table Schema', '11'],
  ['Table 2.5', 'Retail Orders Table Schema', '11']
];

drawTable(doc.y, ['Table No.', 'Table Title', 'Page No.'], tablesListData, [80, 330, 77], ['left', 'left', 'center']);

// ==========================================
// PAGE 7: CHAPTER 1 - INTRODUCTION
// ==========================================
addReportPage();
printFooter('6');

doc.font('Helvetica-Bold').fontSize(18).fillColor(TEXT_DARK).text('Chapter 1', MARGIN, 70);
doc.font('Helvetica-Bold').fontSize(22).fillColor(TEXT_DARK).text('Introduction');
doc.moveDown(1.2);

doc.font('Helvetica-Bold').fontSize(13).fillColor(TEXT_DARK).text('1.1  Project Overview');
doc.font('Helvetica').fontSize(10).fillColor(TEXT_DARK).text(
  `The Agricultural Supply Chain Management System is an enterprise database application developed to provide stakeholders with a transparent and unified digital platform for tracking harvested agricultural commodities. The project focuses on implementing essential supply chain tracking functionalities along with relational database management.`,
  { align: 'justify', lineGap: 4 }
);
doc.moveDown(0.5);
doc.text(
  `The application is designed with a user-friendly interface and a structured relational database to manage information related to farmers, crops, harvest batches, transit logistics, and retail distribution. It demonstrates the practical application of database concepts and software development techniques in building a mission-critical agricultural application.`,
  { align: 'justify', lineGap: 4 }
);

doc.moveDown(1.2);
doc.font('Helvetica-Bold').fontSize(13).fillColor(TEXT_DARK).text('1.2  Objectives of the Project');
doc.font('Helvetica').fontSize(10).fillColor(TEXT_DARK).text('The primary objectives of this project were as follows:', { lineGap: 3 });
doc.moveDown(0.4);

const objectives = [
  'To develop a simple and interactive supply chain management web and desktop interface.',
  'To design a normalized relational database for storing farmer, crop, batch, logistics, and retail records.',
  'To establish robust database connectivity using Java, JDBC, and RESTful APIs.',
  'To implement primary keys, foreign keys, and cascade rules to ensure data integrity.',
  'To model sequential supply chain stages: Harvested, Cold Storage, In Transit, Distributed, Retail Shelved, and Sold.',
  'To provide consumers with farm-to-table traceability through unique Batch IDs.',
  'To apply the theoretical concepts learned in Object-Oriented Programming and RDBMS.'
];

objectives.forEach(obj => {
  doc.text(`•  ${obj}`, { indent: 10, lineGap: 3 });
});

doc.moveDown(1.2);
doc.font('Helvetica-Bold').fontSize(13).fillColor(TEXT_DARK).text('1.3  Importance and Relevance');
doc.font('Helvetica').fontSize(10).fillColor(TEXT_DARK).text(
  `Agricultural supply networks are vital for national food security and economic sustainability. Post-harvest losses due to poor temperature tracking and middleman exploitation severely diminish agricultural profitability. This project provides practical experience in designing a database-driven system that ensures accountability, prevents food spoilage, and provides consumers with verified origin information. It also demonstrates how MySQL, Java, and Web technologies seamlessly integrate in production architectures.`,
  { align: 'justify', lineGap: 4 }
);

// ==========================================
// PAGE 8: CHAPTER 1 (Continued)
// ==========================================
addReportPage();
printFooter('7');

doc.font('Helvetica-Bold').fontSize(13).fillColor(TEXT_DARK).text('1.4  Scope and Limitations', MARGIN, 70);
doc.moveDown(0.6);
doc.font('Helvetica').fontSize(10).fillColor(TEXT_DARK).text(
  `The current scope of the project encompasses digital farmer registration, crop batch management, cold-chain refrigerated transit recording, retail supermarket purchase orders, and consumer traceability lookups. The implementation is intended as an academic and functional prototype demonstrating robust relational database principles.`,
  { align: 'justify', lineGap: 4 }
);
doc.moveDown(0.8);
doc.text(
  `The project's limitations include simulated manual entries for IoT sensors rather than direct physical hardware telematics integration, and internal simulated billing rather than an active commercial banking payment gateway. Future iterations will consider incorporating automated IoT sensors and smart contract blockchain verification.`,
  { align: 'justify', lineGap: 4 }
);

// ==========================================
// PAGE 9: CHAPTER 2 - SYSTEM DESIGN
// ==========================================
addReportPage();
printFooter('8');

doc.font('Helvetica-Bold').fontSize(18).fillColor(TEXT_DARK).text('Chapter 2', MARGIN, 70);
doc.font('Helvetica-Bold').fontSize(22).fillColor(TEXT_DARK).text('System Design');
doc.moveDown(1.2);

doc.font('Helvetica-Bold').fontSize(13).fillColor(TEXT_DARK).text('2.1  Database Design Overview');
doc.font('Helvetica').fontSize(10).fillColor(TEXT_DARK).text(
  `The database of the Agricultural Supply Chain Management application is designed using MySQL, an industry-standard relational database management system. It stores and organizes information related to farmers, crops, batches, logistics, and retail orders.`,
  { align: 'justify', lineGap: 4 }
);
doc.moveDown(0.5);
doc.text(
  `The database consists of five tables: farmers, crops, batches, logistics, and retail_orders. Primary keys uniquely identify each record, while foreign keys establish relationships and enforce referential integrity with ON DELETE CASCADE constraints. Enumerated types (ENUM) constrain state transitions, preventing invalid logistical statuses.`,
  { align: 'justify', lineGap: 4 }
);

doc.moveDown(1.2);
doc.font('Helvetica-Bold').fontSize(13).fillColor(TEXT_DARK).text('2.2  Entity-Relationship (ER) Diagram');
doc.font('Helvetica').fontSize(10).fillColor(TEXT_DARK).text(
  `The Entity-Relationship (ER) diagram illustrates the core entities, attributes, and relationships within the database. The primary entities are Farmers, Crops, Batches, Logistics, and Retail Orders.`,
  { align: 'justify', lineGap: 4 }
);

doc.moveDown(1);

// Draw ER Diagram Box
const boxY = doc.y;
doc.save();
doc.rect(MARGIN, boxY, CONTENT_WIDTH, 240).fillAndStroke('#fcfdfd', BORDER_COLOR);

// Entity Box 1: Farmers
doc.rect(MARGIN + 20, boxY + 20, 100, 60).fillAndStroke('#e8f5e9', PRIMARY);
doc.font('Helvetica-Bold').fontSize(9).fillColor(PRIMARY).text('FARMERS', MARGIN + 25, boxY + 26);
doc.font('Helvetica').fontSize(7.5).fillColor(TEXT_DARK)
  .text('• farmer_id (PK)', MARGIN + 25, boxY + 39)
  .text('• name, phone', MARGIN + 25, boxY + 50)
  .text('• location, acres', MARGIN + 25, boxY + 61);

// Entity Box 2: Crops
doc.rect(MARGIN + 20, boxY + 140, 100, 60).fillAndStroke('#e8f5e9', PRIMARY);
doc.font('Helvetica-Bold').fontSize(9).fillColor(PRIMARY).text('CROPS', MARGIN + 25, boxY + 146);
doc.font('Helvetica').fontSize(7.5).fillColor(TEXT_DARK)
  .text('• crop_id (PK)', MARGIN + 25, boxY + 159)
  .text('• crop_name', MARGIN + 25, boxY + 170)
  .text('• category, price', MARGIN + 25, boxY + 181);

// Entity Box 3: Batches (Central)
doc.rect(MARGIN + 190, boxY + 70, 115, 90).fillAndStroke('#fff3e0', '#e65100');
doc.font('Helvetica-Bold').fontSize(10).fillColor('#e65100').text('BATCHES (Core)', MARGIN + 196, boxY + 78);
doc.font('Helvetica').fontSize(7.5).fillColor(TEXT_DARK)
  .text('• batch_id (PK)', MARGIN + 196, boxY + 92)
  .text('• farmer_id (FK)', MARGIN + 196, boxY + 103)
  .text('• crop_id (FK)', MARGIN + 196, boxY + 114)
  .text('• quantity_kg, grade', MARGIN + 196, boxY + 125)
  .text('• current_status', MARGIN + 196, boxY + 136)
  .text('• storage_temp', MARGIN + 196, boxY + 147);

// Entity Box 4: Logistics
doc.rect(MARGIN + 365, boxY + 20, 105, 75).fillAndStroke('#e3f2fd', '#1565c0');
doc.font('Helvetica-Bold').fontSize(9).fillColor('#1565c0').text('LOGISTICS', MARGIN + 372, boxY + 26);
doc.font('Helvetica').fontSize(7.5).fillColor(TEXT_DARK)
  .text('• logistics_id (PK)', MARGIN + 372, boxY + 39)
  .text('• batch_id (FK)', MARGIN + 372, boxY + 50)
  .text('• transporter_name', MARGIN + 372, boxY + 61)
  .text('• vehicle_number', MARGIN + 372, boxY + 72);

// Entity Box 5: Retail Orders
doc.rect(MARGIN + 365, boxY + 140, 105, 75).fillAndStroke('#f3e5f5', '#7b1fa2');
doc.font('Helvetica-Bold').fontSize(9).fillColor('#7b1fa2').text('RETAIL ORDERS', MARGIN + 372, boxY + 146);
doc.font('Helvetica').fontSize(7.5).fillColor(TEXT_DARK)
  .text('• order_id (PK)', MARGIN + 372, boxY + 159)
  .text('• batch_id (FK)', MARGIN + 372, boxY + 170)
  .text('• retailer_name', MARGIN + 372, boxY + 181)
  .text('• total_amount', MARGIN + 372, boxY + 192);

// Connector Lines
doc.strokeColor('#78909c').lineWidth(1.2);
// Farmer to Batch
doc.moveTo(MARGIN + 120, boxY + 50).lineTo(MARGIN + 190, boxY + 100).stroke();
// Crop to Batch
doc.moveTo(MARGIN + 120, boxY + 170).lineTo(MARGIN + 190, boxY + 130).stroke();
// Batch to Logistics
doc.moveTo(MARGIN + 305, boxY + 100).lineTo(MARGIN + 365, boxY + 55).stroke();
// Batch to Orders
doc.moveTo(MARGIN + 305, boxY + 130).lineTo(MARGIN + 365, boxY + 175).stroke();

doc.font('Helvetica-Bold').fontSize(8).fillColor(TEXT_MUTED)
  .text('1:N', MARGIN + 145, boxY + 65)
  .text('1:N', MARGIN + 145, boxY + 155)
  .text('1:N', MARGIN + 325, boxY + 70)
  .text('1:N', MARGIN + 325, boxY + 160);

doc.restore();

doc.y = boxY + 250;
doc.font('Helvetica-Oblique').fontSize(8.5).fillColor(TEXT_MUTED).text('Figure 2.1: ER Diagram for the Agricultural Supply Chain System', { align: 'center' });

// ==========================================
// PAGE 10: CHAPTER 2 - RELATIONSHIPS & SCHEMAS
// ==========================================
addReportPage();
printFooter('9');

doc.font('Helvetica-Bold').fontSize(14).fillColor(TEXT_DARK).text('2.3  Entity Relationships & Cardinalities', MARGIN, 70);
doc.moveDown(0.8);

doc.font('Helvetica-Bold').fontSize(10.5).fillColor(TEXT_DARK).text('1. Farmers and Batches (1 : N)');
doc.font('Helvetica').fontSize(9.5).fillColor(TEXT_DARK).text(
  `A registered farmer can cultivate and harvest multiple batches of crops. Each batch originates from exactly one farmer. This is enforced by the farmer_id foreign key in the batches table referencing farmers(farmer_id).`,
  { align: 'justify', lineGap: 3 }
);

doc.moveDown(0.6);
doc.font('Helvetica-Bold').fontSize(10.5).fillColor(TEXT_DARK).text('2. Crops and Batches (1 : N)');
doc.font('Helvetica').fontSize(9.5).fillColor(TEXT_DARK).text(
  `A specific crop catalog item (such as Basmati Rice or Organic Wheat) categorizes multiple batches harvested across different regions. Enforced via crop_id in batches referencing crops(crop_id).`,
  { align: 'justify', lineGap: 3 }
);

doc.moveDown(0.6);
doc.font('Helvetica-Bold').fontSize(10.5).fillColor(TEXT_DARK).text('3. Batches and Logistics (1 : N)');
doc.font('Helvetica').fontSize(9.5).fillColor(TEXT_DARK).text(
  `A single batch can undergo multiple transportation legs (e.g. from farm gate to cold storage hub, and hub to wholesale terminal). Represented by the batch_id foreign key in the logistics table.`,
  { align: 'justify', lineGap: 3 }
);

doc.moveDown(0.6);
doc.font('Helvetica-Bold').fontSize(10.5).fillColor(TEXT_DARK).text('4. Batches and Retail Orders (1 : N)');
doc.font('Helvetica').fontSize(9.5).fillColor(TEXT_DARK).text(
  `A large harvest batch can be sold across multiple purchase orders to different supermarket retail chains. Enforced via batch_id in retail_orders referencing batches(batch_id).`,
  { align: 'justify', lineGap: 3 }
);

doc.moveDown(1.5);
doc.font('Helvetica-Bold').fontSize(13).fillColor(TEXT_DARK).text('2.4  Description of Tables and Attributes');
doc.moveDown(0.5);

// Table 2.1
doc.font('Helvetica-Bold').fontSize(9.5).fillColor(TEXT_DARK).text('Table 2.1: Farmers Table Schema');
const t21 = [
  ['farmer_id', 'INT', 'PK', 'Unique identifier for each farmer (Auto Increment)'],
  ['name', 'VARCHAR(100)', '—', 'Full legal name of the producer'],
  ['phone', 'VARCHAR(20)', '—', 'Contact telephone number'],
  ['location', 'VARCHAR(150)', '—', 'Geographical farm location / District'],
  ['farm_size_acres', 'DECIMAL(6,2)', '—', 'Total cultivated land area in acres'],
  ['created_at', 'TIMESTAMP', '—', 'Record creation timestamp']
];
drawTable(doc.y, ['Field', 'Type', 'Key', 'Description'], t21, [100, 95, 45, 247]);

// Table 2.2
doc.font('Helvetica-Bold').fontSize(9.5).fillColor(TEXT_DARK).text('Table 2.2: Crops Table Schema');
const t22 = [
  ['crop_id', 'INT', 'PK', 'Unique identifier for crop type (Auto Increment)'],
  ['crop_name', 'VARCHAR(100)', '—', 'Name of crop (e.g. Basmati Rice, Wheat)'],
  ['category', 'ENUM(...)', '—', 'Grains, Vegetables, Fruits, Pulses, Spices'],
  ['base_price_per_kg', 'DECIMAL(8,2)', '—', 'Benchmark rate per kilogram (INR)']
];
drawTable(doc.y, ['Field', 'Type', 'Key', 'Description'], t22, [100, 95, 45, 247]);

// ==========================================
// PAGE 11: SCHEMAS (Continued)
// ==========================================
addReportPage();
printFooter('10');

doc.font('Helvetica-Bold').fontSize(9.5).fillColor(TEXT_DARK).text('Table 2.3: Batches Table Schema (Core Unit)', MARGIN, 70);
const t23 = [
  ['batch_id', 'VARCHAR(50)', 'PK', 'Unique alphanumeric traceability code'],
  ['farmer_id', 'INT', 'FK', 'References farmers(farmer_id)'],
  ['crop_id', 'INT', 'FK', 'References crops(crop_id)'],
  ['quantity_kg', 'DECIMAL(10,2)', '—', 'Total harvested batch mass in kg'],
  ['harvest_date', 'DATE', '—', 'Date when crop was harvested'],
  ['quality_grade', 'ENUM(...)', '—', 'Grade A (Export), Grade B, Grade C'],
  ['current_status', 'ENUM(...)', '—', 'Harvested, Storage, Transit, Retail, Sold'],
  ['storage_temp_celsius', 'DECIMAL(4,1)', '—', 'Monitored storage temperature'],
  ['created_at', 'TIMESTAMP', '—', 'Timestamp of batch registration']
];
drawTable(doc.y, ['Field', 'Type', 'Key', 'Description'], t23, [110, 95, 45, 237]);

doc.font('Helvetica-Bold').fontSize(9.5).fillColor(TEXT_DARK).text('Table 2.4: Logistics Table Schema');
const t24 = [
  ['logistics_id', 'INT', 'PK', 'Unique shipment ID (Auto Increment)'],
  ['batch_id', 'VARCHAR(50)', 'FK', 'References batches(batch_id)'],
  ['transporter_name', 'VARCHAR(100)', '—', 'Name of logistics provider / carrier'],
  ['vehicle_number', 'VARCHAR(30)', '—', 'Transport vehicle license registration'],
  ['pickup_location', 'VARCHAR(150)', '—', 'Origin farm gate / storage facility'],
  ['drop_location', 'VARCHAR(150)', '—', 'Destination market terminal / APMC'],
  ['dispatch_date', 'DATE', '—', 'Date fleet departed origin'],
  ['transit_status', 'ENUM(...)', '—', 'Scheduled, In Transit, Reached, Delayed']
];
drawTable(doc.y, ['Field', 'Type', 'Key', 'Description'], t24, [110, 95, 45, 237]);

doc.font('Helvetica-Bold').fontSize(9.5).fillColor(TEXT_DARK).text('Table 2.5: Retail Orders Table Schema');
const t25 = [
  ['order_id', 'INT', 'PK', 'Unique order ID (Auto Increment)'],
  ['batch_id', 'VARCHAR(50)', 'FK', 'References batches(batch_id)'],
  ['retailer_name', 'VARCHAR(120)', '—', 'Purchasing supermarket / retail entity'],
  ['retailer_city', 'VARCHAR(100)', '—', 'City of destination retail outlet'],
  ['quantity_ordered_kg', 'DECIMAL(10,2)', '—', 'Purchased volume in kilograms'],
  ['selling_price_per_kg', 'DECIMAL(8,2)', '—', 'Selling price per kilogram'],
  ['total_amount', 'DECIMAL(12,2)', '—', 'Computed order revenue (INR)'],
  ['order_status', 'ENUM(...)', '—', 'Pending, Confirmed, Dispatched, Delivered']
];
drawTable(doc.y, ['Field', 'Type', 'Key', 'Description'], t25, [110, 95, 45, 237]);

// ==========================================
// PAGE 12: CHAPTER 3 - IMPLEMENTATION
// ==========================================
addReportPage();
printFooter('11');

doc.font('Helvetica-Bold').fontSize(18).fillColor(TEXT_DARK).text('Chapter 3', MARGIN, 70);
doc.font('Helvetica-Bold').fontSize(22).fillColor(TEXT_DARK).text('Frontend Implementation and Features');
doc.moveDown(1.2);

doc.font('Helvetica-Bold').fontSize(13).fillColor(TEXT_DARK).text('3.1  Overview');
doc.font('Helvetica').fontSize(10).fillColor(TEXT_DARK).text(
  `The Agricultural Supply Chain Management System provides users with a centralized, responsive interface for managing and verifying agricultural products. The application replicates enterprise agricultural logistics systems while showcasing practical relational database integration.`,
  { align: 'justify', lineGap: 4 }
);
doc.moveDown(0.5);
doc.text(
  `The system employs a 3-tier architecture: the frontend client communicates with a native Node.js REST API layer that queries a persistent MySQL relational database. Concurrently, a standalone Java Desktop and JApplet client connects directly through JDBC to perform desktop-grade CRUD operations.`,
  { align: 'justify', lineGap: 4 }
);

doc.moveDown(1.5);

// Architecture Diagram Box
const archBoxY = doc.y;
doc.save();
doc.rect(MARGIN, archBoxY, CONTENT_WIDTH, 170).fillAndStroke('#fafbfc', BORDER_COLOR);

doc.rect(MARGIN + 30, archBoxY + 15, CONTENT_WIDTH - 60, 36).fillAndStroke('#e8f5e9', PRIMARY);
doc.font('Helvetica-Bold').fontSize(10).fillColor(PRIMARY).text('PRESENTATION TIER', MARGIN + 40, archBoxY + 22);
doc.font('Helvetica').fontSize(8.5).fillColor(TEXT_DARK).text('Responsive Web Portal (HTML5/CSS3) & Java JApplet / Swing GUI', MARGIN + 40, archBoxY + 35);

doc.rect(MARGIN + 30, archBoxY + 67, CONTENT_WIDTH - 60, 36).fillAndStroke('#e3f2fd', '#1565c0');
doc.font('Helvetica-Bold').fontSize(10).fillColor('#1565c0').text('APPLICATION & LOGIC TIER', MARGIN + 40, archBoxY + 74);
doc.font('Helvetica').fontSize(8.5).fillColor(TEXT_DARK).text('Node.js Native HTTP Microservice (REST API) & Java JDBC DAO Layer', MARGIN + 40, archBoxY + 87);

doc.rect(MARGIN + 30, archBoxY + 119, CONTENT_WIDTH - 60, 36).fillAndStroke('#fff3e0', '#e65100');
doc.font('Helvetica-Bold').fontSize(10).fillColor('#e65100').text('DATA PERSISTENCE TIER', MARGIN + 40, archBoxY + 126);
doc.font('Helvetica').fontSize(8.5).fillColor(TEXT_DARK).text('MySQL 8.0 Relational Database (farmers, crops, batches, logistics, retail_orders)', MARGIN + 40, archBoxY + 139);

doc.restore();

doc.y = archBoxY + 180;
doc.font('Helvetica-Oblique').fontSize(8.5).fillColor(TEXT_MUTED).text('Figure 3.1: 3-Tier System Architecture Diagram', { align: 'center' });

// ==========================================
// PAGE 13: 3.2 OPERATIONS DASHBOARD
// ==========================================
addReportPage();
printFooter('12');

doc.font('Helvetica-Bold').fontSize(14).fillColor(TEXT_DARK).text('3.2  Live Supply Chain Operations Dashboard', MARGIN, 70);
doc.moveDown(0.6);
doc.font('Helvetica').fontSize(10).fillColor(TEXT_DARK).text(
  `The live dashboard serves as the central control room for supply chain supervisors. It aggregates live operational statistics into four metric cards and renders an interactive data table displaying all active batches in the supply stream.`,
  { align: 'justify', lineGap: 4 }
);

doc.moveDown(1);

// Mock UI Box for Dashboard
const dBoxY = doc.y;
doc.save();
doc.rect(MARGIN, dBoxY, CONTENT_WIDTH, 180).fillAndStroke('#0f172a', '#334155');

// KPI cards simulation
doc.rect(MARGIN + 10, dBoxY + 10, 105, 45).fill('#1e293b');
doc.font('Helvetica-Bold').fontSize(11).fillColor('#4ade80').text('17,700 kg', MARGIN + 16, dBoxY + 18);
doc.font('Helvetica').fontSize(7.5).fillColor('#94a3b8').text('Total Volume', MARGIN + 16, dBoxY + 34);

doc.rect(MARGIN + 125, dBoxY + 10, 105, 45).fill('#1e293b');
doc.font('Helvetica-Bold').fontSize(11).fillColor('#38bdf8').text('4 Batches', MARGIN + 131, dBoxY + 18);
doc.font('Helvetica').fontSize(7.5).fillColor('#94a3b8').text('Active Batches', MARGIN + 131, dBoxY + 34);

doc.rect(MARGIN + 240, dBoxY + 10, 105, 45).fill('#1e293b');
doc.font('Helvetica-Bold').fontSize(11).fillColor('#f472b6').text('1 Fleet Unit', MARGIN + 246, dBoxY + 18);
doc.font('Helvetica').fontSize(7.5).fillColor('#94a3b8').text('In Cold Transit', MARGIN + 246, dBoxY + 34);

doc.rect(MARGIN + 355, dBoxY + 10, 120, 45).fill('#1e293b');
doc.font('Helvetica-Bold').fontSize(11).fillColor('#fbbf24').text('Rs 1,87,000', MARGIN + 361, dBoxY + 18);
doc.font('Helvetica').fontSize(7.5).fillColor('#94a3b8').text('Retail Revenue', MARGIN + 361, dBoxY + 34);

// Table simulation
doc.rect(MARGIN + 10, dBoxY + 65, CONTENT_WIDTH - 20, 100).fill('#1e293b');
doc.font('Helvetica-Bold').fontSize(8).fillColor('#cbd5e1')
  .text('BATCH ID', MARGIN + 20, dBoxY + 75)
  .text('CROP', MARGIN + 130, dBoxY + 75)
  .text('FARMER', MARGIN + 220, dBoxY + 75)
  .text('QTY (KG)', MARGIN + 310, dBoxY + 75)
  .text('STATUS', MARGIN + 390, dBoxY + 75);

doc.strokeColor('#334155').lineWidth(1)
  .moveTo(MARGIN + 15, dBoxY + 88).lineTo(MARGIN + CONTENT_WIDTH - 15, dBoxY + 88).stroke();

doc.font('Helvetica').fontSize(7.5).fillColor('#f1f5f9')
  .text('BATCH-2026-RICE-01', MARGIN + 20, dBoxY + 98)
  .text('Basmati Rice 1121', MARGIN + 130, dBoxY + 98)
  .text('Ramesh Kumar', MARGIN + 220, dBoxY + 98)
  .text('5,000 kg', MARGIN + 310, dBoxY + 98)
  .text('[In Transit]', MARGIN + 390, dBoxY + 98);

doc.font('Helvetica').fontSize(7.5).fillColor('#f1f5f9')
  .text('BATCH-2026-WHEAT-02', MARGIN + 20, dBoxY + 115)
  .text('Organic Wheat', MARGIN + 130, dBoxY + 115)
  .text('Balwinder Singh', MARGIN + 220, dBoxY + 115)
  .text('8,500 kg', MARGIN + 310, dBoxY + 115)
  .text('[Cold Storage]', MARGIN + 390, dBoxY + 115);

doc.font('Helvetica').fontSize(7.5).fillColor('#f1f5f9')
  .text('BATCH-2026-MANGO-03', MARGIN + 20, dBoxY + 132)
  .text('Alphonso Mango', MARGIN + 130, dBoxY + 132)
  .text('Sita Devi', MARGIN + 220, dBoxY + 132)
  .text('1,200 kg', MARGIN + 310, dBoxY + 132)
  .text('[Distributed]', MARGIN + 390, dBoxY + 132);

doc.restore();

doc.y = dBoxY + 190;
doc.font('Helvetica-Oblique').fontSize(8.5).fillColor(TEXT_MUTED).text('Figure 3.2: Live Operations Dashboard – Inventory and KPI View', { align: 'center' });

doc.moveDown(1.2);
doc.font('Helvetica').fontSize(10).fillColor(TEXT_DARK).text(
  `Each row is color-coded using CSS badges corresponding to the relational ENUM status. Users can trigger an instant traceability breakdown by clicking the Trace button on any row.`,
  { align: 'justify', lineGap: 4 }
);

// ==========================================
// PAGE 14: 3.3 FARMER HARVEST PORTAL
// ==========================================
addReportPage();
printFooter('13');

doc.font('Helvetica-Bold').fontSize(14).fillColor(TEXT_DARK).text('3.3  Farmer Harvest Registration Feature', MARGIN, 70);
doc.moveDown(0.6);
doc.font('Helvetica').fontSize(10).fillColor(TEXT_DARK).text(
  `The Farmer Harvest Registration module allows agricultural producers and mandi inspectors to log fresh harvest yields directly into the database. Every harvest is assigned an immutable Batch ID, linked to the registered farmer, categorized by crop type, and inspected for quality grade (Grade A Export, Grade B Domestic Premium, Grade C Standard Processing).`,
  { align: 'justify', lineGap: 4 }
);

doc.moveDown(1);

// Mock UI Box for Farmer Portal
const fBoxY = doc.y;
doc.save();
doc.rect(MARGIN, fBoxY, CONTENT_WIDTH, 170).fillAndStroke('#fafbfc', BORDER_COLOR);

// Left Form Box
doc.rect(MARGIN + 15, fBoxY + 15, 230, 140).fillAndStroke('#ffffff', BORDER_COLOR);
doc.font('Helvetica-Bold').fontSize(9).fillColor(PRIMARY).text('Register Harvest Batch', MARGIN + 25, fBoxY + 24);
doc.font('Helvetica').fontSize(7.5).fillColor(TEXT_DARK)
  .text('Batch ID:  BATCH-2026-RICE-05', MARGIN + 25, fBoxY + 42)
  .text('Farmer:    Ramesh Kumar (Punjab)', MARGIN + 25, fBoxY + 58)
  .text('Crop:      Basmati Rice 1121', MARGIN + 25, fBoxY + 74)
  .text('Quantity:  2,500 kg', MARGIN + 25, fBoxY + 90)
  .text('Grade:     Grade A (Export Quality)', MARGIN + 25, fBoxY + 106)
  .text('Storage:   18.0 °C', MARGIN + 25, fBoxY + 122);

// Right Farmer List Box
doc.rect(MARGIN + 255, fBoxY + 15, 215, 140).fillAndStroke('#ffffff', BORDER_COLOR);
doc.font('Helvetica-Bold').fontSize(9).fillColor(PRIMARY).text('Verified Regional Producers', MARGIN + 265, fBoxY + 24);
doc.font('Helvetica').fontSize(7.5).fillColor(TEXT_DARK)
  .text('• Ramesh Kumar | Ludhiana, Punjab (15.5 ac)', MARGIN + 265, fBoxY + 45)
  .text('• Sita Devi | Nashik, Maharashtra (8.2 ac)', MARGIN + 265, fBoxY + 68)
  .text('• Balwinder Singh | Karnal, Haryana (22.0 ac)', MARGIN + 265, fBoxY + 91)
  .text('• Arun Patel | Anand, Gujarat (12.0 ac)', MARGIN + 265, fBoxY + 114);

doc.restore();

doc.y = fBoxY + 180;
doc.font('Helvetica-Oblique').fontSize(8.5).fillColor(TEXT_MUTED).text('Figure 3.3: Farmer Harvest Registration and Producer Directory', { align: 'center' });

doc.moveDown(1.2);
doc.font('Helvetica').fontSize(10).fillColor(TEXT_DARK).text(
  `Upon form submission, an HTTP POST request is sent to the /api/batches endpoint. The backend validates constraints and writes the record to persistent storage, instantly updating the global dashboard.`,
  { align: 'justify', lineGap: 4 }
);

// ==========================================
// PAGE 15: 3.4 & 3.5 LOGISTICS & RETAIL
// ==========================================
addReportPage();
printFooter('14');

doc.font('Helvetica-Bold').fontSize(14).fillColor(TEXT_DARK).text('3.4  Cold Chain Logistics and Fleet Transit', MARGIN, 70);
doc.moveDown(0.5);
doc.font('Helvetica').fontSize(10).fillColor(TEXT_DARK).text(
  `Temperature abuse during transit causes rapid decay of perishable crops. The Cold Logistics module enables operators to dispatch refrigerated trucks, record the driver agency, vehicle registration plate, origin farm gate, destination wholesale APMC, and monitored temperature.`,
  { align: 'justify', lineGap: 4 }
);
doc.moveDown(0.4);
doc.text(
  `Dispatching a carrier automatically updates the relational batch state from 'Harvested' or 'Cold Storage' to 'In Transit', preventing double-dispatch anomalies.`,
  { align: 'justify', lineGap: 4 }
);

doc.moveDown(1.5);
doc.font('Helvetica-Bold').fontSize(14).fillColor(TEXT_DARK).text('3.5  Retail Hub and Supermarket Orders');
doc.moveDown(0.5);
doc.font('Helvetica').fontSize(10).fillColor(TEXT_DARK).text(
  `The Retail Hub facilitates B2B commercial transactions between supply hubs and commercial supermarket chains (e.g. Nature Fresh, Daily Greens). Supermarket procurement managers select authenticated available batches, specify purchase volume (kg), and agree upon wholesale rates.`,
  { align: 'justify', lineGap: 4 }
);
doc.moveDown(0.4);
doc.text(
  `The system calculates total transaction amounts, logs the purchase record into the retail_orders table, and marks the batch status as 'Sold' or fulfilled upon confirmation.`,
  { align: 'justify', lineGap: 4 }
);

// ==========================================
// PAGE 16: 3.6 TRACEABILITY & JAVA JDBC
// ==========================================
addReportPage();
printFooter('15');

doc.font('Helvetica-Bold').fontSize(14).fillColor(TEXT_DARK).text('3.6  Farm-to-Table Consumer Traceability Feature', MARGIN, 70);
doc.moveDown(0.5);
doc.font('Helvetica').fontSize(10).fillColor(TEXT_DARK).text(
  `The standout innovation of the system is the Farm-to-Table consumer traceability portal. When a consumer inputs a Batch ID or scans a product QR code, the system executes relational joins across five tables to render a verified vertical audit timeline.`,
  { align: 'justify', lineGap: 4 }
);

doc.moveDown(0.8);

// Traceability Timeline Visual
const tBoxY = doc.y;
doc.save();
doc.rect(MARGIN, tBoxY, CONTENT_WIDTH, 140).fillAndStroke('#f8fafc', BORDER_COLOR);

doc.strokeColor(PRIMARY).lineWidth(2).moveTo(MARGIN + 30, tBoxY + 15).lineTo(MARGIN + 30, tBoxY + 125).stroke();

doc.circle(MARGIN + 30, tBoxY + 25, 5).fillAndStroke(PRIMARY, '#ffffff');
doc.font('Helvetica-Bold').fontSize(9).fillColor(TEXT_DARK).text('Stage 1: Farm Harvest & Quality Inspection', MARGIN + 45, tBoxY + 20);
doc.font('Helvetica').fontSize(7.5).fillColor(TEXT_MUTED).text('Farmer: Ramesh Kumar | Ludhiana Mandi | Certified Grade A (Export Quality)', MARGIN + 45, tBoxY + 32);

doc.circle(MARGIN + 30, tBoxY + 60, 5).fillAndStroke(PRIMARY, '#ffffff');
doc.font('Helvetica-Bold').fontSize(9).fillColor(TEXT_DARK).text('Stage 2: Regional Cold Storage Hub', MARGIN + 45, tBoxY + 55);
doc.font('Helvetica').fontSize(7.5).fillColor(TEXT_MUTED).text('State Agri Quality Board | Cold Storage maintained at 20.0 °C', MARGIN + 45, tBoxY + 67);

doc.circle(MARGIN + 30, tBoxY + 95, 5).fillAndStroke(PRIMARY, '#ffffff');
doc.font('Helvetica-Bold').fontSize(9).fillColor(TEXT_DARK).text('Stage 3: Logistics & Refrigerated Transit', MARGIN + 45, tBoxY + 90);
doc.font('Helvetica').fontSize(7.5).fillColor(TEXT_MUTED).text('Kisan Express Cargo | Vehicle: PB-10-CX-4521 | Ludhiana Mandi -> Delhi Central Hub', MARGIN + 45, tBoxY + 102);

doc.restore();

doc.y = tBoxY + 150;
doc.font('Helvetica-Oblique').fontSize(8.5).fillColor(TEXT_MUTED).text('Figure 3.6: Farm-to-Table Verified Consumer Audit Timeline', { align: 'center' });

doc.moveDown(1.5);
doc.font('Helvetica-Bold').fontSize(14).fillColor(TEXT_DARK).text('3.7  Java Desktop & Applet JDBC Interface');
doc.moveDown(0.5);
doc.font('Helvetica').fontSize(10).fillColor(TEXT_DARK).text(
  `To meet strict academic specifications, the project includes standalone Java classes (DBConnection.java and AgriSupplyChainApp.java). AgriSupplyChainApp extends JApplet with a main() launcher, offering tabbed forms for Harvest Registration, Inventory Tables, Logistics, and Traceability using pure JDBC PreparedStatement calls.`,
  { align: 'justify', lineGap: 4 }
);

// ==========================================
// PAGE 17: CHAPTER 4 - CONCLUSION
// ==========================================
addReportPage();
printFooter('16');

doc.font('Helvetica-Bold').fontSize(18).fillColor(TEXT_DARK).text('Chapter 4', MARGIN, 70);
doc.font('Helvetica-Bold').fontSize(22).fillColor(TEXT_DARK).text('Conclusion');
doc.moveDown(1.2);

doc.font('Helvetica-Bold').fontSize(13).fillColor(TEXT_DARK).text('4.1  Summary of Project Work');
doc.font('Helvetica').fontSize(10).fillColor(TEXT_DARK).text(
  `The Agricultural Supply Chain Management System project was developed to provide a robust, transparent, and user-friendly platform for managing agricultural logistics. The project successfully combines frontend web and Java development with relational database management using MySQL.`,
  { align: 'justify', lineGap: 4 }
);
doc.moveDown(0.5);
doc.text(
  `The application includes features such as harvest batch registration, cold chain temperature monitoring, transport route dispatching, retail order processing, and full consumer origin verification. The user interface is designed with a modern responsive theme and tabbed navigation for convenient access across operational stages.`,
  { align: 'justify', lineGap: 4 }
);
doc.moveDown(0.5);
doc.text(
  `The database was designed using MySQL and consists of five tables: Farmers, Crops, Batches, Logistics, and Retail Orders. Primary keys, foreign keys, and ENUM domain constraints were implemented to maintain data integrity and establish relationships between the tables.`,
  { align: 'justify', lineGap: 4 }
);
doc.moveDown(0.5);
doc.text(
  `Through this project, practical knowledge of database design, SQL queries, relational schema development, and frontend-to-backend connectivity was applied. The project demonstrates how relational database concepts can be integrated into an agricultural application to organize and manage supply chain information effectively.`,
  { align: 'justify', lineGap: 4 }
);

doc.moveDown(1.5);
doc.font('Helvetica-Bold').fontSize(13).fillColor(TEXT_DARK).text('4.2  Achievement of Project Objectives');
doc.font('Helvetica').fontSize(10).fillColor(TEXT_DARK).text(
  `The main objectives of the Agricultural Supply Chain Management System project were achieved by developing an interactive interface integrated with a relational database. The key objectives achieved are:`,
  { lineGap: 3 }
);
doc.moveDown(0.4);

const achievements = [
  '1. User-Friendly Interface: Developed a modern web interface with tab navigation for convenient access to different operational sections of the application.',
  '2. Harvest & Crop Registration: Implemented structured forms for registering new harvest batches with quality grades and monitored temperatures.',
  '3. Cold Chain Management: Integrated logistics dispatch functionality to monitor refrigerated carriers and transit routes.',
  '4. Retail Hub: Provided procurement ordering workflows with dynamic revenue calculation.',
  '5. Consumer Traceability: Built an instant multi-table relational query feature allowing consumers to verify product history by Batch ID.',
  '6. Database Design & Integrity: Designed a 5-table MySQL schema utilizing primary keys, foreign keys, and cascade constraints to prevent data anomalies.',
  '7. Java JDBC Connectivity: Implemented standalone Java classes to execute parameterized SQL statements via JDBC drivers.'
];

achievements.forEach(ach => {
  doc.text(ach, { indent: 8, lineGap: 3 });
});

// ==========================================
// PAGE 18: FUTURE ENHANCEMENTS
// ==========================================
addReportPage();
printFooter('17');

doc.font('Helvetica-Bold').fontSize(13).fillColor(TEXT_DARK).text('4.3  Future Enhancements', MARGIN, 70);
doc.moveDown(0.6);
doc.font('Helvetica').fontSize(10).fillColor(TEXT_DARK).text(
  `While the current version of the Agricultural Supply Chain Management System successfully implements core database and logistics tracking features, several advanced enhancements are planned for future versions:`,
  { lineGap: 4 }
);
doc.moveDown(0.6);

const futurePoints = [
  '• IoT Hardware Telematics: Direct integration of GPS trackers and digital thermistors inside refrigerated cargo vehicles to stream live temperature data directly to the database via MQTT/HTTP protocols.',
  '• Blockchain Audit Trail: Anchoring critical batch lifecycle transactions to an immutable distributed ledger (e.g. Ethereum or Hyperledger Fabric) to prevent retrospective record tampering.',
  '• Dynamic QR Code Generation: Automated generation of printable GS1-standardized QR stickers for immediate scanning by consumer smartphones at retail checkout counters.',
  '• Automated Payment Escrow: Integration of UPI and banking payment gateways to automatically disburse funds to farmers upon digital signature of receipt by retail buyers.'
];

futurePoints.forEach(p => {
  doc.text(p, { indent: 10, lineGap: 4, align: 'justify' });
  doc.moveDown(0.3);
});

doc.moveDown(2);
doc.font('Helvetica-Bold').fontSize(12).fillColor(TEXT_DARK).text('References & Bibliography');
doc.moveDown(0.5);

const references = [
  '1. Elmasri, R., & Navathe, S. B. Fundamentals of Database Systems (7th ed.). Pearson Education.',
  '2. Silberschatz, A., Korth, H. F., & Sudarshan, S. Database System Concepts (7th ed.). McGraw-Hill.',
  '3. Oracle Corporation. MySQL 8.0 Reference Manual: Relational Database Architecture and SQL Syntax.',
  '4. Horstmann, C. S. Core Java Volume I – Fundamentals (12th ed.). Prentice Hall.'
];

references.forEach(r => {
  doc.font('Helvetica').fontSize(9).fillColor(TEXT_MUTED).text(r, { lineGap: 3 });
});

// Finalize
doc.end();

writeStream.on('finish', () => {
  console.log(`[SUCCESS] PDF generated successfully at: ${OUTPUT_PDF}`);
});
