export interface Music {
  id: string;
  title: string;
  artist: string;
  description: string;
  file_name: string;
  file_url: string;
  file_type: string;
  duration?: number;
  uploaded_at: number;
}
