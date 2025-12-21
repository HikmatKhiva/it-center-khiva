import os from "os";
import si from "systeminformation";
export async function getSystemInfo() {
  try {
    const loadAvg = os.loadavg()[0];
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    const memInfo = await si.mem(); // RAM details
    const disks = await si.fsSize(); // Disk/FS details
    const diskTotal = disks[0]?.size ?? 0;
    const result = {
      cpu: {
        loadAverage1m: loadAvg,
      },
      memory: {
        totalMB: Math.round(totalMem / 1024 ** 2),
        usedMB: Math.round(usedMem / 1024 ** 2),
        freeMB: Math.round(freeMem / 1024 ** 2),
        totalGB: (memInfo.total / 1024 ** 3).toFixed(2),
      },
      storage: {
        totalGB: (diskTotal / 1024 ** 3).toFixed(2),
      },
      processes: (await si.processes()).list,
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    };
    return result;
  } catch (err) {
    console.error(err);
  }
}
