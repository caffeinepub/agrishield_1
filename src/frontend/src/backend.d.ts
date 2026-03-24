import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface UserProfile {
    name: string;
    totalScanCount: bigint;
    location: string;
}
export interface ScanRecord {
    id: bigint;
    scanDate: Time;
    diseaseDetected: string;
    plantName: string;
    treatmentRecommendation: string;
    imageRef: string;
    severity: Variant_low_high_medium;
    preventionTips: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum Variant_low_high_medium {
    low = "low",
    high = "high",
    medium = "medium"
}
export interface backendInterface {
    addScanRecord(record: ScanRecord): Promise<ScanRecord>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getScanHistory(): Promise<Array<ScanRecord>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
}
