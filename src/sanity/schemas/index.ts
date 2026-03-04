import { pricingTiers } from "./pricingTiers";
import { bagSizes } from "./bagSizes";
import { bagColours } from "./bagColours";
import { grindOptions } from "./grindOptions";
import { roastProfiles } from "./roastProfiles";
import { blogPost } from "./blogPost";
import { caseStudy } from "./caseStudy";
import { wholesaleEnquiry } from "./wholesaleEnquiry";
import { siteSettings } from "./siteSettings";
import { builderSettings } from "./builderSettings";
import { faq } from "./faq";
import { labelTemplate } from "./labelTemplate";
import { svgElement } from "./svgElement";
import { roasterFeature } from "./roasterFeature";
import { roastersPageSettings } from "./roastersPageSettings";

export const schemaTypes = [
  // Content
  blogPost,
  caseStudy,
  faq,

  // Product configuration
  bagSizes,
  bagColours,
  grindOptions,
  roastProfiles,
  pricingTiers,

  // Label maker
  labelTemplate,
  svgElement,

  // Business
  wholesaleEnquiry,

  // Roasters site
  roasterFeature,
  roastersPageSettings,

  // Settings
  siteSettings,
  builderSettings,
];
