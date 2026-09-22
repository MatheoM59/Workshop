-- phpMyAdmin SQL Dump
-- version 5.2.2deb1+deb13u1
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost:3306
-- Généré le : mar. 22 sep. 2026 à 08:52
-- Version du serveur : 11.8.6-MariaDB-0+deb13u1 from Debian
-- Version de PHP : 8.4.24

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `astrotrace`
--

-- --------------------------------------------------------

--
-- Structure de la table `gates`
--

CREATE TABLE `gates` (
  `id` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `sector` varchar(50) NOT NULL,
  `sector_from` varchar(50) NOT NULL,
  `is_locked` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `gates`
--

INSERT INTO `gates` (`id`, `name`, `sector`, `sector_from`, `sector_to`, `is_locked`) VALUES
('GATE_A1', 'Porte Passerelle', 'Secteur A', '', 0),
('GATE_B2', 'Porte Mess / Vie', 'Secteur B', '', , 0),
('GATE_C1', 'Porte Serre Hydroponique', 'Secteur C', '', 0),
('GATE_MED', 'Porte MedBox', 'Secteur Médical', '', 0);

-- --------------------------------------------------------

--
-- Structure de la table `gate_logs`
--

CREATE TABLE `gate_logs` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `gate_id` varchar(50) NOT NULL,
  `direction` enum('IN','OUT') NOT NULL DEFAULT 'IN',
  `passed_at` timestamp NULL DEFAULT current_timestamp(),
  `access_granted` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `quarantine_assignments`
--

CREATE TABLE `quarantine_assignments` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `zone_id` varchar(50) NOT NULL,
  `assigned_at` timestamp NULL DEFAULT current_timestamp(),
  `status` enum('ACTIVE','RELEASED') DEFAULT 'ACTIVE'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `quarantine_zones`
--

CREATE TABLE `quarantine_zones` (
  `id` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `sector` varchar(50) NOT NULL,
  `capacity` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `quarantine_zones`
--

INSERT INTO `quarantine_zones` (`id`, `name`, `sector`, `capacity`) VALUES
('ISO_HAB_01', 'Module d Habitation Confiné', 'Secteur B', 2),
('MED_BAY_01', 'Unité d Isolation Médical 1', 'Secteur Médical', 1),
('MED_BAY_02', 'Unité d Isolation Médical 2', 'Secteur Médical', 1);

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `firstname` varchar(50) NOT NULL,
  `lastname` varchar(50) NOT NULL,
  `role` varchar(50) NOT NULL,
  `health_status` enum('NORMAL','CONTACT','SICK','QUARANTINE') DEFAULT 'NORMAL',
  `disease_name` varchar(100) DEFAULT NULL,
  `crit_score` decimal(3,2) DEFAULT NULL,
  `room_id` int(11) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `firstname`, `lastname`, `role`, `health_status`, `disease_name`, `crit_score`, `room_id`, `updated_at`) VALUES
(1, 'John', 'Doe', 'Commandant', 'NORMAL', NULL, NULL, 1, '2026-09-22 08:20:11'),
(2, 'Elena', 'Rostova', 'Ingénieure', 'NORMAL', NULL, NULL, 2, '2026-09-22 08:20:11'),
(3, 'Romain', 'Blauwblomme', 'Pilote', 'NORMAL', NULL, NULL, 10, '2026-09-22 08:20:11'),
(4, 'Sarah', 'Connor', 'Médecin', 'NORMAL', NULL, NULL, 15, '2026-09-22 08:20:11');

-- --------------------------------------------------------

--
-- Structure de la table `vitals_history`
--

CREATE TABLE `vitals_history` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `gate_id` varchar(50) NOT NULL,
  `heart_rate` int(11) NOT NULL,
  `spo2` int(11) NOT NULL,
  `temperature` decimal(4,1) NOT NULL,
  `recorded_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `gates`
--
ALTER TABLE `gates`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `gate_logs`
--
ALTER TABLE `gate_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `gate_id` (`gate_id`);

--
-- Index pour la table `quarantine_assignments`
--
ALTER TABLE `quarantine_assignments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `zone_id` (`zone_id`);

--
-- Index pour la table `quarantine_zones`
--
ALTER TABLE `quarantine_zones`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `vitals_history`
--
ALTER TABLE `vitals_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `gate_id` (`gate_id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `gate_logs`
--
ALTER TABLE `gate_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `quarantine_assignments`
--
ALTER TABLE `quarantine_assignments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `vitals_history`
--
ALTER TABLE `vitals_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `gate_logs`
--
ALTER TABLE `gate_logs`
  ADD CONSTRAINT `gate_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `gate_logs_ibfk_2` FOREIGN KEY (`gate_id`) REFERENCES `gates` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `quarantine_assignments`
--
ALTER TABLE `quarantine_assignments`
  ADD CONSTRAINT `quarantine_assignments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `quarantine_assignments_ibfk_2` FOREIGN KEY (`zone_id`) REFERENCES `quarantine_zones` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `vitals_history`
--
ALTER TABLE `vitals_history`
  ADD CONSTRAINT `vitals_history_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `vitals_history_ibfk_2` FOREIGN KEY (`gate_id`) REFERENCES `gates` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
