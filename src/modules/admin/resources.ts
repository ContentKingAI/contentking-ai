import { generationsResource } from "@/modules/admin/generations/resource";
import { subscriptionsResource } from "@/modules/admin/subscriptions/resource";
import { templatesResource } from "@/modules/admin/templates/resource";
import { usersResource } from "@/modules/admin/users/resource";

export const adminResources = [
  usersResource,
  subscriptionsResource,
  generationsResource,
  templatesResource
];
