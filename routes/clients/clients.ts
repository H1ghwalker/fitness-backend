import { Router } from "express";
import { getClients } from "./getClients";
import { getClientById } from "./getClientById";
import { createClient } from "./createClient";
import { updateClient } from "./updateClient";
import { deleteClient } from "./deleteClient";
import { upload } from "../../middleware/upload";

import { requireAuth, requireRole } from "../../middleware/auth";

const router = Router();

router.get("/",requireAuth, getClients);
router.get("/:id", getClientById);
router.post("/", requireAuth, requireRole("Trainer"), upload.single("profile"), createClient);
router.put("/:id", upload.single("profile"), updateClient);
router.delete("/:id", deleteClient);

export default router; // это и есть clientsRoutes
