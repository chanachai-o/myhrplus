/**
 * Biometric Models
 */

export interface FaceEnrollment {
  face_id: string;
  member_id: string;
  encoding: number[];
  quality_score: number;
  enrolled_at: string;
}

