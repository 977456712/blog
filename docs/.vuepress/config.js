const path = require("path");
const autoGetPage = require(path.join(__dirname, "./utils/autoPage.js"));

const sidebar = autoGetPage();

const config = {
  title: "白开水博客",
  description: "记录",
  base: "/blog/",
  head: [["link", { rel: "icon", href: "/logo.png" }]],
  markdown: {
    lineNumbers: true, // 代码块显示行号
  },
  themeConfig: {
    // nav: [
    //   { text: "首页", link: "/" },
    //   { text: "前端积累", link: "/pages/" }, // 内部链接 以docs为根目录
    // ],
    sidebar: {
      "/": [
        {
          title: "前置",
          collapsable: false,
          children: [["/", "介绍"]],
        },
        ...sidebar
        // {
        //   title: "JavaScript",
        //   collapsable: false,
        //   children: [
        //     ["/pages/JavaScript/aaa", "这个是一个aaa"],
        //     ["/pages/JavaScript/bbb", "这是一个bbb1111"],
        //   ],
        // },
      ],
    },
    // "/",'/pages/JavaScript/aaa','/pages/JavaScript/bbb'
    lastUpdated: "Last Updated", // 文档更新时间：每个文件git最后提交的时间
  },
};
module.exports = config;
