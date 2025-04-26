// This file is part of the NestJS Authentication module
// It defines a custom decorator to mark routes as public, allowing them to be accessed without authentication.
import { SetMetadata } from "@nestjs/common";

export const IS_PUBLIC_KEY = "isPublic";
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);