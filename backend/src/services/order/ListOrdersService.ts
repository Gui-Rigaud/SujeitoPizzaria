import prismaClient from "../../prisma";

class ListOrdersService{
    async execute(){

        const orders = await prismaClient.order.findMany({
            where:{
                draft: false,
                status: false,
            },
            orderBy:{
                crated_at: 'desc'
            }
        })

        return orders;
    }
}

export { ListOrdersService }