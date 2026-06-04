import type { Request, Response } from "express";
import { updateEmployeeInStore } from "../../../data/crm";
import type { Employee } from "../../../data/crm/types";

type Body = {
  id?: unknown;
  companyId?: unknown;
  name?: unknown;
  role?: unknown;
  email?: unknown;
  linkedinUrl?: unknown;
};

export const handleEmployeeUpdate = async (req: Request, res: Response): Promise<void> => {
  try {
    const body = req.body as Body;
    const id = typeof body.id === "string" ? body.id : "";
    if (!id) {
      res.status(400).json({ success: false, error: "id is required" });
      return;
    }
    const patch: Partial<Pick<Employee, "companyId" | "name" | "role" | "email" | "linkedinUrl">> = {};
    if (typeof body.companyId === "string") patch.companyId = body.companyId;
    if (typeof body.name === "string") patch.name = body.name;
    if (typeof body.role === "string") patch.role = body.role;
    if (typeof body.email === "string") patch.email = body.email;
    if (typeof body.linkedinUrl === "string") patch.linkedinUrl = body.linkedinUrl;
    const data = await updateEmployeeInStore(id, patch);
    if (!data) {
      res.status(404).json({ success: false, error: "Not found" });
      return;
    }
    res.status(200).json({ success: true, data });
  } catch {
    res.status(500).json({ success: false, error: "Failed to update employee" });
  }
};
