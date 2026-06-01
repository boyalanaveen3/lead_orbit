import { Env, Hono } from "hono";
import { organization } from "../controller/organization.controller";

const orgrouter= new Hono<{Bindings:Env}>();
orgrouter.post("/org",organization)
orgrouter.get("/org/:id", organization)
export default orgrouter;