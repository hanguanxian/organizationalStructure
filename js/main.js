var itemStyle = {};
    itemStyle.normal = {color: "#8dc63f"};
    itemStyle.normal.label = {textStyle: {color: "#fff"}};
    itemStyle.emphasis = {color: "#8dc63f"};
var itemSelected = {};
var myChart;
var zNodes=[
    {id:1,pId:0,name:"董事长"},
    {id:11,pId:1,name:"经理"},
    {id:12,pId:1,name:"副总"},
    {id:13,pId:1,name:"秘书"},
    {id:16,pId:11,name:"财务经理"},
    {id:27,pId:11,name:"人事经理"},
    {id:18,pId:12,name:"HR"}
];

// 路径配置
require.config({
    paths: {
        echarts: 'http://localhost/organizationalStructure/js'
    }
});
// 使用
require(
    [
        'echarts',
        'echarts/chart/tree'
    ],
    function (ec) {
        // 基于准备好的dom，初始化echarts图表
        myChart = ec.init(document.getElementById('main'));
        var data=getData(zNodes)
        itemSelected = data[0];
        itemSelected.itemStyle = itemStyle;
        setData(myChart,data);
        myChart.on('click', function(param) {
            var temp = JSON.parse(JSON.stringify(zNodes));
            //console.log(param);
            for (var i = 0; i < temp.length; i++) {
                if(temp[i].name == param.name) {
                    $("#info").text(temp[i].name);
                    temp[i].itemStyle = itemStyle;
                    break;
                }
            }
            itemSelected = param.data;
            var data=getData(temp);
            //console.log("data:"+JSON.stringify(data));
            setData(myChart,data,0);
        });
    }
);

$(function () {
    $("#add").click(function(e){
        e.preventDefault();
        if(itemSelected == null){
            swal('请选择一个部门');
            return;
        }
        swal({
            title: '添加部门',
            input: 'text',
            showCloseButton: true,
            confirmButtonText: '确定'
        }).then(function (value) {
            if(value) {
                var tempData = {};
                if(zNodes.length == 0) {
                  tempData.pId = 0;
                  tempData.id = 1;
                } else {
                  tempData.pId = itemSelected.id;
                  tempData.id = itemSelected.id + 1;
                }
                tempData.name = value;
                zNodes.push(tempData);//TODO 提交到后台
                var data=getData(zNodes)
                setData(myChart,data);
                itemSelected = null;
            }
        })
    })

    $("#delete").click(function(e){
        e.preventDefault();
        if(itemSelected == null){
            swal('请选择一个部门');
            return;
        }
        for (var i = 0; i < zNodes.length; i++) {
            if(zNodes[i].pId == itemSelected.id) {
              swal('请先删除该部门下属部门!');
              return;
            }
        }
        //TODO 提交到后台
        swal({
          text: "确定删除该部门？",
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: '删除',
          cancelButtonText: '取消'
        }).then(function () {
            for (var i = 0; i < zNodes.length; i++) {
                if(zNodes[i].id == itemSelected.id) {
                    zNodes.splice(i,1);
                }
            }
            var data=getData(zNodes);
            setData(myChart,data);
            itemSelected = null;
        })
    })
})
