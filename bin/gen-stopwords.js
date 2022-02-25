const path = require('path');
const fs = require('fs');
const fsPromise = fs.promises;

const readline = require('readline');

const getFilePath = (language) => {
  return path.join(
    __dirname,
    '..',
    'data',
    'stopwords',
    `stopwords-${language}.txt`
  );
};

const readText = async (filePath) => {
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  // Note: we use the crlfDelay option to recognize all instances of CR LF
  // ('\r\n') in input.txt as a single line break.
  const lines = [];
  for await (const line of rl) {
    // Each line in input.txt will be successively available here as `line`.
    lines.push(line);
  }
  return lines.filter((line) => !!line);
};

(async () => {
  console.log('----START----');
  //   const filePath = getFilePath('vi');
  //   console.log(`filePath: ${filePath}`);
  const dirPath = path.join(__dirname, '..', 'data', 'stopwords');
  console.log(`files: ${dirPath}`);
  const files = await fsPromise.readdir(dirPath);
  const tasks = files.map(async (file) => {
    const filePath = path.join(dirPath, file);
    const lines = await readText(filePath);
    const language = file.split('-')[1].replace('.txt', '');
    return {
      [language]: lines,
    };
  });
  let data = await Promise.all(tasks);
  data = data.reduce((acc, cur) => {
    return { ...acc, ...cur };
  }, {});

  const content = `module.exports = ${JSON.stringify(data, null, 2)};`;
  await fsPromise.writeFile(
    path.join(__dirname, '..', 'stopwordsdata.js'),
    content,
    {
      encoding: 'utf8',
    }
  );
  console.log(data);
})();
