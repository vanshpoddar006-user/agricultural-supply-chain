import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

/**
 * DBConnection - JDBC Helper for MySQL Connectivity
 * Agricultural Supply Chain Management System
 */
public class DBConnection {
    // Database credentials
    private static final String URL = "jdbc:mysql://localhost:3306/agri_supply_chain?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC";
    private static final String USER = "root";
    private static final String PASSWORD = "password"; // Replace with your MySQL password

    private static Connection connection = null;

    public static Connection getConnection() {
        try {
            if (connection == null || connection.isClosed()) {
                // Load MySQL JDBC Driver
                Class.forName("com.mysql.cj.jdbc.Driver");
                connection = DriverManager.getConnection(URL, USER, PASSWORD);
                System.out.println("[DBConnection] Connected to MySQL database successfully.");
            }
        } catch (ClassNotFoundException e) {
            System.err.println("[DBConnection Error] MySQL Driver not found. Ensure mysql-connector-java.jar is on classpath.");
            e.printStackTrace();
        } catch (SQLException e) {
            System.err.println("[DBConnection Error] Failed to connect to MySQL database: " + e.getMessage());
        }
        return connection;
    }

    public static void closeConnection() {
        try {
            if (connection != null && !connection.isClosed()) {
                connection.close();
                System.out.println("[DBConnection] Connection closed.");
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
