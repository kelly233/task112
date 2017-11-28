const database = require('./datbase');
loadAllItems = database.loadAllItems;
loadPromotions = database.loadPromotions;
function findObjInArr(result, str) {
    let newObj
    for (let obj of result) {
        if (obj.barcodes === str) {
            newObj = obj;
        }
    }
    return newObj
}

function CountNumbersOfCommodities(inputs,result){
    for (let str of inputs) {
        let obj = findObjInArr(result, str)
        if (obj) {
            obj.count++;
        } else {result.push({barcodes: str, count: 1})
        }
    }
    return result;
}

function MakeaNewArray(inputs){
    for(let i=0;i<inputs.length;i++){
        if(inputs[i].length===12){
            let a=inputs[i].substring(0,10);
            let b=inputs[i].substring(11,12);
            let c=parseInt(b);
            inputs.splice(i,1);
            for(let j=0;j<c;j++){
                inputs.splice(i,0,a);
            }
        }
    }
    return inputs
}

function AddProperties(result,allItems){
    for (let item of result){
        for (let obj of allItems){
            if(obj.barcode === item.barcodes){item.price = obj.price; item.name = obj.name; item.unit = obj.unit;}
        }
    }
    return result
}
function AddSumProperty(result,Promotions){
    for (let i=0;i<result.length;i++){
        let  light = 0;
        for (let j=0;j<Promotions[0].barcodes.length;j++){
            if(result[i].barcodes === Promotions[0].barcodes[j]){
                light = 1;
            }
        }
        if(light === 1 && result[i].count > 2){
            result[i].sum = (result[i].count-1)*result[i].price;
            result[i].promotion = result[i].price;
        }
        else{result[i].sum = result[i].count*result[i].price;
            result[i].promotion = 0;
        }
    }
    return result
}

module.exports = function printInventory(inputs) {
    let allItems=loadAllItems()
    let Promotions=loadPromotions()
    let result = []
    inputs = MakeaNewArray(inputs)
    result = CountNumbersOfCommodities(inputs,result)
    result = AddProperties(result,allItems)
    result = AddSumProperty(result,Promotions)
    var cheap = 0;
    var total = 0;
    for (let item of result){cheap += item.promotion; total += item.sum;}
    console.log('***<没钱赚商店>购物清单***\n' +
        '名称：'+ result[0].name +'，数量：' + result[0].count + result[0].unit + '，单价：' + result[0].price.toFixed(2) + '(元)，小计：' + result[0].sum.toFixed(2) + '(元)\n' +
        '名称：'+ result[1].name +'，数量：' + result[1].count + result[1].unit + '，单价：' + result[1].price.toFixed(2) + '(元)，小计：' + result[1].sum.toFixed(2) + '(元)\n' +
        '名称：'+ result[2].name +'，数量：' + result[2].count + result[2].unit + '，单价：' + result[2].price.toFixed(2) + '(元)，小计：' + result[2].sum.toFixed(2) + '(元)\n'  +
        '----------------------\n' +
        '挥泪赠送商品：\n' + '名称：' + result[0].name + '，数量：1' + result[0].unit + '\n' + '名称：' + result[2].name + '，数量：1' + result[2].unit + '\n' +
        '----------------------\n' +
        '总计：' + total.toFixed(2) + '(元)\n' + '节省：' + cheap.toFixed(2) + '(元)\n' +
        '**********************');
}

