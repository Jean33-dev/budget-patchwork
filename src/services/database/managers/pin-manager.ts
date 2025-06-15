
export class PinManager {
  private db: any = null;
  private initialized = false;

  setDb(db: any) {
    this.db = db;
    this.initialized = !!db;
  }
  setInitialized(val: boolean) {
    this.initialized = val;
  }

  async ensureTable(): Promise<void> {
    if (!this.db) return;
    // La table n'a qu'une seule ligne, id=1, pin_code, locked
    await this.db.run(`
      CREATE TABLE IF NOT EXISTS pin (
        id INTEGER PRIMARY KEY CHECK(id = 1),
        pin_code TEXT,
        locked INTEGER DEFAULT 0
      )
    `);
  }

  async setPin(pin: string) {
    await this.ensureTable();
    // On utilise REPLACE pour écraser une ligne existante ou l’insérer si vide
    await this.db.run(
      `INSERT OR REPLACE INTO pin (id, pin_code, locked) VALUES (1, ?, 0)`,
      [pin]
    );
  }
  async clearPin() {
    await this.ensureTable();
    await this.db.run(`DELETE FROM pin WHERE id = 1`);
  }
  async lockApp() {
    await this.ensureTable();
    await this.db.run(
      `UPDATE pin SET locked = 1 WHERE id = 1`
    );
  }
  async unlockApp() {
    await this.ensureTable();
    await this.db.run(
      `UPDATE pin SET locked = 0 WHERE id = 1`
    );
  }
  async isLocked(): Promise<boolean> {
    await this.ensureTable();
    const res = await this.db.query(`SELECT locked FROM pin WHERE id = 1`);
    if (res && res[0]) {
      return !!res[0].locked;
    }
    return false;
  }
  async hasPin(): Promise<boolean> {
    await this.ensureTable();
    const res = await this.db.query(`SELECT pin_code FROM pin WHERE id = 1`);
    return !!(res && res[0] && res[0].pin_code);
  }
  async verifyPin(input: string): Promise<boolean> {
    await this.ensureTable();
    const res = await this.db.query(`SELECT pin_code FROM pin WHERE id = 1`);
    if (!res || !res[0]) return false;
    return input === res[0].pin_code;
  }
}
