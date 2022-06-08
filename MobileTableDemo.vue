<template>
 <div>
          <mobile-table
          ref="mobileTable" 
          :columns="columns"
          :width="tableWidth"
          @sortHandle="loadData">
            <template  slot-scope="scope">
              <template v-if="scope.data.dataIndex === 'productName'">
                <span v-if="scope.data.value.productName ==='橡皮'">{{scope.data.value.productName}}</span>
                <a v-else @click = "gotoCity(scope.data.value.productName)">{{scope.data.value.productName}}</a>
              </template>
            </template>
        </mobile-table>
 </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import MobileTable from './MobileTable.vue';
@Component({
  components: {
    MobileTable,
  }
})
export default class MobileTableDemo extends Vue {

  private queryParam = {} as any;
  private tableWidth: string = '100%';
  private columns: any = [
      {
          title: '产品名称',
          dataIndex: 'productName',
          width: '12%',
          scopedSlots: true,
          sticky: true,
      },
      {
        title: '产品参数', 
        children: [
              {
                  title: '长宽', 
                  children: [
                        {
                            title: '长度',
                            dataIndex: 'length',
                            width: '12%',
                            sortable: true,
                            align: 'center',
                            suffix: 'cm',
                        },                        
                        {
                            title: '宽度',
                            dataIndex: 'width',
                            width: '12%',
                            sortable: true,
                            align: 'center',
                            suffix: 'cm',
                        },
                  ],
              },
              {
                  title: '体积',
                  dataIndex: 'volume',
                  width: '17%',
                  sortable: true,
                  suffix: 'm³',
              }
        ]
      },
      {
        title: '产品价格',
        children: [
              {
                  title: '产品成本',
                  dataIndex: 'cost',
                  width: '17%',
                  sortable: true,
                  PNColor: true,
                  suffix: '元',
              }
        ]
      }
  ];


  protected mounted() {
     this.onRefresh();
  }

  protected gotoCity(senderCityCode: string) {
     this.$router.push({
      path: "/kzgk/adRouter",
      query: {
        key: 'value'
      }
    });
  }

  protected loadData() {
    const mobileTable: MobileTable = this.$refs.mobileTable as MobileTable;
    const microParams = mobileTable.getSortParams();
    // 调用接口 将排序参数从 microParams里取出传入
    // const url = `?sortField=${(microParams as any).sortField}&sortOrder=${(microParams as any).sortOrder}`;
    // api.post(url, {param1: 'value1'}).then((res: any) => {
    //     mobileTable.pushData(res.data);
    // }).catch((err: any) => {
    // });
    // 模拟数据
    console.log("排序参数改变：" + (microParams as any).sortField + "======" + (microParams as any).sortOrder);
    const datas = [
      {
        productName: '铅笔',
        length: 10,
        width: 20,
        volume: 200,
        cost: 20
      }, 
      {
        productName: '小明',
        length: 20,
        width: 15,
        volume: 2100,
        cost: -9.02
      },
      {
        productName: '橡皮',
        length: 20,
        width: 15,
        volume: 900,
        cost: -90.2
      },
      {
        productName: '白纸',
        length: 20,
        width: 15,
        volume: 900,
        cost: 9
      },
    ];
    mobileTable.pushData(datas as []);
  }
  protected onRefresh() {
      const mobileTable: MobileTable = this.$refs.mobileTable as MobileTable;
      mobileTable.clear();
      this.loadData();
  }
}
</script>
<style lang="less" scoped>
</style>