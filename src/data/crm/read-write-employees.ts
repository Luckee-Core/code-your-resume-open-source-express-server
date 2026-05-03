import { randomUUID } from "node:crypto";
import type { Employee } from "./types";
import { readJsonArray, writeJsonArray } from "./crm-json-io";

const FILE = "employees.json";

export const listEmployeesFromStore = async (): Promise<Employee[]> => {
  return readJsonArray<Employee>(FILE, []);
};

export const createEmployeeInStore = async (input: {
  companyId: string;
  name: string;
  role: string;
  email: string;
  linkedinUrl: string;
}): Promise<Employee> => {
  const rows = await listEmployeesFromStore();
  const now = new Date().toISOString();
  const row: Employee = {
    id: randomUUID(),
    companyId: input.companyId,
    name: input.name.trim(),
    role: input.role.trim(),
    email: input.email.trim(),
    linkedinUrl: input.linkedinUrl.trim(),
    createdAt: now,
    updatedAt: now,
  };
  rows.push(row);
  await writeJsonArray(FILE, rows);
  return row;
};

export const getEmployeeFromStore = async (id: string): Promise<Employee | null> => {
  const rows = await listEmployeesFromStore();
  return rows.find((r) => r.id === id) ?? null;
};

export const updateEmployeeInStore = async (
  id: string,
  patch: Partial<Pick<Employee, "companyId" | "name" | "role" | "email" | "linkedinUrl">>,
): Promise<Employee | null> => {
  const rows = await listEmployeesFromStore();
  const idx = rows.findIndex((r) => r.id === id);
  if (idx === -1) return null;
  const prev = rows[idx]!;
  const next: Employee = {
    ...prev,
    companyId: patch.companyId !== undefined ? patch.companyId : prev.companyId,
    name: patch.name !== undefined ? patch.name.trim() : prev.name,
    role: patch.role !== undefined ? patch.role.trim() : prev.role,
    email: patch.email !== undefined ? patch.email.trim() : prev.email,
    linkedinUrl: patch.linkedinUrl !== undefined ? patch.linkedinUrl.trim() : prev.linkedinUrl,
    updatedAt: new Date().toISOString(),
  };
  rows[idx] = next;
  await writeJsonArray(FILE, rows);
  return next;
};

export const deleteEmployeeFromStore = async (id: string): Promise<boolean> => {
  const rows = await listEmployeesFromStore();
  const next = rows.filter((r) => r.id !== id);
  if (next.length === rows.length) return false;
  await writeJsonArray(FILE, next);
  return true;
};
