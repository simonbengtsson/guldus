import fs from "fs/promises";
import path from "path";

const scriptTag = '<script src="analytics.js"></script>';

async function addScriptTagToHtmlFiles(folderPath) {
  const files = await fs.readdir(folderPath);

  for (const file of files) {
    const isDirectory = (
      await fs.stat(path.join(folderPath, file))
    ).isDirectory();
    if (isDirectory) {
      addScriptTagToHtmlFiles(path.join(folderPath, file));
    }
    if (path.extname(file) !== ".html") continue;

    const filePath = path.join(folderPath, file);
    const data = await fs.readFile(filePath, "utf8");

    if (data.includes(scriptTag)) {
      continue;
    }

    const updatedContent = data.includes("</body>")
      ? data.replace(/<\/body>/i, `${scriptTag}\n</body>`)
      : `${data}\n${scriptTag}`;

    if (!data.includes("</body>")) {
      console.log(`🔴 No </body> found in: ${file}`);
    } else {
      await fs.writeFile(filePath, updatedContent, "utf8");
      console.log(`Script tag added to: ${file}`);
    }
  }
}

addScriptTagToHtmlFiles("./app");
//fs.copyFile("index.html", "app/index.html");
