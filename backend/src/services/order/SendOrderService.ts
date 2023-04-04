import prismaClient from "../../prisma";

interface OrderResquest{
    order_id: String;
}

class SendOrderService{
    async execute({ order_id }: OrderResquest){
        const order = await prismaClient.order.update({
            where:{
                id: `${order_id}`
            },
            data:{
                draft: false
            }
        })

        return order
    }
}

export { SendOrderService }