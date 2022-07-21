const fs = require("fs");
const PATH = require("path");

const autoGetPage = function() {
  const sidebar = [];
  const getAllDirs = function getAllDirs(mypath = ".") {
    // 获取目录数据
    const items = fs.readdirSync(mypath);
    let result = [];
    // 遍历目录中所有文件夹
    items.map((item) => {
      let temp = PATH.join(mypath, item);
      // isDirectory() 不接收任何参数,如果是目录(文件夹)返回true,否则返回false
      // 如果是目录,且不包含如下目录
      if (fs.statSync(temp).isDirectory() && !item.startsWith(".")) {
        result.push(mypath + "\\" + item + "\\");
        result = result.concat(getAllDirs(temp));
      }
    });
    return result;
  };

  const docsPage = "pages";
  const pagesPath = PATH.join(__dirname, `../../${docsPage}/`);
  const pages = getAllDirs(pagesPath);

  pages.forEach((item) => {
    console.log("每个文件夹：", item);
    const cFiles = fs.readdirSync(item);
    const _fileName = item.replace(pagesPath, "").replace(/\\/g, "");
    const _f = `/${docsPage}/${_fileName}/`;
    _f.replace("\\\\", "\\");
    const c_obj = {
      title: _fileName,
      collapsable: false,
      children: [],
    };
    cFiles.forEach((v) => {
      const _cName = v.replace(".md", "");
      c_obj.children.push([_f + _cName, _cName]);
    });
    sidebar.push(c_obj);
  });

  return sidebar
};
// console.log("sidebar:", sidebar);
module.exports = autoGetPage;
