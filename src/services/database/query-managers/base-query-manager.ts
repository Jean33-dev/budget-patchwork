
import { QueryManager } from '../query-manager';

export abstract class BaseQueryManager {
  protected parent: QueryManager;

  constructor(parent: QueryManager) {
    this.parent = parent;
  }

  protected async ensureParentInitialized(): Promise<boolean> {
    return this.parent.ensureInitialized();
  }

  protected getDb(): any {
    return this.parent.getDb();
  }
}
