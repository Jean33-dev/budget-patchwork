
import { BaseService } from '../base-service';
import { DatabaseInitManager } from '../../database-init-manager';

/**
 * Base service class for expense operations
 */
export class ExpenseBaseService extends BaseService {
  /**
   * Ensures the database is initialized before operations
   */
  protected async ensureDatabase(): Promise<boolean> {
    if (!await this.ensureInitialized()) {
      console.log("ExpenseBaseService: Database not initialized");
      return false;
    }
    
    const adapter = this.initManager.getAdapter();
    if (!adapter) {
      console.log("ExpenseBaseService: Database adapter not available");
      return false;
    }
    
    return true;
  }
}
