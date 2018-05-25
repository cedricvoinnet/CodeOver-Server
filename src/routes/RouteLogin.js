import Route from "./Route";
import { dbPromise, userExists } from "../db.js"

export default class RouteLogin extends Route {
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

    return await userExists(body.uname, body.password) ? this.sendOk(ctx, "Ok") : this.sendUnauthorized(ctx, "Doesn't exist");
  }
}
