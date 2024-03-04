# 功能强大的移动端vue动态表格组件
### 开发语言：
vue3.0; typescript.
### 依赖：
普通的vue3.0脚手架环境即可.
### 使用方法：
1.你只需引入该组件：MobileTable.vue,mergeCellV2.jsx: 
![image](https://github.com/xjx199403/vue_mobile_table/blob/main/02.png?raw=true) 
并在项目中添加:
![image](https://github.com/xjx199403/vue_mobile_table/blob/main/01.png?raw=true)  
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
* 表头可以动态改变，可合并单元格，可配置多层，表头中的配置见名知意，有需要也可以在组件中直接添加;
* 适用于移动端，在有大量表格的移动端oa应用中(微信公众号,企业微信,小程序)使用非常方便，可以规范样式框架，并节省很多开发时间;
* 示例中的数据来源可替换成后台传入，重新pushData()即可，同样排序参数也可以传到后台去排序;
* 表格中插槽的使用可以参考示例;
* 组件参考ant-design-vue，与其使用方法基本一致;
