import type { CompareGroup } from "@/lib/types";
import { COMPARE_GROUPS } from "@/lib/data/compares";

/**
 * 对比数据访问层。
 *
 * 与卡片数据一样，接口是异步的，为将来迁移到数据库留好空间。
 * 这里不做任何过滤或排序——分组数量少（个位数），全部返回即可。
 */
export interface CompareRepository {
  getAll(): Promise<CompareGroup[]>;
  getById(id: string): Promise<CompareGroup | null>;
  /** 某个卡片参与的所有对比分组，用于在卡片详情页显示「查看对比」入口 */
  getByDrugId(drugId: string): Promise<CompareGroup[]>;
}

class LocalCompareRepository implements CompareRepository {
  async getAll(): Promise<CompareGroup[]> {
    return [...COMPARE_GROUPS];
  }

  async getById(id: string): Promise<CompareGroup | null> {
    return COMPARE_GROUPS.find((group) => group.id === id) ?? null;
  }

  async getByDrugId(drugId: string): Promise<CompareGroup[]> {
    return COMPARE_GROUPS.filter((group) => group.drugIds.includes(drugId));
  }
}

export const compareRepository: CompareRepository = new LocalCompareRepository();
