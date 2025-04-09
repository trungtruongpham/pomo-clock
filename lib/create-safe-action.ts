import { z } from "zod";

type ActionResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
};

export function createSafeAction<TInput extends z.ZodType, TOutput>(
  schema: TInput,
  handler: (input: z.infer<TInput>) => Promise<ActionResponse<TOutput>>
) {
  return async (input: z.infer<TInput>) => {
    try {
      const validatedInput = schema.parse(input);
      return await handler(validatedInput);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          message: error.errors[0].message,
        };
      }
      return {
        success: false,
        message: "An unexpected error occurred",
      };
    }
  };
}
