import prismaClient from "../../prisma";

interface ConcludeRequest{
    order_id: String;
}

class ConcludeOrderService{
    async execute({ order_id }: ConcludeRequest){
        const order = await prismaClient.order.update({
            where:{
                id: `${order_id}`
            },
            data:{
                status: true
            }
        })

        return order;
    }
}

export { ConcludeOrderService }