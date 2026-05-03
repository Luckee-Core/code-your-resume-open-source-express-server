import type { Request, Response } from "express";
import { listEmployeesFromStore } from "../../../data/crm/read-write-employees";

export const handleEmployeeList = async (_req: Request, res: Response): Promise<void> => {
  try {
    const data = await listEmployeesFromStore();
    res.status(200).json({ success: true, data });
  } catch {
    res.status(500).json({ success: false, error: "Failed to list employees" });
  }
};
