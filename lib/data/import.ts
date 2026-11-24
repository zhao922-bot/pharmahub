import "server-only";

import { getDataContext } from "@/lib/db/context";
import { D1ImportRepository } from "@/lib/db/import-store";

export const importRepository = new D1ImportRepository(getDataContext);
