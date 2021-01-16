async function readFile(filePath) {
  try {
    const data = await fsPromises.readFile(filePath);
    return data.toString();
  } catch (error) {
    console.error(`Got an error trying to read the file: ${error.message}`);
  }
}

function isErrorNotFound(err) {
  return err.code === "ENOENT";
}

async function checkIfDirectoryExists(directory) {
  return fsPromises
    .stat(directory)
    .then((fsStat) => {
      return fsStat.isDirectory();
    })
    .catch((err) => {
      if (isErrorNotFound(err)) {
        return false;
      }
      throw err;
    });
}

async function makeOutputDirectory(directory) {
  fsPromises
    .mkdir(directory, { recursive: true })
    .then(() => {
      return true;
    })
    .catch((err) => {
      throw err;
    });
}

async function writeFile(file, content) {
  try {
    await fsPromises.writeFile(file, content);
  } catch (error) {
    console.error(`Got an error trying to write to a file: ${error.message}`);
  }
}

export { checkIfDirectoryExists, makeOutputDirectory, readFile, writeFile };
