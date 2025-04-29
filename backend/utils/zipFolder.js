import archiver from "archiver";
import fs from "fs";
import path from "path";
const __dirname = path.resolve();
export async function zipFolder(folderPath, zipName) {
  const tempZipPath = path.join(__dirname, "temp", `${zipName}.zip`);
  const output = fs.createWriteStream(tempZipPath);
  const archive = archiver("zip", {
    zlib: { level: 9 },
  });
  output.on("close", () => {
    console.log(`Zipped ${archive.pointer()} total bytes.`);
    console.log("Folder zipped successfully!");
  });
  archive.on("error", (err) => {
    throw err;
  });
  archive.pipe(output);
  const files = await fs.promises.readdir(folderPath);
  for (const file of files) {
    const filePath = path.join(folderPath, file);
    const stats = await fs.promises.stat(filePath);
    if (stats.isDirectory()) {
      // Handle subdirectories recursively
      await addDirectoryToArchive(archive, filePath, folderPath);
    } else {
      archive.file(filePath, { name: file });
    }
  }
  await archive.finalize();
}
// Helper function to add a directory and its contents to the archive
async function addDirectoryToArchive(archive, dirPath, baseFolder) {
  const files = await fs.promises.readdir(dirPath);
  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stats = await fs.promises.stat(filePath);
    if (stats.isDirectory()) {
      // Recursively add subdirectory
      await addDirectoryToArchive(archive, filePath, baseFolder);
    } else {
      archive.file(filePath, { name: path.relative(baseFolder, filePath) });
    }
  }
}
