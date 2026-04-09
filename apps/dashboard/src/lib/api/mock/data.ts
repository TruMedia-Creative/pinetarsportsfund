import type { Tenant } from "../../../features/tenants/model";
import { defaultTemplates } from "../../../features/templates/model";
import type { SlideTemplate } from "../../../features/templates/model";

export const mockTenants: Tenant[] = [
  {
    id: "t-1",
    slug: "pinetarsportsfund",
    name: "Pine Tar Sports Fund",
    domain: "pinetarsportsfund.com",
    branding: {
      logoUrl: "https://placehold.co/200x60?text=Pine+Tar+Sports+Fund",
      primaryColor: "#166534",
      fontFamily: "Inter",
    },
  },
];

export const mockTemplates: SlideTemplate[] = defaultTemplates;
