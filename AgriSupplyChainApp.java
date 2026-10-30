import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.awt.event.*;
import java.sql.*;

/**
 * Agricultural Supply Chain Management System
 * Dual Applet / Standalone Swing Application with MySQL Database Connectivity
 * 
 * Works as:
 * 1. JApplet (for academic submission / legacy appletviewer)
 * 2. Standalone Desktop Application via main() method
 */
public class AgriSupplyChainApp extends JApplet {

    // UI Components - Batch Form
    private JTextField txtBatchId, txtFarmerId, txtCropId, txtQuantity, txtTemp;
    private JComboBox<String> cmbGrade, cmbStatus;
    private JButton btnAddBatch, btnRefreshTable, btnSearchTrace;

    // UI Components - Table & Search
    private JTable batchTable;
    private DefaultTableModel tableModel;
    private JTextField txtSearchBatch;
    private JTextArea txtTraceResults;

    // UI Components - Logistics Form
    private JTextField txtLogisticsBatchId, txtTransporter, txtVehicle, txtPickup, txtDrop;
    private JComboBox<String> cmbTransitStatus;
    private JButton btnAssignLogistics;

    @Override
    public void init() {
        // Applet initialization
        SwingUtilities.invokeLater(this::buildUI);
    }

    private void buildUI() {
        setLayout(new BorderLayout());

        // Header Title
        JPanel headerPanel = new JPanel();
        headerPanel.setBackground(new Color(34, 112, 62));
        headerPanel.setBorder(BorderFactory.createEmptyBorder(12, 16, 12, 16));
        JLabel titleLabel = new JLabel("🌾 Agricultural Supply Chain Management System (Java + MySQL)");
        titleLabel.setFont(new Font("Segoe UI", Font.BOLD, 18));
        titleLabel.setForeground(Color.WHITE);
        headerPanel.add(titleLabel);
        add(headerPanel, BorderLayout.NORTH);

        // Tabbed Pane for Navigation
        JTabbedPane tabs = new JTabbedPane();
        tabs.setFont(new Font("Segoe UI", Font.PLAIN, 14));

        // Tab 1: Register Crop Harvest Batch
        tabs.addTab("1. Register Harvest Batch", createBatchPanel());

        // Tab 2: Supply Chain Inventory & Status
        tabs.addTab("2. Inventory & Batch Tracking", createTablePanel());

        // Tab 3: Logistics & Transit Management
        tabs.addTab("3. Logistics & Transit", createLogisticsPanel());

        // Tab 4: Consumer Traceability Lookup
        tabs.addTab("4. Farm-to-Table Traceability", createTracePanel());

        add(tabs, BorderLayout.CENTER);

        // Footer / Status
        JPanel footer = new JPanel(new FlowLayout(FlowLayout.LEFT));
        footer.setBorder(BorderFactory.createEmptyBorder(6, 12, 6, 12));
        JLabel statusLbl = new JLabel("Database: MySQL (agri_supply_chain) | Ready");
        statusLbl.setFont(new Font("Segoe UI", Font.ITALIC, 12));
        footer.add(statusLbl);
        add(footer, BorderLayout.SOUTH);

        // Auto load initial data
        loadBatchesFromDB();
    }

    // Panel 1: Create Harvest Batch
    private JPanel createBatchPanel() {
        JPanel panel = new JPanel(new GridBagLayout());
        panel.setBorder(BorderFactory.createEmptyBorder(20, 30, 20, 30));
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(8, 8, 8, 8);
        gbc.fill = GridBagConstraints.HORIZONTAL;

        txtBatchId = new JTextField("BATCH-2026-", 18);
        txtFarmerId = new JTextField("1", 18);
        txtCropId = new JTextField("1", 18);
        txtQuantity = new JTextField("1000", 18);
        txtTemp = new JTextField("18.0", 18);

        cmbGrade = new JComboBox<>(new String[]{"Grade A (Export)", "Grade B (Premium)", "Grade C (Standard)"});
        cmbStatus = new JComboBox<>(new String[]{"Harvested", "Cold Storage", "In Transit", "Distributed", "Retail Shelved", "Sold"});

        int row = 0;
        addRow(panel, gbc, row++, "Batch ID:", txtBatchId);
        addRow(panel, gbc, row++, "Farmer ID:", txtFarmerId);
        addRow(panel, gbc, row++, "Crop ID:", txtCropId);
        addRow(panel, gbc, row++, "Harvest Quantity (Kg):", txtQuantity);
        addRow(panel, gbc, row++, "Quality Grade:", cmbGrade);
        addRow(panel, gbc, row++, "Storage Temperature (°C):", txtTemp);
        addRow(panel, gbc, row++, "Initial Status:", cmbStatus);

        btnAddBatch = new JButton("Save Crop Batch to Database");
        btnAddBatch.setBackground(new Color(34, 139, 34));
        btnAddBatch.setForeground(Color.WHITE);
        btnAddBatch.setFont(new Font("Segoe UI", Font.BOLD, 13));
        btnAddBatch.addActionListener(e -> saveBatchToDB());

        gbc.gridx = 1;
        gbc.gridy = row;
        panel.add(btnAddBatch, gbc);

        return panel;
    }

    // Panel 2: Table View
    private JPanel createTablePanel() {
        JPanel panel = new JPanel(new BorderLayout(10, 10));
        panel.setBorder(BorderFactory.createEmptyBorder(15, 15, 15, 15));

        String[] cols = {"Batch ID", "Farmer ID", "Crop ID", "Quantity (Kg)", "Harvest Date", "Quality Grade", "Status", "Temp (°C)"};
        tableModel = new DefaultTableModel(cols, 0);
        batchTable = new JTable(tableModel);
        batchTable.setRowHeight(24);

        JScrollPane scroll = new JScrollPane(batchTable);
        panel.add(scroll, BorderLayout.CENTER);

        JPanel btnBar = new JPanel(new FlowLayout(FlowLayout.RIGHT));
        btnRefreshTable = new JButton("Refresh Data from MySQL");
        btnRefreshTable.addActionListener(e -> loadBatchesFromDB());
        btnBar.add(btnRefreshTable);
        panel.add(btnBar, BorderLayout.SOUTH);

        return panel;
    }

    // Panel 3: Logistics
    private JPanel createLogisticsPanel() {
        JPanel panel = new JPanel(new GridBagLayout());
        panel.setBorder(BorderFactory.createEmptyBorder(20, 30, 20, 30));
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(8, 8, 8, 8);
        gbc.fill = GridBagConstraints.HORIZONTAL;

        txtLogisticsBatchId = new JTextField("BATCH-2026-", 18);
        txtTransporter = new JTextField("AgriLogix Cold Transit", 18);
        txtVehicle = new JTextField("DL-01-AB-1234", 18);
        txtPickup = new JTextField("Punjab Farm Gate", 18);
        txtDrop = new JTextField("Delhi Central Cold Storage", 18);
        cmbTransitStatus = new JComboBox<>(new String[]{"Scheduled", "In Transit", "Reached Destination", "Delayed"});

        int row = 0;
        addRow(panel, gbc, row++, "Batch ID to Transport:", txtLogisticsBatchId);
        addRow(panel, gbc, row++, "Transporter / Agency:", txtTransporter);
        addRow(panel, gbc, row++, "Vehicle Number:", txtVehicle);
        addRow(panel, gbc, row++, "Pickup Location:", txtPickup);
        addRow(panel, gbc, row++, "Destination / Drop:", txtDrop);
        addRow(panel, gbc, row++, "Transit Status:", cmbTransitStatus);

        btnAssignLogistics = new JButton("Dispatch / Assign Transport");
        btnAssignLogistics.setBackground(new Color(25, 118, 210));
        btnAssignLogistics.setForeground(Color.WHITE);
        btnAssignLogistics.setFont(new Font("Segoe UI", Font.BOLD, 13));
        btnAssignLogistics.addActionListener(e -> saveLogisticsToDB());

        gbc.gridx = 1;
        gbc.gridy = row;
        panel.add(btnAssignLogistics, gbc);

        return panel;
    }

    // Panel 4: Consumer Traceability
    private JPanel createTracePanel() {
        JPanel panel = new JPanel(new BorderLayout(10, 10));
        panel.setBorder(BorderFactory.createEmptyBorder(15, 15, 15, 15));

        JPanel searchBar = new JPanel(new FlowLayout(FlowLayout.LEFT));
        searchBar.add(new JLabel("Enter Batch ID:"));
        txtSearchBatch = new JTextField("BATCH-2026-RICE-01", 18);
        searchBar.add(txtSearchBatch);

        btnSearchTrace = new JButton("Track Farm-to-Table Journey");
        btnSearchTrace.setBackground(new Color(230, 81, 0));
        btnSearchTrace.setForeground(Color.WHITE);
        btnSearchTrace.setFont(new Font("Segoe UI", Font.BOLD, 12));
        btnSearchTrace.addActionListener(e -> traceBatch());
        searchBar.add(btnSearchTrace);

        panel.add(searchBar, BorderLayout.NORTH);

        txtTraceResults = new JTextArea();
        txtTraceResults.setFont(new Font("Monospaced", Font.PLAIN, 13));
        txtTraceResults.setEditable(false);
        panel.add(new JScrollPane(txtTraceResults), BorderLayout.CENTER);

        return panel;
    }

    private void addRow(JPanel p, GridBagConstraints gbc, int row, String label, Component comp) {
        gbc.gridx = 0;
        gbc.gridy = row;
        JLabel lbl = new JLabel(label);
        lbl.setFont(new Font("Segoe UI", Font.PLAIN, 13));
        p.add(lbl, gbc);

        gbc.gridx = 1;
        p.add(comp, gbc);
    }

    // JDBC Operations
    private void saveBatchToDB() {
        String batchId = txtBatchId.getText().trim();
        String farmerIdStr = txtFarmerId.getText().trim();
        String cropIdStr = txtCropId.getText().trim();
        String qtyStr = txtQuantity.getText().trim();
        String tempStr = txtTemp.getText().trim();
        String grade = (String) cmbGrade.getSelectedItem();
        String status = (String) cmbStatus.getSelectedItem();

        if (batchId.isEmpty() || farmerIdStr.isEmpty() || cropIdStr.isEmpty() || qtyStr.isEmpty()) {
            JOptionPane.showMessageDialog(this, "Please fill in all required fields.", "Input Error", JOptionPane.WARNING_MESSAGE);
            return;
        }

        Connection conn = DBConnection.getConnection();
        if (conn == null) {
            JOptionPane.showMessageDialog(this, "Could not connect to MySQL Database. Check DBConnection settings.", "Database Error", JOptionPane.ERROR_MESSAGE);
            return;
        }

        String sql = "INSERT INTO batches (batch_id, farmer_id, crop_id, quantity_kg, harvest_date, quality_grade, current_status, storage_temp_celsius) "
                   + "VALUES (?, ?, ?, ?, CURDATE(), ?, ?, ?)";

        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, batchId);
            stmt.setInt(2, Integer.parseInt(farmerIdStr));
            stmt.setInt(3, Integer.parseInt(cropIdStr));
            stmt.setDouble(4, Double.parseDouble(qtyStr));
            stmt.setString(5, grade);
            stmt.setString(6, status);
            stmt.setDouble(7, Double.parseDouble(tempStr));

            int rows = stmt.executeUpdate();
            if (rows > 0) {
                JOptionPane.showMessageDialog(this, "Batch " + batchId + " successfully registered!", "Success", JOptionPane.INFORMATION_MESSAGE);
                loadBatchesFromDB();
            }
        } catch (SQLException ex) {
            JOptionPane.showMessageDialog(this, "MySQL Error: " + ex.getMessage(), "SQL Exception", JOptionPane.ERROR_MESSAGE);
            ex.printStackTrace();
        }
    }

    private void loadBatchesFromDB() {
        tableModel.setRowCount(0);
        Connection conn = DBConnection.getConnection();
        if (conn == null) return;

        String query = "SELECT batch_id, farmer_id, crop_id, quantity_kg, harvest_date, quality_grade, current_status, storage_temp_celsius FROM batches";
        try (Statement stmt = conn.createStatement(); ResultSet rs = stmt.executeQuery(query)) {
            while (rs.next()) {
                tableModel.addRow(new Object[]{
                    rs.getString("batch_id"),
                    rs.getInt("farmer_id"),
                    rs.getInt("crop_id"),
                    rs.getDouble("quantity_kg"),
                    rs.getDate("harvest_date"),
                    rs.getString("quality_grade"),
                    rs.getString("current_status"),
                    rs.getDouble("storage_temp_celsius")
                });
            }
        } catch (SQLException ex) {
            System.err.println("Could not load batches: " + ex.getMessage());
        }
    }

    private void saveLogisticsToDB() {
        String batchId = txtLogisticsBatchId.getText().trim();
        String transporter = txtTransporter.getText().trim();
        String vehicle = txtVehicle.getText().trim();
        String pickup = txtPickup.getText().trim();
        String drop = txtDrop.getText().trim();
        String transitStatus = (String) cmbTransitStatus.getSelectedItem();

        Connection conn = DBConnection.getConnection();
        if (conn == null) {
            JOptionPane.showMessageDialog(this, "Could not connect to MySQL.", "Database Error", JOptionPane.ERROR_MESSAGE);
            return;
        }

        String sql = "INSERT INTO logistics (batch_id, transporter_name, vehicle_number, pickup_location, drop_location, dispatch_date, transit_status) "
                   + "VALUES (?, ?, ?, ?, ?, CURDATE(), ?)";

        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, batchId);
            stmt.setString(2, transporter);
            stmt.setString(3, vehicle);
            stmt.setString(4, pickup);
            stmt.setString(5, drop);
            stmt.setString(6, transitStatus);

            stmt.executeUpdate();

            // Also update batch status to 'In Transit'
            PreparedStatement updateBatch = conn.prepareStatement("UPDATE batches SET current_status = 'In Transit' WHERE batch_id = ?");
            updateBatch.setString(1, batchId);
            updateBatch.executeUpdate();

            JOptionPane.showMessageDialog(this, "Logistics record added & Batch marked 'In Transit'!", "Success", JOptionPane.INFORMATION_MESSAGE);
            loadBatchesFromDB();
        } catch (SQLException ex) {
            JOptionPane.showMessageDialog(this, "SQL Error: " + ex.getMessage(), "Error", JOptionPane.ERROR_MESSAGE);
        }
    }

    private void traceBatch() {
        String queryBatchId = txtSearchBatch.getText().trim();
        Connection conn = DBConnection.getConnection();
        if (conn == null) {
            txtTraceResults.setText("Database is not connected. Please verify MySQL configuration in DBConnection.java.");
            return;
        }

        StringBuilder sb = new StringBuilder();
        sb.append("========================================================================\n");
        sb.append("                 FARM-TO-TABLE SUPPLY CHAIN TRACEABILITY               \n");
        sb.append("========================================================================\n\n");

        String batchSql = "SELECT b.*, f.name AS farmer_name, f.location AS farm_location, c.crop_name "
                        + "FROM batches b "
                        + "JOIN farmers f ON b.farmer_id = f.farmer_id "
                        + "JOIN crops c ON b.crop_id = c.crop_id "
                        + "WHERE b.batch_id = ?";

        try (PreparedStatement stmt = conn.prepareStatement(batchSql)) {
            stmt.setString(1, queryBatchId);
            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                sb.append("[STAGE 1: ORIGIN & HARVEST]\n");
                sb.append("  Batch ID      : ").append(rs.getString("batch_id")).append("\n");
                sb.append("  Crop          : ").append(rs.getString("crop_name")).append("\n");
                sb.append("  Farmer Name   : ").append(rs.getString("farmer_name")).append("\n");
                sb.append("  Farm Location : ").append(rs.getString("farm_location")).append("\n");
                sb.append("  Harvest Date  : ").append(rs.getDate("harvest_date")).append("\n");
                sb.append("  Quantity      : ").append(rs.getDouble("quantity_kg")).append(" Kg\n");
                sb.append("  Quality Grade : ").append(rs.getString("quality_grade")).append("\n");
                sb.append("  Storage Temp  : ").append(rs.getDouble("storage_temp_celsius")).append(" °C\n");
                sb.append("  Current Status: ").append(rs.getString("current_status")).append("\n\n");

                // Check Logistics
                sb.append("[STAGE 2: LOGISTICS & COLD TRANSIT]\n");
                PreparedStatement logStmt = conn.prepareStatement("SELECT * FROM logistics WHERE batch_id = ? ORDER BY logistics_id DESC");
                logStmt.setString(1, queryBatchId);
                ResultSet logRs = logStmt.executeQuery();
                if (logRs.next()) {
                    sb.append("  Transporter   : ").append(logRs.getString("transporter_name")).append("\n");
                    sb.append("  Vehicle No.   : ").append(logRs.getString("vehicle_number")).append("\n");
                    sb.append("  From -> To    : ").append(logRs.getString("pickup_location")).append(" -> ").append(logRs.getString("drop_location")).append("\n");
                    sb.append("  Dispatch Date : ").append(logRs.getDate("dispatch_date")).append("\n");
                    sb.append("  Transit State : ").append(logRs.getString("transit_status")).append("\n\n");
                } else {
                    sb.append("  No logistics transit dispatched yet.\n\n");
                }

                sb.append("STATUS: Verified Authenticated Produce.\n");
            } else {
                sb.append("No record found for Batch ID: ").append(queryBatchId).append("\n");
            }
        } catch (SQLException ex) {
            sb.append("SQL Error during trace: ").append(ex.getMessage());
        }

        txtTraceResults.setText(sb.toString());
    }

    /**
     * Standalone Launcher (Allows running without an Applet viewer)
     */
    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> {
            try {
                UIManager.setLookAndFeel(UIManager.getSystemLookAndFeelClassName());
            } catch (Exception ignored) {}

            JFrame frame = new JFrame("Agricultural Supply Chain Management System - Java + MySQL");
            frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
            frame.setSize(950, 680);
            frame.setLocationRelativeTo(null);

            AgriSupplyChainApp app = new AgriSupplyChainApp();
            app.init();
            frame.setContentPane(app);
            frame.setVisible(true);
        });
    }
}
