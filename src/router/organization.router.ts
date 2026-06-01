import { Hono } from "hono";
import { Env } from "../types";
import { getOrganizationdata, organization } from "../controller/organization.controller";

const orgrouter= new Hono<{Bindings:Env}>();
orgrouter.post("/org",organization)
orgrouter.get("/org/:id", getOrganizationdata)
export default orgrouter;
