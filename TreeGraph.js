function treeMenu(a){
    //列表map形式
    this.tree=a||[];
    this.groups={};
	//存放id与对应的name映射
	this.nameMap={}
	//得到每个点对应的层次,为了后期进行布局
	this.levelMap={}
	//样式设计
};
treeMenu.prototype={
    init:function(pid){
        this.group();
		this.MapNamebyId();
        return this.rescusive(pid);
    },
    group:function(){
        for(var i=0;i<this.tree.length;i++){
            //存在该grops则直接添加
            if(this.groups[this.tree[i].pId]){
                this.groups[this.tree[i].pId].push(this.tree[i]);
            }else{
                this.groups[this.tree[i].pId]=[];
                this.groups[this.tree[i].pId].push(this.tree[i]);
            }
        }
    },
    MapNamebyId:function(){
		for(var i=0;i<this.tree.length;i++){
			map=this.tree[i]
			this.nameMap[map["id"]]=map["name"]
		}
	},
	//设置节点属性
	setNode:function(node,name,children){
		var treeTemp = this.tree;
		for (var i = 0; i < treeTemp.length; i++) {
            if(treeTemp[i].name == name) {
                node.id = treeTemp[i].id;
                node.pId = treeTemp[i].pId;
                node.name = treeTemp[i].name;
                if(treeTemp[i].itemStyle) {
                    node.itemStyle = treeTemp[i].itemStyle;
                }
            }
        }
		node['children']=children;
		return node;
	},
	rescusive:function (number){
		var data=[]
		var node={}
		//某个节点下的子节点
		var a=this.groups[number];

		var nodeName=this.nameMap[number];
		if(a==null||a==undefined){
			//设置节点
			this.setNode(node,nodeName,[])

			return node;
		}
		for(var i=0;i<a.length;i++){
			children=this.rescusive(a[i].id);
			data.push(children);
		}
		this.setNode(node,nodeName,data);
		return node;
	}
}
//得到数据
function getData(zNodes){
	var mytree=new treeMenu(zNodes)
	return new Array(mytree.init(1));
}
function newTree(myChart,data){
    var option = {
        title : {
            text: '手机品牌',
            subtext: '线、节点样式'
        },
        tooltip : {
            trigger: 'item',
            padding: 5,
            formatter: function (params,ticket,callback) {
                var res = '科技:' + params[0];
                return res;
            }
        },
        series : [
            {
                name:'树图',
                type:'tree',
                orient: 'vertical',  // vertical horizontal
                rootLocation: {x: 'center',y: 100}, // 根节点位置  {x: 'center',y: 10}
                nodePadding: 40,//节点间距
                symbol: 'emptyRectangle',
                symbolSize: 50,
                roam: true,
                itemStyle: {
                    normal: {
                        color: "#fff",
                        borderWidth: 1,
                        label: {
                            show: true,
                            position: 'inside',
                            // formatter : function (params) {   
                            //     console.log(params);                      
                            //     return params.name  + '%';
                            // },
                            textStyle: {
                                color: '#000',
                                fontSize: 15,
                                fontWeight:  'bolder'
                            }
                        },
                        lineStyle: {
                            color: '#000',
                            width: 1,
                            type: 'curve' // 'curve'|'broken'|'solid'|'dotted'|'dashed' 线的连接方式
                        }
                    },
                    emphasis: {
                        color: '#fff',
                        borderWidth: 5
                    }
                },
                data: data
            }        
        ]
    };
    myChart.setOption(option);
}

function restData(myChart,data){
    myChart.setOption(data,true);
}
