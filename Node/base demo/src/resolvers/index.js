import { mergeResolvers } from "@graphql-tools/merge";
import { UserResolvers } from "../modules/user/user.resolvers.js";
import { BannerResolvers } from "../modules/banner/banner.resolvers.js";
import {subAdminResolvers} from "../modules/subAdmin/subAdmin.resolvers.js";

export const resolvers = mergeResolvers([
    UserResolvers,
    BannerResolvers,
    subAdminResolvers
]);