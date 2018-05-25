import sqlite from 'sqlite';

const dbPromise = sqlite.open('./db.sqlite', {Promise});

async function test() {
  const db = await dbPromise;
  console.log(await db.all('SELECT * FROM users;'));
  console.log(await db.all('SELECT * FROM rooms;'));
  console.log(await db.all('SELECT * FROM codes;'));

}

async function createTables() {
  const db = await dbPromise;
  await db.run("CREATE TABLE if not exists users (user_id INTEGER PRIMARY KEY AUTOINCREMENT, uname TEXT NOT NULL, password TEXT NOT NULL, CONSTRAINT uname_unique UNIQUE (uname));");
  await db.run("CREATE TABLE if not exists rooms (room_id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, description TEXT NOT NULL, language TEXT NOT NULL, author TEXT NOT NULL);");
  await db.run("CREATE TABLE if not exists codes (code_id INTEGER PRIMARY KEY AUTOINCREMENT, uname TEXT NOT NULL, code TEXT NOT NULL, room_id integer NOT NULL, FOREIGN KEY (room_id) REFERENCES rooms(room_id), CONSTRAINT uname_unique UNIQUE (uname));");
  // test()
  return db;
}

async function userExists(uname, password) {
  try {
    const db = await dbPromise;

    let user = await db.get('SELECT uname FROM users WHERE uname = ? AND password = ?', [uname,password])
    if (user) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    return false;
  }
}

createTables();

export {dbPromise, userExists};
