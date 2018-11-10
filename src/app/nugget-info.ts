export interface INuggetInfo {
  id: string;
  code: string;
  created: firebase.firestore.Timestamp;
  playCount?: number;
}
