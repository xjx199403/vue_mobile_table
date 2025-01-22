<script lang="ts">
import { CreateElement } from 'vue';
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
/**
 * author xjx
 * 移动端table https://github.com/xjx199403/vue_mobile_table
 */
@Component
export default class MobileTable extends Vue {

  @Prop()
  private columns: any;
  @Prop({ default: false })
  private fixed?: boolean = false;
  @Prop({ default: '100%' })
  private width?: string;
  private currentData?: any = [];
  private currentColumns?: any = [];

  private previousSortIndex: number = 0;
  private sortCount: number = 0;
  private sortParams: {} = {sortField: '', sortOrder: ''};

  private colgroups: any = [];
  private trsHead: any = [];
  private loopCount: number = 0; // 总深度
  private floorCount: number = 0; // 当前深度
  private loopCountMax: number = 0;
  private colspanCount: number = 0;

  private createSortElement = require('./mergeCellV2').createSortElement;
  private merge = require('./mergeCellV2').merge;
  
  private created() {
    this.initColumnsWatcher();
    this.initColumnsMerge();
  }
  
  @Watch("columns")
  public initColumnsWatcher() {
      this.initColumns(this.columns);
  }

  private initColumns(columns: any) {
      columns.forEach((cell: any) => {
          cell.floor = this.floorCount;
          if (cell.children) {
              this.loopCount++;
              this.floorCount++;
              this.initColumns(cell.children);
              this.floorCount--; // 深度回溯
          } else {
              this.initCell(cell);
              if(this.loopCount >= this.loopCountMax) {
                this.loopCountMax = this.loopCount;
              }
              // 触底清零
              this.loopCount = 0;
          }
      });
  }
  
  private initColumnsMerge() {
    this.columns.forEach((cols: any) => {
        this.mergeColumns(cols);
    });
  }

  private mergeColumns(cols: any) {
      if(cols.children) {
          cols.rowspan = 1;
          if(! cols.colspan) {
              this.getColspanCount(cols);
              cols.colspan = this.colspanCount;
              this.trsHead.push(cols);
              this.currentColumns.push(cols);
              this.colspanCount = 0;
              cols.children.forEach((col: any) => {
                this.mergeColumns(col);
              });
          }
      } else {
          this.colgroups.push(this.$createElement('col', {style: {width: cols.width}}))
          cols.rowspan = this.loopCountMax + 1;
          cols.colspan = 1;
          this.trsHead.push(cols);
          this.currentColumns.push(cols);
      }
  }
  
  private getColspanCount(cols: any) {
      if(cols.children) {
            cols.children.forEach((col: any) => {
                this.getColspanCount(col);
            })
      } else {
            this.colspanCount++;
      }
  }

  public pushData(datas: []) {
    this.currentData.push(...datas);
  }

  public getSortParams() {
      return this.sortParams;
  }

  public clear() {
      for (const dataIndex in this.currentColumns) {
            this.sortClear(dataIndex);
      }
      this.currentData = [];
  }

  private render(createElement: CreateElement) {
    const that = this;
    let ths: any = [];
    for(let i = 0; i <= this.loopCountMax; i++) {
        ths.push([]);
    }
    // 避免 infinite update loop in render
    this.trsHead.forEach( (cell: any, index: number) => {
        let element;
        if (cell.sortable) {
            element = that.createSortElement(createElement, that.currentColumns[index], that.sortClick, index);
        }
        ths[cell.floor].push(that.merge(createElement, cell, element));
    });
    const trsBody: any = [];
    this.currentData.forEach(function(row: any, index: number) {
        const tds: any = [];
        that.trsHead.forEach(function(cell: any) {
            if (cell.children) {
                return true;
            }
            if (cell.scopedSlots) {
                tds.push(createElement('td',
                 {class: (index % 2 === 0 ? {scopeSticky1: cell.sticky} : {scopeSticky2: cell.sticky})},
                    // that.$slots[cell.dataIndex]
                    (that.$scopedSlots as any).default({
                        data: {
                            dataIndex: cell.dataIndex,
                            value: row
                        }
                    })
                ));
            } else {
                let obj = {};
                let value = row[cell.dataIndex];
                if (cell.sticky) {
                    obj = Object.assign(obj,  (index % 2 === 0 ? {scopeSticky1: cell.sticky} : {scopeSticky2: cell.sticky}));
                }
                if (cell.PNColor) {
                    if (!isNaN(value)) {
                        if (value >= 0) {
                            obj = Object.assign(obj, {'micro-positive-color': true});
                        } else {
                            obj = Object.assign(obj, {'micro-negative-color': true});
                        }
                    }
                }
                if (value !== undefined) {
                    value = cell.suffix ? value + cell.suffix : value;
                }
                tds.push(createElement('td', {class: obj}, value));
            }
        });
        trsBody.push(createElement('tr', tds));
    });
    const table = createElement('table', {style: {width: that.width}}, [
        createElement('colgroup', this.colgroups),
        createElement('thead', this.createTrElement(ths)),
        createElement('tbody', trsBody)
    ]);
    return createElement('div', {class: {'slide-box': that.fixed, 'micro-div': true}}, [table]);
  }

  private createTrElement(ths: any) {
    let tempArr = [];
    for(let i = 0; i <= this.loopCountMax; i++) {
        tempArr.push(this.$createElement('tr', ths[i]));
    }
    return tempArr;
  }

  private sortClear(index: any) {
      this.noSort(index);
      this.sortCount = 0;
  }

  private initCell(cell: any) {
    Vue.set(cell, 'sortClassUp', 'triangle-up-none');
    Vue.set(cell, 'sortClassDown', 'triangle-down-none');
  }

  private sortClick(index: number) {
    this.currentData = [];
    if (index !== this.previousSortIndex) {
       this.sortClear(this.previousSortIndex);
    }
    this.previousSortIndex = index;
    if (this.sortCount % 3 === 0) {
        this.sortUp(index);
    }
    if (this.sortCount % 3 === 1) {
        this.sortDown(index);
    }
    if (this.sortCount % 3 === 2) {
        this.noSort(index);
    }
    this.sortCount++;
    this.sortParams = {sortField: this.currentColumns[index].dataIndex, sortOrder: this.currentColumns[index].sortOrder};
    this.$emit('sortHandle');
  }

  private sortUp(index: number) {
    this.currentColumns[index].sortOrder = 'descend';
    this.currentColumns[index].sortClassUp = 'triangle-up';
    this.currentColumns[index].sortClassDown = 'triangle-down-none';
  }

  private sortDown(index: number) {
    this.currentColumns[index].sortOrder = 'ascend';
    this.currentColumns[index].sortClassUp = 'triangle-up-none';
    this.currentColumns[index].sortClassDown = 'triangle-down';
  }

  private noSort(index: number) {
    this.currentColumns[index].sortOrder = '';
    this.currentColumns[index].sortClassUp = 'triangle-up-none';
    this.currentColumns[index].sortClassDown = 'triangle-down-none';
  }

}
</script>
<style lang="less" scoped>
table {
    margin-bottom: 24px;
    //border-collapse: collapse;
    border-spacing: 0;
    empty-cells: show;
    border: 1px solid #e9e9e9;
    border-collapse: separate;
    table-layout: fixed !important;
}

table th {
    font: bold 14px "Trebuchet MS", Verdana, Arial, Helvetica, sans-serif;
    background: #4D87E5;
    color: white;
    font-weight: 600;
    border-top: 1px solid #C1DAD7;
    position: relative;

}
th {
    padding-left: 2%;
}

table td, table th, table tr {
    padding: 8px 1px;
    border-right: 1px solid #C1DAD7;
    border-bottom: 1px solid #C1DAD7;
   // white-space: nowrap;
}

table th a.on {
    color: #3399ff;
}

a:hover {
    color: #1be5ff;
}

.triangle-up-none {
    display: inline-block;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-bottom: 7px solid white;
    padding-bottom: 11px;
    position: absolute;
    top: -70%;
    left: 2px;
}
.triangle-down-none {
    display:inline-block;
    border-left:5px solid transparent;
    border-right: 5px solid transparent;
    border-top:7px solid white;
    padding-top: 11px;
    position: absolute;
    bottom: -64%;
    left: 2px;
}
.triangle-up {
    display: inline-block;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-bottom: 7px solid #1be5ff;
    padding-bottom: 11px;
    position: absolute;
    top: -70%;
    left: 2px;
}
.triangle-down {
    display:inline-block;
    border-left:5px solid transparent;
    border-right: 5px solid transparent;
    border-top:7px solid #1be5ff;
    padding-top: 11px;
    position: absolute;
    bottom: -64%;
    left: 2px;
}
.sticky { 
    position: sticky !important; 
    left: 0px !important; 
    z-index: 1 !important;    
    background: #4D87E5;
    color: white;
 }
 .scopeSticky1 { 
    position: sticky !important; 
    left: 0px !important; 
    z-index: 1 !important;    
    background-color: white;
    font-weight: 600;
 }
  .scopeSticky2 { 
    position: sticky !important; 
    left: 0px !important; 
    z-index: 1 !important;    
    background-color: #e4f1f3;
    font-weight: 600;
 }
 .slide-box {
	display: -webkit-box;
	overflow-x: scroll;
    overflow-y: hidden;
	-webkit-overflow-scrolling: touch;
}
 
.slide-box ::-webkit-scrollbar {
	background-color: transparent;
}

.slide-box {
	-ms-overflow-style: none;
}

.slide-box {
	overflow: -moz-scrollbars-none;
}
.micro-div {
    position: 'relative';
    width: '100%';
}
.micro-positive-color {
	color: #018D5E !important;
}
.micro-negative-color {
	color: red !important;
}
tr:nth-child(2n-1) {
    background-color: white;
}
tr:nth-child(2n) {
    background-color: #e4f1f3;
}
</style>
