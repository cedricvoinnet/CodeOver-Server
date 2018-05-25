import Route from "./Route";
import { dbPromise, userExists } from "../db.js"

export default class RouteRoom extends Route {
  constructor(params) {
    super({ ...params });
  }

  @Route.Post({
    path: "",
    params: {
      name: true,
      description: true,
      language: true,
      author: true
    }
  })
  async createRoom(ctx) {
    const body = this.body(ctx);

    let uname = ctx.request.header.uname;
    let password = ctx.request.header.password;
    if (!await userExists(uname, password))
      return this.sendUnauthorized(ctx, "Doesn't exist");

    const db = await dbPromise;
    try {
      let room = await db.run('INSERT INTO rooms(name, description, language, author) VALUES (?,?,?,?)', [body.name,body.description,body.language, body.author])
      if (room.changes) {
        return this.sendCreated(ctx, "Created");
      } else {
        return this.sendBadRequest(ctx, "error");
      }
    } catch (e) {
      console.log(e);
    }
  }

  @Route.Get({
    path: '/'
  })
  async getAllRooms(ctx) {
    let uname = ctx.request.header.uname;
    let password = ctx.request.header.password;
    if (!await userExists(uname, password))
      return this.sendUnauthorized(ctx, "Doesn't exist");

    const db = await dbPromise;

    try {
      let rooms = await db.all('SELECT * FROM rooms');
      if (rooms) {
        console.log(rooms);
        return this.sendOk(ctx, rooms);
      } else {
        return this.sendBadRequest(ctx, "error");
      }
    } catch (e) {
      return this.sendBadRequest(ctx, "error");
    }
  }

  @Route.Get({
    path: '/:id'
  })
  async getRoom(ctx) {
    let uname = ctx.request.header.uname;
    let password = ctx.request.header.password;
    if (!await userExists(uname, password))
      return this.sendUnauthorized(ctx, "Doesn't exist");

    const roomId = ctx.params.id;
    const db = await dbPromise;

    try {
      let room = await db.get('SELECT * FROM rooms WHERE room_id = ?', roomId);
      if (room) {
        return this.sendOk(ctx, room);
      } else {
        return this.sendBadRequest(ctx, "error");
      }
    } catch (e) {
      return this.sendBadRequest(ctx, "error");
    }
  }
}
