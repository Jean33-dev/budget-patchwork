
import { BaseService } from '../base-service';
import { InitializationManager } from '../../initialization-manager';

/**
 * Base service class for expense operations
 */
export class ExpenseBaseService extends BaseService {
  /**
   * Setter for initialization manager - needed for inheritance
   */
  set initManager(manager: InitializationManager) {
    this._initManager = manager;
  }

  /**
   * Getter for initialization manager - needed for inheritance
   */
  get initManager(): InitializationManager {
    return this._initManager;
  }

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
