export interface IRoutes {

  /** Apply the routes to the express server */
  applyRoutes(app, controller): void
}
