// src/routes/webhookRoutes.ts
import express from "express";
import { WebhookController } from "../controllers/webhookController";

const webhookRoutes = express.Router();
const webhookController = new WebhookController();

// Stripe requires raw body parsing — use this in your main app file!
// webhookRoutes.post("/stripe", webhookController.stripeWebhook.bind(webhookController));
webhookRoutes.post("/stripe", (req, res, next) => {
  console.log("🎯 Webhook route hit");
  next();
}, webhookController.stripeWebhook.bind(webhookController));

export default webhookRoutes;
