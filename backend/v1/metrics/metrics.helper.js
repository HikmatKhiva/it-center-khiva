import os from "os";
import si from "systeminformation";

export async function getSystemInfo() {
  try {
    const cpuInfo = await si.currentLoad();
    const cpuCount = os.cpus().length;
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const disks = await si.fsSize();
    const diskTotal = disks[0]?.size ?? 0;
    const diskUsed = disks[0]?.used ?? 0;
    const networkInterfaces = os.networkInterfaces();
    const serverIPs = Object.values(networkInterfaces)
      .flat()
      .filter(
        (iface) =>
          iface.family === "IPv4" &&
          !iface.internal &&
          iface.address !== "127.0.0.1",
      )
      .map((iface) => iface.address);

    const osInfo = {
      type: os.type(), // 'Linux'
      platform: os.platform(), // 'linux'
    };

    return {
      osInfo,
      serverIPs,
      cpu: {
        usagePercent: Math.round(cpuInfo.currentLoad), // 23% ✅
        loadAverage1m: os.loadavg()[0] / cpuCount, // 0.12 ✅
        coreCount: cpuCount, // 8
      },
      memory: {
        totalGB: Math.floor(totalMem / 1024 ** 3),
        usedGB: Math.floor((totalMem - freeMem) / 1024 ** 3),
        freeGB: Math.floor(freeMem / 1024 ** 3),
        usagePercent: Math.round(((totalMem - freeMem) / totalMem) * 100),
      },
      storage: {
        totalGB: Math.floor(diskTotal / 1024 ** 3),
        usedGB: Math.floor(diskUsed / 1024 ** 3),
        freeGB: Math.floor((diskTotal - diskUsed) / 1024 ** 3),
        usagePercent:
          diskTotal > 0 ? Math.round((diskUsed / diskTotal) * 100) : 0,
      },
      uptime: process.uptime(),
      timestamp: Math.floor(Date.now() / 1000),
    };
  } catch (err) {
    console.error(err);
    return null;
  }
}
