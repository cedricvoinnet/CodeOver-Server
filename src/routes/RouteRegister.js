import Route from "./Route";
import { dbPromise } from "../db.js"

export default class RouteRegister extends Route {
  constructor(params) {
    super({ ...params });
  }

  @Route.Post({
    path: "",
    params: {
      uname: true,
      password: true
    }
  })
  async add(ctx) {
    const body = this.body(ctx);
    const db = await dbPromise;

    try {
      let user = await db.run('INSERT INTO users(uname, password) VALUES (?,?)', [body.uname,body.password])
      return this.sendCreated(ctx, "Created.");
    } catch (e) {
      return this.sendUnauthorized(ctx, "Already exists.");
    }
  }
}
