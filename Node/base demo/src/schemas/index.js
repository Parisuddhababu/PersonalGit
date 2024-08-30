import { mergeTypeDefs } from "@graphql-tools/merge";
import { bannerTypeDefs } from "../modules/banner/banner.schema.js";
import { userTypeDefs } from "../modules/user/user.schema.js";
import {SubAdminTypeDefs} from "../modules/subAdmin/subAdmin.schema.js";

export const typeDefs = mergeTypeDefs([
    bannerTypeDefs,
    userTypeDefs,
    SubAdminTypeDefs,
]);