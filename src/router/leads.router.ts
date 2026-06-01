import { Hono } from "hono";
import { authMiddleware } from "../middlerware/auth";
import { listLeads, getLead, addLead, editLead, removeLead } from "../controller/leads.controller";
import { Env } from "../types";

const leadsRouter = new Hono<{ Bindings: Env }>();

leadsRouter.use("*", authMiddleware);

leadsRouter.get("/", listLeads);
leadsRouter.get("/:id", getLead);
leadsRouter.post("/", addLead);
leadsRouter.patch("/:id", editLead);
leadsRouter.delete("/:id", removeLead);

export default leadsRouter;
