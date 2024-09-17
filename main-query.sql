USE Usable;

CREATE SCHEMA Pastries;

CREATE TABLE Pastries.Main(
	id tinyint primary key IDENTITY(0, 1),
	nome varchar(30) NOT NULL,
	imagepath varchar(40) NOT NULL,
);

SELECT id FROM Pastries.Main;

DROP TABLE Pastries.Main;