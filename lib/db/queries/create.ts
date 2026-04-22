import { asc, eq } from "drizzle-orm";
import db from "@/lib/db";
import { client, company } from "@/lib/db/schema";

export async function getCompanyAndClients(userId: string) {
  const [companyRow] = await db
    .select()
    .from(company)
    .where(eq(company.userId, userId));

  const clients = await db
    .select()
    .from(client)
    .where(eq(client.userId, userId))
    .orderBy(asc(client.name));

  return { company: companyRow ?? null, clients };
}
