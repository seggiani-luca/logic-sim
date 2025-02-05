-- inizializza il database
drop database if exists seggiani_672343;
create database seggiani_672343;
use seggiani_672343;

-- circuiti
create table circuits (
	id char(8) primary key,
	circuit json not null
);

-- utenti
create table users (
	username varchar(255) primary key,
	password varchar(255) not null
)
