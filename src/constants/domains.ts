import type { RadarDomain } from "../types/book";
import type { DomainMeta } from "../types/radar";

export const DOMAIN_COLOR_MAP: Record<RadarDomain, string> = {
  "AI 工程": "#4a7bb0",
  产品方法论: "#bf6b77",
  "Agent 设计": "#518f8a",
  组织变革: "#9678a6",
  数据智能: "#869e6b",
  商业落地: "#c6965d",
  伦理治理: "#945d7a",
  前沿趋势: "#6b70ad",
};

export const DOMAIN_METAS: DomainMeta[] = (
  Object.entries(DOMAIN_COLOR_MAP) as [RadarDomain, string][]
).map(([name, color]) => ({ name, color }));

export function getDomainColor(domain: RadarDomain | string): string {
  return DOMAIN_COLOR_MAP[domain as RadarDomain] ?? "#4a7bb0";
}

/** 领域色 12.5% 透明度背景（INTERACTION_SPEC filter chip 激活态） */
export function getDomainSoftBackground(domain: RadarDomain | string): string {
  return `${getDomainColor(domain)}20`;
}
