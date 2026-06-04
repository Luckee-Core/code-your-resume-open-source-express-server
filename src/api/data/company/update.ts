import type { Request, Response } from "express";
import { updateCompanyInStore } from "../../../data/crm";
import type { Company } from "../../../data/crm/types";

type Body = { id?: unknown; name?: unknown; website?: unknown; notes?: unknown };

export const handleCompanyUpdate = async (req: Request, res: Response): Promise<void> => {
  try {
    const body = req.body as Body;
    const id = typeof body.id === "string" ? body.id : "";
    if (!id) {
      res.status(400).json({ success: false, error: "id is required" });
      return;
    }
    const patch: Partial<Pick<Company, "name" | "website" | "notes">> = {};
    if (typeof body.name === "string") patch.name = body.name;
    if (typeof body.website === "string") patch.website = body.website;
    if (typeof body.notes === "string") patch.notes = body.notes;
    const data = await updateCompanyInStore(id, patch);
    if (!data) {
      res.status(404).json({ success: false, error: "Not found" });
      return;
    }
    res.status(200).json({ success: true, data });
  } catch {
    res.status(500).json({ success: false, error: "Failed to update company" });
  }
};
