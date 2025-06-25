import mysql from "mysql2/promise";
import dotenv from 'dotenv';


dotenv.config();
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'warriors',
    multipleStatements: true
};

const sqlStatements = [
  // Drop tables in reverse order of creation (to avoid foreign key constraints)

  `DROP TABLE IF EXISTS warriors_player;`,
  `DROP TABLE IF EXISTS game_player;`,
  `DROP TABLE IF EXISTS warrior_power;`,
  `DROP TABLE IF EXISTS warrior;`,
  `DROP TABLE IF EXISTS game;`,
  `DROP TABLE IF EXISTS user;`,
  `DROP TABLE IF EXISTS breed;`,
  `DROP TABLE IF EXISTS magic;`,
  `DROP TABLE IF EXISTS player;`,
  `DROP TABLE IF EXISTS power;`,
  `DROP TABLE IF EXISTS role;`,
  `DROP TABLE IF EXISTS status;`,
  `DROP TABLE IF EXISTS token;`,
  `DROP TABLE IF EXISTS type_warrior;`,

  // Create tables in proper order
  `CREATE TABLE breed (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL UNIQUE,
    description VARCHAR(255),
    resistance INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB;`,

  `CREATE TABLE magic (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL UNIQUE,
    description VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB;`,

  `CREATE TABLE player (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB;`,

  `CREATE TABLE power (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    damage INT NOT NULL,
    energy INT NOT NULL,
    effect VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB;`,

  `CREATE TABLE role (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB;`,

  `CREATE TABLE status (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB;`,

  `CREATE TABLE type_warrior (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB;`,

  `CREATE TABLE warrior (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) UNIQUE NOT NULL,
    life INT NOT NULL,
    intelligence INT NOT NULL,
    energy INT NOT NULL,
    photo VARCHAR(255),
    breed_fk INT NOT NULL,
    magic_fk INT NOT NULL,
    typeWarrior_fk INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (breed_fk) REFERENCES breed(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (magic_fk) REFERENCES magic(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (typeWarrior_fk) REFERENCES type_warrior(id) ON DELETE RESTRICT ON UPDATE CASCADE
  ) ENGINE=InnoDB;`,
  
  `CREATE TABLE warrior_power (
    id INT AUTO_INCREMENT PRIMARY KEY,
    warrior_fk INT NOT NULL,
    power_fk INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (warrior_fk) REFERENCES warrior(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (power_fk) REFERENCES power(id) ON DELETE RESTRICT ON UPDATE CASCADE
  ) ENGINE=InnoDB;`,
  
  `CREATE TABLE user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role_fk INT NOT NULL,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (role_fk) REFERENCES role(id) ON DELETE RESTRICT ON UPDATE CASCADE
  ) ENGINE=InnoDB;`,

  `CREATE TABLE game (
    id INT AUTO_INCREMENT PRIMARY KEY,
    token VARCHAR(255) NOT NULL UNIQUE,
    user_fk INT NOT NULL,
    status_fk INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_fk) REFERENCES user(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (status_fk) REFERENCES status(id) ON DELETE RESTRICT ON UPDATE CASCADE
  ) ENGINE=InnoDB;`,

  `CREATE TABLE game_player (
    id INT AUTO_INCREMENT PRIMARY KEY,
    gamePlayer_winner TINYINT NOT NULL,
    game_fk INT NOT NULL,
    player_fk INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (game_fk) REFERENCES game(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (player_fk) REFERENCES player(id) ON DELETE CASCADE ON UPDATE CASCADE
  ) ENGINE=InnoDB;`,

  `CREATE TABLE warriors_player (
    id INT AUTO_INCREMENT PRIMARY KEY,
    game_player_fk INT NOT NULL,
    warrior_fk INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (game_player_fk) REFERENCES game_player(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (warrior_fk) REFERENCES warrior(id) ON DELETE CASCADE ON UPDATE CASCADE
    ) ENGINE=InnoDB;`,

  // Insert initial data
  // `INSERT INTO User_status (name, description) VALUES 
  //   ('active', 'Active user'),
  //   ('inactive', 'Inactive user'),
  //   ('suspended', 'Suspended user');`,

  // `INSERT INTO Document_type (name, description) VALUES 
  //   ('CC', 'Cedula de ciudadanía'),
  //   ('TI', 'Tarjeta de identidad'),
  //   ('CE', 'Cédula de Extranjería');`,

  // `INSERT INTO Role (name, description) VALUES 
  //   ('admin', 'System Administrator'),
  //   ('user', 'Regular User'),
  //   ('manager', 'Department Manager');`,
  // `DROP PROCEDURE IF EXISTS sp_show_user_active;`,
  // `CREATE PROCEDURE sp_show_user_active()
  //   BEGIN
  //   SELECT US.id,US.username,US.email,US.password_hash,US.status_id,UST.name AS status_name,US.last_login,US.created_at,US.updated_at  FROM user AS US 
  //   INNER JOIN  user_status UST ON US.status_id=UST.id WHERE US.status_id=1 ORDER BY US.id;
  //   END;`,
  // `DROP PROCEDURE IF EXISTS sp_show_id_user_active;`,
  // `CREATE PROCEDURE sp_show_id_user_active(IN Id INT)
  //   BEGIN
  //   SELECT US.id,US.username,US.email,US.password_hash,US.status_id,UST.name AS status_name,US.last_login,US.created_at,US.updated_at  FROM user AS US 
  //   INNER JOIN  user_status UST ON US.status_id=UST.id WHERE US.status_id=1 AND US.id=Id ORDER BY US.id;
  //   END;`,

];

export async function runMigration() {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log('Connected to MySql database');

        for (const sql of sqlStatements) {
            try {
                await connection.query(sql);
                console.log('Executed SQL statement successfully');
            } catch (error) {
                console.error('Error executing SQL:', error.message);
                throw error;
            }
        }

        console.log('Database migration completed successfully');
        return { success: true };
    } catch (error) {
        console.error('Migration Failed:', error);
        return { success: false, error};
    } finally {
        if (connection) {
            await connection.end();
            console.log('Database connection closed');
        }
    }
}

