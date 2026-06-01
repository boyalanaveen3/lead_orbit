import { Context } from "hono";
import { Env } from "../types";
import { getOrganization, registerOrganization } from "../services/organization";

export const organization=async (c:Context<{Bindings:Env}>)=>{
try{
    const data=await c.req.json();
    const result =await registerOrganization(c.env.DB,c.env.JWT_SECRET,data);
    return c.json(result,201);

}catch(error){
    console.error("Error creating organization:", error);
    return c.json({ error: "Failed to create organization" }, 500);
}
}
export const getOrganizationdata =async(c:Context<{Bindings:Env}>)=>{
try{
 const data=await c.req.json();
    const result =await getOrganization(c.env.DB,c.env.JWT_SECRET,data);
    return c.json(result,201);
}catch(error){
    console.error("get organization:", error);
    return c.json({ error: "Failed to get organization" }, 500);

}
}