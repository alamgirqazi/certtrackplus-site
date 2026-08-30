/**
 * Illustrative data for the product panels on the marketing page.
 *
 * NOT a live feed and not a real customer's register — invented equipment on
 * invented certificate numbers. Every panel that renders this is labelled as a
 * sample view. Keep it that way: real tenant data must never be pasted in here.
 *
 * The shapes mirror the application's own — asset, certificate, issuing body,
 * expiry, derived status — so the page reads as the product rather than as an
 * illustration of it.
 */
import type { HorizonBucket, RegisterRow, Stat, StagedRow, TreeNode } from "@/components/data";

export const fleetStats: Stat[] = [
  { value: "142", label: "Valid", status: "valid" },
  { value: "18", label: "Due in 90 days", status: "due" },
  { value: "7", label: "Expired", status: "expired" },
  { value: "4", label: "Missing", status: "missing" },
];

export const registerRows: RegisterRow[] = [
  { asset: "Annular BOP 13-5/8″", cert: "CoC-88214", issuer: "Lloyd's Register", expiry: "14 Mar 2027", status: "valid" },
  { asset: "Ram BOP 13-5/8″ 10K", cert: "CoC-88097", issuer: "Bureau Veritas", expiry: "02 Nov 2026", status: "valid" },
  { asset: "Choke manifold", cert: "CoC-87740", issuer: "Lloyd's Register", expiry: "28 Sep 2026", status: "due" },
  { asset: "Drill line spooler", cert: "LEEA-40213", issuer: "TÜV Rheinland", expiry: "11 Aug 2026", status: "expired" },
  { asset: "Accumulator unit", cert: "CoC-88355", issuer: "DNV", expiry: "07 Jan 2027", status: "valid" },
  { asset: "Rotary hose 3″", cert: "—", issuer: "—", expiry: "—", status: "missing" },
];

export const expiryHorizon: HorizonBucket[] = [
  { window: "Already expired", count: 7, status: "expired" },
  { window: "Within 30 days", count: 6, status: "expired" },
  { window: "31 – 60 days", count: 5, status: "due" },
  { window: "61 – 90 days", count: 7, status: "due" },
  { window: "Beyond 90 days", count: 142, status: "valid" },
];

export const requirementTree: TreeNode[] = [
  {
    label: "Well control equipment",
    children: [
      { label: "Annular preventer", detail: "×1", status: "valid" },
      { label: "Ram preventer", detail: "×2", status: "valid" },
      { label: "Choke manifold", detail: "×1", status: "due" },
      { label: "Accumulator unit", detail: "×1", status: "valid" },
    ],
  },
  {
    label: "Lifting equipment",
    children: [
      { label: "Drill line spooler", detail: "×1", status: "expired" },
      { label: "Travelling block", detail: "×1", status: "valid" },
      { label: "Rotary hose 3″", detail: "×1", status: "missing" },
    ],
  },
];

export const stagedRows: StagedRow[] = [
  { serial: "SN-4471-A", category: "Ram preventer", issue: null },
  { serial: "SN-4472-A", category: "Ram preventer", issue: null },
  { serial: "SN-9903-C", category: "Choke manifold", issue: "Expiry date not recognised" },
  { serial: "SN-2210-B", category: "Accumulator unit", issue: null },
  { serial: "SN-7788-D", category: "—", issue: "Category not matched" },
];

export const fleetUnits = [
  { label: "RIG-114", present: 41, required: 41 },
  { label: "RIG-207", present: 38, required: 41 },
  { label: "WOU-052", present: 27, required: 33 },
  { label: "WOU-061", present: 33, required: 33 },
];
