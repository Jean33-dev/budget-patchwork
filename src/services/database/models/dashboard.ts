
/**
 * Represents a dashboard in the application
 */
export interface Dashboard {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  // Autres métadonnées potentielles
  description?: string;
  icon?: string;
  color?: string;
}
