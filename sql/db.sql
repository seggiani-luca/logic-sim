-- inizializza il database
drop database if exists seggiani_672343;
create database seggiani_672343;
use seggiani_672343;

-- circuiti
create table circuits (
	user varchar(255),
	name varchar(255), 
	circuit json not null,
	primary key (user, name)
);

-- utenti
create table users (
	username varchar(255) primary key,
	password varchar(255) not null
)
