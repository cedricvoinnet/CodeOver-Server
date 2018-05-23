import Route from "./Route";
import { db } from "../db.js"

export default class RouteLogin extends Route {
  constructor(params) {
    super({ ...params });
  }

  // post route: http://localhost:3000/login
  @Route.Post({
    path: "",
    params: {
      // params to allow: all other params will be rejected
      email: true, // return a 400 if the body doesn't contain email key
      password: true // password is optional
    }
  })
  async add(ctx) {
    const body = this.body(ctx); // or ctx.request.body
//    console.log(ctx.body);
    db.get(`SELECT email FROM users WHERE email = ? AND password = ?`, [body.email, body.password], (err, row) => {
      if (err) {
        // this.sendUnauthorized(ctx, body);
      }
      if (row) {
      //   this.sendOk(ctx, body);
      } else {
      //   this.sendUnauthorized(ctx, body);
      }
    });
    this.sendOk(ctx, body);
  }
}
