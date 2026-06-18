import { Request, Response } from "express";
import * as applicationService from "./service.js";
import { sendSuccess } from "../../utils/response.js";
import type { ApplicationQuery } from "./schema.js";

export async function list(req: Request, res: Response) {
  const query = req.query as unknown as ApplicationQuery;
  const result = await applicationService.listApplications(query);
  sendSuccess(res, result);
}

export async function getById(req: Request, res: Response) {
  const id = Number(req.params.id);
  const application = await applicationService.getApplication(id);
  sendSuccess(res, application);
}

export async function create(req: Request, res: Response) {
  const application = await applicationService.createApplication(req.body);
  sendSuccess(res, application, 201);
}

export async function update(req: Request, res: Response) {
  const id = Number(req.params.id);
  const application = await applicationService.updateApplication(id, req.body);
  sendSuccess(res, application);
}

export async function remove(req: Request, res: Response) {
  const id = Number(req.params.id);
  await applicationService.deleteApplication(id);
  sendSuccess(res, { message: "Application deleted successfully" });
}
