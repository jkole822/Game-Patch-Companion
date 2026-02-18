import { z } from "zod";

export const NonNegativeInt = z.number().int().nonnegative();
