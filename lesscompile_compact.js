const less = require('less');
const LessPluginCleanCSS = require('less-plugin-clean-css');
const fs = require('fs');
const compactThemeVars = require('ng-zorro-antd/compact-theme');

const appStyles = 'src/styles.less'; // 应用的样式入口文件
const themeContent = `@import '${appStyles}';`;

less.render(themeContent, {
  javascriptEnabled: true,
  plugins: [new LessPluginCleanCSS({ advanced: true })],
  modifyVars: {
    ...compactThemeVars
  }
}).then(data => {
  fs.writeFileSync(
    // 主题样式的输出文件
    'src/assets/themes/style.compact.css',
    data.css
  )
})
.catch(reason => {
  console.error(reason);
});
