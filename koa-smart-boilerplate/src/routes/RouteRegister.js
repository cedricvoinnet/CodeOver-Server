import Route from "./Route";

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
    // body can contain only an object with email and password field
    this.sendCreated(ctx, body); // helper function which sets the status to 201 and return the parameter
  }
}
