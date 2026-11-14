import React, { useMemo, useState } from 'react';
import { Calculator, ArrowRight, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';
import {
  calculateMaintenanceSchedule,
  DrivingCondition,
  VehicleClass,
} from '../utils/maintenanceCalculator';
import { SubsystemId } from '../types/editorial';

interface MaintenanceCalculatorProps {
  onOpenArticle: (slug: string) => void;
  onInspectSubsystem: (subsystemId: SubsystemId) => void;
}

export const MaintenanceCalculator: React.FC<MaintenanceCalculatorProps> = ({
  onOpenArticle,
  onInspectSubsystem,
}) => {
  const [odometerKm, setOdometerKm] = useState<number>(38500);
  const [vehicleClass, setVehicleClass] = useState<VehicleClass>('mpv');
  const [condition, setCondition] = useState<DrivingCondition>('severe_city');

  const schedule = useMemo(
    () => calculateMaintenanceSchedule(odometerKm, vehicleClass, condition),
    [odometerKm, vehicleClass, condition]
  );

  const urgentCount = schedule.filter((s) => s.status === 'Segera Servis').length;

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 max-w-2xl">
        <div className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-700">
          <Calculator className="h-4 w-4" aria-hidden="true" />
          <span>Alat Perencanaan Servis Berkala</span>
        </div>
        <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900">
          Kalkulator Jadwal Servis Mobil
        </h2>
        <p className="mt-2 text-base leading-relaxed text-slate-600">
          Masukkan angka odometer saat ini dan pola pemakaian harian Anda untuk memetakan komponen yang wajib segera dicek atau diganti.
        </p>
      </div>

      {/* Controls Card */}
      <div className="grid gap-6 rounded-2xl border border-slate-200 bg-white p-6 md:grid-cols-3">
        <div>
          <label
            htmlFor="odometer-input"
            className="block text-sm font-semibold text-slate-900"
          >
            Odometer Saat Ini (km)
          </label>
          <input
            id="odometer-input"
            type="number"
            min={0}
            max={999999}
            step={500}
            value={odometerKm}
            onChange={(e) => setOdometerKm(Number(e.target.value) || 0)}
            className="font-mono-tabular mt-2 w-full rounded-lg border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-base font-semibold text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none"
          />
          <div className="mt-2 flex flex-wrap gap-1.5">
            {[10000, 38500, 60000, 100000].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setOdometerKm(preset)}
                className="font-mono-tabular rounded border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-200"
              >
                {preset.toLocaleString('id-ID')} km
              </button>
            ))}
          </div>
        </div>

        <div>
          <label
            htmlFor="vehicle-class"
            className="block text-sm font-semibold text-slate-900"
          >
            Kategori Kendaraan
          </label>
          <select
            id="vehicle-class"
            value={vehicleClass}
            onChange={(e) => setVehicleClass(e.target.value as VehicleClass)}
            className="mt-2 w-full rounded-lg border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none"
          >
            <option value="mpv">MPV / Hatchback Harian</option>
            <option value="sedan">Sedan / Coupe</option>
            <option value="suv">SUV / Penggerak Berat</option>
            <option value="hybrid">Hybrid / Elektrifikasi</option>
          </select>
          <p className="mt-2 text-xs text-slate-500">
            Menyesuaikan faktor beban komponen dan siklus kerja mesin.
          </p>
        </div>

        <div>
          <span className="block text-sm font-semibold text-slate-900">
            Pola Berkendara Utama
          </span>
          <div className="mt-2 grid grid-cols-2 gap-2 rounded-lg bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setCondition('severe_city')}
              className={`rounded-md px-3 py-2 text-xs font-semibold transition-colors ${
                condition === 'severe_city'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Macet Perkotaan
            </button>
            <button
              type="button"
              onClick={() => setCondition('normal')}
              className={`rounded-md px-3 py-2 text-xs font-semibold transition-colors ${
                condition === 'normal'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tol / Normal
            </button>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Macet stop-and-go mempercepat keausan oli, kampas rem, dan fluida transmisi.
          </p>
        </div>
      </div>

      {/* Summary Banner */}
      <div className="mt-6 flex flex-col justify-between gap-3 rounded-xl border border-slate-200 bg-slate-900 px-5 py-4 text-white sm:flex-row sm:items-center">
        <div>
          <div className="text-xs font-medium text-slate-400">Ringkasan Status Odometer</div>
          <div className="font-mono-tabular mt-0.5 text-lg font-semibold">
            {odometerKm.toLocaleString('id-ID')} km · {urgentCount} komponen berstatus segera servis
          </div>
        </div>
        <button
          type="button"
          onClick={() => onInspectSubsystem('all')}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white whitespace-nowrap hover:bg-blue-500"
        >
          <span>Lihat Posisi Komponen di 3D</span>
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>

      {/* Results Table */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-600">
              <tr>
                <th className="px-5 py-3.5">Komponen &amp; Tindakan</th>
                <th className="px-5 py-3.5">Interval Efektif</th>
                <th className="px-5 py-3.5">Target Berikutnya</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {schedule.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80">
                  <td className="px-5 py-4">
                    <div className="font-semibold text-slate-900">{item.component}</div>
                    <div className="mt-1 max-w-md text-xs leading-relaxed text-slate-600">
                      {item.action}
                    </div>
                    <div className="font-mono-tabular mt-1 text-[11px] font-medium text-slate-500">
                      Estimasi biaya: {item.estimatedCostIdr}
                    </div>
                  </td>
                  <td className="font-mono-tabular px-5 py-4 whitespace-nowrap text-slate-700">
                    {item.effectiveIntervalKm.toLocaleString('id-ID')} km
                  </td>
                  <td className="font-mono-tabular px-5 py-4 whitespace-nowrap">
                    <div className="font-semibold text-slate-900">
                      {item.nextDueKm.toLocaleString('id-ID')} km
                    </div>
                    <div className="text-xs text-slate-500">
                      Sisa {item.remainingKm.toLocaleString('id-ID')} km
                    </div>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                        item.status === 'Segera Servis'
                          ? 'text-amber-700'
                          : item.status === 'Mendekati Jadwal'
                          ? 'text-blue-700'
                          : 'text-emerald-700'
                      }`}
                    >
                      {item.status === 'Segera Servis' && (
                        <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
                      )}
                      {item.status === 'Mendekati Jadwal' && (
                        <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                      )}
                      {item.status === 'Kondisi Aman' && (
                        <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                      )}
                      {item.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => onOpenArticle(item.relatedArticleSlug)}
                        className="text-xs font-semibold text-blue-700 hover:underline"
                      >
                        Panduan
                      </button>
                      <button
                        type="button"
                        onClick={() => onInspectSubsystem(item.subsystemId)}
                        className="text-xs font-semibold text-slate-700 hover:text-slate-900 hover:underline"
                      >
                        Cek 3D
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
