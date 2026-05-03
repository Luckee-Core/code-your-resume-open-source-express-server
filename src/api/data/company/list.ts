import type { Request, Response } from "express";
import { listCompaniesFromStore } from "../../../data/crm/read-write-companies";

export const handleCompanyList = async (_req: Request, res: Response): Promise<void> => {
  try {
    const data = await listCompaniesFromStore();
    res.status(200).json({ success: true, data });
  } catch {
    res.status(500).json({ success: false, error: "Failed to list companies" });
  }
};
