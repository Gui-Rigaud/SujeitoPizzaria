import prismaClient from "../../prisma";

interface ItemRequest{
    order_id: String;
    product_id: String;
    amount: number;
}

class AddItemService{
    async execute({ order_id, product_id, amount }: ItemRequest){

        const order = await prismaClient.item.create({
            data:{
                order_id: `${order_id}`,
                product_id: `${product_id}`,
                amount: amount
            }
        })

        return order;
    }
}

export { AddItemService }