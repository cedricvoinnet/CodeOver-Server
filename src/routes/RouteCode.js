import Route from "./Route";
import { dbPromise, userExists } from "../db.js"

export default class RouteCode extends Route {
  constructor(params) {
    super({ ...params });
  }

  @Route.Post({
    path: "",
    params: {
      code: true,
      room_id: true
    }
  })
  async addCode(ctx) {
    const body = this.body(ctx);

    let uname = ctx.request.header.uname;
    let password = ctx.request.header.password;
    if (!await userExists(uname, password))
      return this.sendUnauthorized(ctx, "Doesn't exist");

    const db = await dbPromise;
    let code;
    try {
      let tmp = await db.get('SELECT * FROM codes WHERE room_id = ? AND uname = ?', [body.room_id, uname]);

      if (tmp) {
        code = await db.run('UPDATE codes SET code = ? WHERE uname = ?', [body.code, uname])
      } else {
        code = await db.run('INSERT INTO codes(uname, code, room_id) VALUES (?,?,?)', [uname, body.code, body.room_id])
      }
      if (code.changes) {
        return this.sendOk(ctx, "Ok");
      } else {
        return this.sendBadRequest(ctx, "error");
      }
    } catch (e) {
      return this.sendBadRequest(ctx, "error");
    }
  }

  @Route.Get({
    path: '/:roomid'
  })
  async getCode(ctx) {
    let uname = ctx.request.header.uname;
    let password = ctx.request.header.password;
    if (!await userExists(uname, password))
      return this.sendUnauthorized(ctx, "Doesn't exist");

    const roomId = ctx.params.roomid;
    const db = await dbPromise;

    try {
      let codes = await db.all('SELECT uname, code FROM codes WHERE room_id = ?', roomId);
      if (codes) {
        return this.sendOk(ctx, codes);
      } else {
        return this.sendBadRequest(ctx, "error");
      }
    } catch (e) {
      return this.sendBadRequest(ctx, "error");
    }
  }
}
