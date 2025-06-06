
export interface ItutorRepository {
  saveTutorApplication(documentUrls: string[]): Promise<any>;
}
