import { SubsystemId } from '../types/editorial';

export type VehicleClass = 'mpv' | 'sedan' | 'suv' | 'hybrid';
export type DrivingCondition = 'normal' | 'severe_city';

export interface MaintenanceRule {
  id: string;
  component: string;
  subsystemId: Exclude<SubsystemId, 'all'>;
  baseIntervalKm: number;
  severeMultiplier: number;
  action: string;
  estimatedCostIdr: string;
  relatedArticleSlug: string;
}

export interface CalculatedMaintenanceItem {
  id: string;
  component: string;
  subsystemId: Exclude<SubsystemId, 'all'>;
  effectiveIntervalKm: number;
  nextDueKm: number;
  remainingKm: number;
  status: 'Segera Servis' | 'Mendekati Jadwal' | 'Kondisi Aman';
  action: string;
  estimatedCostIdr: string;
  relatedArticleSlug: string;
}

export const MAINTENANCE_RULES: MaintenanceRule[] = [
  {
    id: 'engine-oil',
    component: 'Oli Mesin & Filter Oli',
    subsystemId: 'engine',
    baseIntervalKm: 10000,
    severeMultiplier: 0.7,
    action: 'Ganti oli full synthetic sesuai viskositas pabrikan dan filter oli baru.',
    estimatedCostIdr: 'Rp 450.000 – Rp 950.000',
    relatedArticleSlug: 'panduan-memilih-oli-mesin-sintetik-dan-interval-ganti',
  },
  {
    id: 'tire-rotation',
    component: 'Rotasi Ban, Balancing & Spooring',
    subsystemId: 'tires',
    baseIntervalKm: 10000,
    severeMultiplier: 0.85,
    action: 'Rotasi silang posisi ban, cek kedalaman alur minimal 1,6 mm, dan setel geometri roda.',
    estimatedCostIdr: 'Rp 250.000 – Rp 450.000',
    relatedArticleSlug: 'panduan-tekanan-angin-rotasi-ban-dan-spooring',
  },
  {
    id: 'cabin-ac-filter',
    component: 'Filter Kabin & Servis Evaporator AC',
    subsystemId: 'ac',
    baseIntervalKm: 15000,
    severeMultiplier: 0.75,
    action: 'Ganti filter kabin HEPA/karbon dan bersihkan kondensor depan dari debu jalanan.',
    estimatedCostIdr: 'Rp 180.000 – Rp 550.000',
    relatedArticleSlug: 'penyebab-ac-mobil-kurang-dingin-dan-perawatan-kompresor',
  },
  {
    id: 'brake-inspection',
    component: 'Kampas Rem, Cakram & Minyak Rem',
    subsystemId: 'brakes',
    baseIntervalKm: 20000,
    severeMultiplier: 0.75,
    action: 'Ukur ketebalan kampas (ganti jika <= 3 mm), periksa keausan rotor, dan cek titik didih minyak rem.',
    estimatedCostIdr: 'Rp 400.000 – Rp 1.200.000',
    relatedArticleSlug: 'sistem-pengereman-cakram-abs-tanda-kampas-aus',
  },
  {
    id: 'battery-charging',
    component: 'Aki 12V & Tegangan Alternator',
    subsystemId: 'electrical',
    baseIntervalKm: 25000,
    severeMultiplier: 0.8,
    action: 'Uji tegangan diam (12,4–12,7V), CCA aki, dan output pengisian alternator (13,8–14,4V).',
    estimatedCostIdr: 'Rp 100.000 (cek) / Rp 900.000+ (ganti)',
    relatedArticleSlug: 'merawat-aki-mobil-dan-sistem-pengisian-alternator',
  },
  {
    id: 'atf-cvt-fluid',
    component: 'Oli Transmisi Otomatis (ATF / CVT)',
    subsystemId: 'engine',
    baseIntervalKm: 40000,
    severeMultiplier: 0.75,
    action: 'Kuras/ganti fluida transmisi khusus CVT/ATF dan bersihkan pan magnet serbuk logam.',
    estimatedCostIdr: 'Rp 850.000 – Rp 1.800.000',
    relatedArticleSlug: 'servis-berkala-transmisi-otomatis-cvt-dan-atf',
  },
];

export function calculateMaintenanceSchedule(
  odometerKm: number,
  vehicleClass: VehicleClass,
  condition: DrivingCondition
): CalculatedMaintenanceItem[] {
  const safeKm = Math.max(0, Math.min(999999, Math.round(odometerKm || 0)));
  const vehicleFactor = vehicleClass === 'hybrid' ? 1.1 : vehicleClass === 'suv' ? 0.95 : 1.0;

  return MAINTENANCE_RULES.map((rule) => {
    const condFactor = condition === 'severe_city' ? rule.severeMultiplier : 1.0;
    const rawInterval = rule.baseIntervalKm * condFactor * vehicleFactor;
    const effectiveIntervalKm = Math.max(2500, Math.round(rawInterval / 500) * 500);

    const completedCycles = Math.floor(safeKm / effectiveIntervalKm);
    const nextDueKm = (completedCycles + 1) * effectiveIntervalKm;
    const remainingKm = nextDueKm - safeKm;
    const ratioUsed = (safeKm % effectiveIntervalKm) / effectiveIntervalKm;

    let status: CalculatedMaintenanceItem['status'] = 'Kondisi Aman';
    if (safeKm > 0 && (remainingKm <= 1000 || ratioUsed >= 0.9)) {
      status = 'Segera Servis';
    } else if (safeKm > 0 && remainingKm <= effectiveIntervalKm * 0.25) {
      status = 'Mendekati Jadwal';
    }

    return {
      id: rule.id,
      component: rule.component,
      subsystemId: rule.subsystemId,
      effectiveIntervalKm,
      nextDueKm,
      remainingKm,
      status,
      action: rule.action,
      estimatedCostIdr: rule.estimatedCostIdr,
      relatedArticleSlug: rule.relatedArticleSlug,
    };
  });
}
