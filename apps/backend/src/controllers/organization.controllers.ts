import {prisma} from "db/client"
import type { Request,Response } from "express"

export const createOrganization=async(
    req:Request,res:Response
)=>
{
try{
    const {name,description}=req.body;

    if(!name)
    {
        return res.status(400).json({
            message:"Organization name is required"
        });

    }

    const organization=await prisma.organization.create({
        data:{
            name,
            description,
            memberships:{
                create:{
                    userId:req.userId!,
                    role:"ADMIN"
                }
            }
        }
    });

    return res.status(201).json({
        message:"Organization created successfull",
        organization
    });
}
catch(error)
{
    console.error(error);

    return res.status(500).json({
        message:"Internal server error"
    });


}
}

export const getMyOrganizations = async (
    req: Request,
    res: Response
) => {
    try {
        const organizations = await prisma.organization.findMany({
            where: {
                memberships: {
                    some: {
                        userId: req.userId!
                    }
                }
            }
        });

        return res.status(200).json({
            organizations
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};