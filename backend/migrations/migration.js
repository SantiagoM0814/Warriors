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
  `INSERT INTO role (name) VALUES
    ('Admin');`,

  `INSERT INTO status (name) VALUES
    ('Activa'),
    ('Pendiente'),
    ('Expirada'),
    ('Finalizada');`,

  `INSERT INTO user (username, password, role_fk) VALUES
    ('Admin', '$2b$10$pRvxy7sQXQIpwAGlCOMRzO6cIpiFN6xd4RCQKoZ4eiRLqF2atnXNm', 1);`,  

  `INSERT INTO breed (name, description, resistance) VALUES
    ('Dragon', 'Criatura legendaria con gran poder físico', 95),
    ('Spellcaster', 'Ser místico con gran dominio de la magia oscura', 80),
    ('Warrior', 'Combatiente experto en ataques físicos', 85),
    ('Fiend', 'Entidad oscura con habilidades malignas', 75),
    ('Fairy', 'Ser celestial con energía luminosa', 70),
    ('Beast', 'Criatura salvaje de gran instinto', 65),
    ('Zombie', 'No-muerto que resiste daño constante', 60),
    ('Machine', 'Unidad mecánica con fuerza metálica', 90),
    ('Aqua', 'Ser vinculado al poder del agua', 68),
    ('Thunder', 'Entidad que domina la energía eléctrica', 78);`,

  `INSERT INTO magic (name, description) VALUES
    ('Dark', 'Magia basada en energía oscura y maligna'),
    ('Light', 'Magia luminosa de poder celestial'),
    ('Fire', 'Magia ofensiva con llamas ardientes'),
    ('Water', 'Magia fluida que controla el agua'),
    ('Earth', 'Magia de rocas, arena y fuerza bruta'),
    ('Wind', 'Magia ágil basada en corrientes de aire'),
    ('Divine', 'Magia sagrada de nivel superior'),
    ('Chaos', 'Magia inestable que mezcla luz y oscuridad'),
    ('Psychic', 'Magia mental de manipulación y control'),
    ('Illusion', 'Magia que engaña los sentidos y confunde');`,

  `INSERT INTO power (name, damage, energy, effect) VALUES
    ('Dark Magic Attack', 2600, 400, 'Destruye todas las cartas mágicas y trampa del oponente'),
    ('White Lightning', 3000, 500, 'Ataque directo con energía devastadora'),
    ('Soul Slash', 1800, 350, 'Ignora la defensa y daña directamente al alma del rival'),
    ('Flame Burst', 1200, 200, 'Inflige daño por fuego continuo durante 2 turnos'),
    ('Tsunami Wave', 1400, 220, 'Inunda el campo reduciendo el ataque de enemigos'),
    ('Stone Crush', 1600, 180, 'Aplasta al enemigo con poder de roca'),
    ('Wind Cutter', 1300, 170, 'Ataca dos veces en un turno'),
    ('Chaos Spiral', 2100, 400, 'Funde luz y oscuridad causando confusión'),
    ('Mental Break', 1500, 300, 'Reduce energía y defensa del enemigo'),
    ('Holy Beam', 2000, 350, 'Daño sagrado extra contra entidades oscuras'),
    ('Shadow Bind', 0, 150, 'Paraliza al enemigo por un turno'),
    ('Thunder Roar', 1700, 250, 'Daño eléctrico con posibilidad de aturdir'),
    ('Blizzard Fang', 1200, 190, 'Congela al enemigo limitando su siguiente acción'),
    ('Drain Touch', 1000, 180, 'Roba energía al oponente'),
    ('Iron Smash', 1600, 230, 'Ataque físico con probabilidad de romper defensa'),
    ('Psychic Shock', 1500, 270, 'Causa daño mental y desorientación'),
    ('Light Flash', 1100, 160, 'Ciega al enemigo por un turno'),
    ('Venom Shot', 1400, 210, 'Envenena y causa daño por turno'),
    ('Sacred Shield', 0, 100, 'Bloquea todo ataque durante un turno'),
    ('Mirror Blast', 1800, 300, 'Refleja parte del daño recibido'),
    ('Phantom Strike', 1900, 280, 'Ignora armadura y resurrección'),
    ('Doom Howl', 2000, 320, 'Debilita el poder de todos los enemigos'),
    ('Aqua Prison', 1300, 200, 'Encierra al oponente y reduce su movilidad'),
    ('Gravity Crush', 1700, 260, 'Aumenta el peso del enemigo reduciendo su evasión'),
    ('Dark Seal', 0, 180, 'Sella las habilidades mágicas del enemigo por 2 turnos'),
    ('Solar Storm', 2200, 400, 'Llamarada solar que daña a todos los enemigos'),
    ('Spiritual Heal', -1500, 200, 'Restaura vida al usuario o aliado'),
    ('Ghost Fade', 0, 120, 'Permite evadir el próximo ataque recibido'),
    ('Meteor Breaker', 2500, 450, 'Invoca un meteorito que causa daño masivo'),
    ('Blade Fury', 1600, 240, 'Ataques consecutivos con alta velocidad');`,

  `INSERT INTO type_warrior (name, description) VALUES
    ('Tank', 'Especializado en resistir ataques con alta defensa'),
    ('Assassin', 'Ataca rápidamente causando alto daño crítico'),
    ('Mage', 'Usa magia para atacar o controlar el campo'),
    ('Support', 'Ayuda a aliados con curación o mejoras'),
    ('Sniper', 'Ataca desde larga distancia con precisión'),
    ('Berserker', 'Sacrifica defensa por fuerza bruta'),
    ('Summoner', 'Invoca criaturas para luchar por él'),
    ('Paladin', 'Combina defensa sagrada con buen ataque'),
    ('Ninja', 'Ágil, evasivo y letal en ataques sorpresa'),
    ('Elementalist', 'Controla elementos naturales para atacar');`,

  `INSERT INTO warrior (name, life, intelligence, energy, photo, breed_fk, magic_fk, typeWarrior_fk) VALUES
  ('Dark Magician', 8500, 9200, 8700, 'backend/data/uploads/DarkMagician.jpg', 2, 1, 3),
  ('Blue-Eyes White Dragon',10000,5000, 9800, 'backend/data/uploads/BlueEyesWhiteDragon.jpg', 1, 2, 6),
  ('Flame Swordsman', 7800, 6200, 8100, 'backend/data/uploads/FlameSwordsman.jpg', 3, 3, 6),
  ('Aqua Spirit', 7200, 7000, 7600, 'backend/data/uploads/AquaSpirit.jpg', 9, 4, 4),
  ('Earth Golem', 9400, 4800, 6000, 'backend/data/uploads/EarthGolem.jpg', 5, 5, 1),
  ('Winged Kuriboh', 5000, 8800, 9500, 'backend/data/uploads/WingedKuriboh.jpg', 6, 10, 9),
  ('Cyber Dragon', 8800, 5600, 8500, 'backend/data/uploads/CyberDragon.jpg', 8, 6, 5),
  ('Zombie Warrior', 8300, 4500, 7000, 'backend/data/uploads/ZombieWarrior.jpg', 7, 8, 1),
  ('Mystical Elf', 7700, 8400, 9000, 'backend/data/uploads/MysticalElf.jpg', 5, 2, 4),
  ('Dark Magician Girl', 7800, 8600, 8200, 'backend/data/uploads/DarkMagicianGirl.jpg', 2, 1, 3),
  ('Thunder Dragon', 9200, 5300, 8800, 'backend/data/uploads/ThunderDragon.jpg', 10, 10, 6),
  ('Fiends Sanctuary', 6900, 6600, 7200, 'backend/data/uploads/FiendsSanctuary.jpg', 4, 1, 2),
  ('Paladin of White Dragon',8800,7800, 8900, 'backend/data/uploads/PaladinOfWhiteDragon.jpg', 1, 2, 8),
  ('Summoned Skull', 8600, 6100, 8300, 'backend/data/uploads/SummonedSkull.jpg', 4, 1, 7),
  ('Beast King Barbaros', 9500, 4700, 9100, 'backend/data/uploads/BeastKingBarbaros.jpg', 6, 5, 6),
  ('Psychic Snake', 7100, 9000, 9400, 'backend/data/uploads/PsychicSnake.jpg', 9, 9, 3),
  ('Illusion Magician', 8000, 8300, 8500, 'backend/data/uploads/IllusionMagician.jpg', 2, 10, 3),
  ('Machine King Chateau', 8900, 5200, 8800, 'backend/data/uploads/MachineKingChateau.jpg', 8, 6, 1),
  ('Fairy Cheer Girl', 6600, 9400, 9700, 'backend/data/uploads/FairyCheerGirl.jpg', 5, 2, 4),
  ('Chaos Sorcerer', 8200, 8100, 8600, 'backend/data/uploads/ChaosSorcerer.jpg', 2, 8, 3);`,

  `INSERT INTO warrior_power (warrior_fk, power_fk) VALUES
  (1, 1), (1, 5), (1, 8),
  (2, 3), (2, 6),
  (3, 10), (3, 15),
  (4, 13), (4, 22),
  (5, 14), (5, 27),
  (6, 9), (6, 19),
  (7, 2), (7, 7),
  (8, 4), (8, 28),
  (9, 11), (9, 24),
  (10, 1), (10, 5),
  (11, 20), (11, 29),
  (12, 8), (12, 17),
  (13, 6), (13, 12),
  (14, 5), (14, 15),
  (15, 14), (15, 21),
  (16, 9), (16, 30),
  (17, 10), (17, 18),
  (18, 2), (18, 7),
  (19, 24), (19, 25),
  (20, 1), (20, 8), (20, 16);`,

  `DROP PROCEDURE IF EXISTS sp_show_warrior;`,
  `CREATE PROCEDURE sp_show_warrior()
    BEGIN
      SELECT W.id, W.name, W.life, W.intelligence, W.energy, W.photo, W.breed_fk, B.name AS breed_name, W.magic_fk, M.name AS magic_name, W.typeWarrior_fk, TW.name AS type_warrior_name, GROUP_CONCAT(P.name SEPARATOR ', ') AS powers
      FROM warrior AS W
      INNER JOIN breed AS B ON W.breed_fk = B.id
      INNER JOIN magic AS M ON W.magic_fk = M.id
      INNER JOIN type_warrior AS TW ON W.typeWarrior_fk = TW.id
      LEFT JOIN warrior_power AS WP ON W.id = WP.warrior_fk
      LEFT JOIN power AS P ON WP.power_fk = P.id
      GROUP BY W.id
      ORDER BY W.id;
    END;`,

  `DROP PROCEDURE IF EXISTS sp_show_game;`,
  `CREATE PROCEDURE sp_show_game()
    BEGIN
      SELECT G.id, G.token, G.user_fk, U.username, G.status_fk, S.name AS status, G.created_at, G.expires_at, G.updated_at
      FROM game AS G
      INNER JOIN user AS U ON G.user_fk = U.id
      INNER JOIN status AS S ON G.status_fk = S.id
      ORDER BY G.id;
    END;`,  
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
    return { success: false, error };
  } finally {
    if (connection) {
      await connection.end();
      console.log('Database connection closed');
    }
  }
}

