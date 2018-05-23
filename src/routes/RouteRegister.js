import Route from "./Route";
import { db } from "../db.js";

export default class RouteRegister extends Route {
  constructor(params) {
    super({ ...params });
  }

  // post route: http://localhost:1212/register
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
    this.models.users.create(body);
    db.run(`INSERT INTO users(email, password) VALUES(?, ?)`, [body.email, body.password]);
    // body can contain only an object with email and password field
    this.sendCreated(ctx, body); // helper function which sets the status to 201 and return the parameter
  }
}
