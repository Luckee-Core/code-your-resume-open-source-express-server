import type { Request, Response } from "express";
import { listEmployeesFromStore } from "../../../data/crm/read-write-employees";

export const handleEmployeeList = async (_req: Request, res: Response): Promise<void> => {
  try {
    const data = await listEmployeesFromStore();
    res.status(200).json({ success: true, data });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to list employees";
    console.error("❌ handleEmployeeList:", msg);
    res.status(500).json({ success: false, error: msg });
  }
};
