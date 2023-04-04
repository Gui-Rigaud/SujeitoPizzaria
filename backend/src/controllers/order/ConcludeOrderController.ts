import { Request, Response } from "express";
import { ConcludeOrderService } from "../../services/order/ConcludeOrderService";

class ConcludeOrderController{
    async handle(req: Request, res: Response){
        const { order_id } = req.body;

        const concludeOrder = new ConcludeOrderService();

        const order = await concludeOrder.execute({ order_id });

        return res.json(order);
    }
}

export { ConcludeOrderController }