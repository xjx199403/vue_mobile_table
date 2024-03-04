# 功能强大的移动端vue动态表格组件
### 开发语言：
vue3.0; typescript.
### 依赖：
普通的vue3.0脚手架环境即可.
### 使用方法：
1.你只需要引入组件: 
添加MobileTable.vue,mergeCellV2.jsx，并引入:
![image](https://github.com/xjx199403/vue_mobile_table/blob/main/%E5%BC%95%E5%85%A5%E7%BB%84%E4%BB%B6.png?raw=true)  
2.配置 表头.json:  
![image](https://github.com/xjx199403/vue_mobile_table/blob/main/%E8%A1%A8%E5%A4%B4%E9%85%8D%E7%BD%AE.png?raw=true)  
3.存入数据:  
![image](https://github.com/xjx199403/vue_mobile_table/blob/main/%E5%AD%98%E5%85%A5%E6%95%B0%E6%8D%AE.png?raw=true)  
即可生成表格:  
![image](https://github.com/xjx199403/vue_mobile_table/blob/main/%E7%BB%93%E6%9E%9C1.png?raw=true)  
### 内容：
组件: MobileTable.vue, mergeCellV2.jsx  
示例: MobileTableDemo.vue
### 说明：
* 核心算法是递归内嵌递归，组件参考ant-design-vue的表格的生成模式，与其使用方法基本一致;
* 适用于移动端，在有大量表格的OA应用中(微信公众号,企业微信,app)使用非常方便，可以节省很多开发时间;
* demo中的数据来源可替换成后台传入，重新pushData即可，同样排序参数也可以传到后台去排序;
* 表头可以动态改变，表头中的配置见名知意，有需要也可以在组件中直接添加;
* 表格中插槽的使用参考demo;
