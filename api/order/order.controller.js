import { logger } from "../../services/logger.service.js"
import { orderService } from "./order.service.js"

export async function getOrdersById(req, res) {
    try {
        const filter = JSON.parse(req.query.params)
        let orders
        if (filter.buyer) {
            orders = await orderService.buyerQuery(filter)
        } else {
            orders = await orderService.sellerQuery(filter)
        }
        res.json(orders)
    } catch (err) {
        logger.error("Failed to get orders", err)
        res.status(500).send({ err: "Failed to get orders" })
    }
}

export async function addOrder(req, res) {
    try {
        const order = req.body
        const addedOrder = await orderService.add(order)
        res.json(addedOrder)
    } catch (err) {
        logger.error("order.controller: Failed to add orders", err)
        res.status(500).send({ err: "Failed to add orders" })
    }
}

export async function updateStatus(req, res) {
    try {
        const gigId = req.params.id
        const status = req.body
        const updatedOrder = await orderService.updateStatus(gigId, status.status)
        res.json(updatedOrder)
    } catch (err) {
        logger.error("Failed to update order status", err)
        res.status(500).send({ err: "Failed to update order status" })
    }
}