import { Router } from "express";
import proxyRequest from "./request";
const router = Router();

router.get('/*', async (req, res) => await proxyRequest(req, res));
router.post('/*', async (req, res) => await proxyRequest(req, res));
router.put('/*', async (req, res) => await proxyRequest(req, res));
router.patch('/*', async (req, res) => await proxyRequest(req, res));
router.delete('/*', async (req, res) => await proxyRequest(req, res));

export default router