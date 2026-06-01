

export const registerOrganization=async(
    db:D1Database,
    data:{
        organization_id:string
        name:string;
        email:string,
        phone_no:string
    }
)=>{
   const existing = await db 
    .prepare("SELECT * FROM organizations WHERE organization_id = ?")
    .bind(data.organization_id)
    .first<any>();

    if(existing){
            throw new Error("organization_id already registered");

    }

    await db
    .prepare(
      `INSERT INTO organizations (organization_id, name, email, phone_no)
       VALUES (?, ?, ?, ?)`
    )
    .bind(
      data.organization_id,
      data.name,
      data.email,
      data.phone_no
    )
    .run();

    return {message:"organization registered successfully"};
}
export const getOrganization=async(
    db:D1Database,
    organization_id:string
)=>{
    const organization = await db
    .prepare("SELECT * FROM organizations WHERE organization_id = ?")
    .bind(organization_id)
    .first<any>();
    return organization;
}
