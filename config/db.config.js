const mysql = require('mysql');
const util = require('util');
const dbcon = mysql.createConnection({
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    // multipleStatements: true
});

dbcon.connect((err) => {
    if(!err){
        console.log("Database Connection Established");
        // checkSomething();
    }else{
        console.log("Database Connection faild "+JSON.stringify(err,undefined,2));
    }
});

// node native promisify
dbcon.query = util.promisify(dbcon.query).bind(dbcon);

module.exports = {
    // Insert Query
    save: async (tableName, values) => {
        return new Promise(function(resolve, reject) {
            if((tableName) && (tableName !== "")){
                if((values) && (values !== "")){
                    let allKeys = Object.keys(values);
                    let allValues = Object.values(values);
                    let newArray = [];
                    for(let j=0; j < allKeys.length; j++){
                        if(typeof(allValues[j]) == 'number'){
                            allValues[j] = String(allValues[j]);
                        }
                        // console.log(typeof(allValues[j]), allValues[j]);
                        if((allValues[j].trim() !== '') && (allValues[j].trim() !== null) && (allValues[j].trim() !== undefined)){
                            newArray.push(allKeys[j] + ' = ' + dbcon.escape(allValues[j]) );
                            //newArray.push(allKeys[j] + '=' + ((allValues[j] != "")?"'"+allValues[j]+"'":"NULL"));
                        }
                    }
                    const insertData = newArray.join();
                    const insertQry = "INSERT INTO `"+tableName+"` SET "+insertData+" ";
                    dbcon.query(insertQry, (err, result) => {
                        if (err) {
                            return reject(err.message);
                        }
                        resolve(result.insertId);
                    });
                }else{
                    return reject("Sorry! Insert values are missing");
                }
            }else{
                return reject("Sorry! Table Name is missing");
            }
        });
    },

    // Update Query
    update: async (tableName, values, condition) => {
        return new Promise(function(resolve, reject) {
            if((tableName) && (tableName !== "") && (values) && (condition) && (values !== "") && (condition !== "")){
                let allKeys = Object.keys(values);
                let allValues = Object.values(values);
                let newArray = [];
                for(let i=0; i < allKeys.length; i++){
                    if(typeof(allValues[i]) == 'number'){
                        allValues[i] = String(allValues[i]);
                    }
                    // if((allValues[i].trim() !== '') && (allValues[i].trim() !== null) && (allValues[i].trim() !== undefined) ){
                    // if((allValues[i].trim() !== '') && (allValues[i].trim() !== undefined) ){
                        newArray.push(allKeys[i] + ' = ' + dbcon.escape(allValues[i]) );
                    // }
                }
                const updateData = newArray.join();
                let whereCon = "";
                let conKeys = Object.keys(condition);
                let conValues = Object.values(condition);
                if(isNumeric(conKeys[0]) == 'string'){
                    let conArray = [];
                    for(let j=0; j < conKeys.length; j++){
                        conArray.push(conKeys[j] + ' = ' + dbcon.escape(conValues[j]) );
                    }
                    whereCon = conArray.join(" AND ");
                }
                if(isNumeric(conKeys[0]) == 'number'){
                    whereCon = condition.join(" AND ");
                }

                const whereAndSplit = whereCon.split("AND");
                const whereOrSplit = whereCon.split("OR");
                let errorCheck = 0;
                for(let i = 0; i < whereAndSplit.length; i++){
                    const andConSplit = whereAndSplit[i].split("=");
                    if((andConSplit.length > 1) && (new RegExp('\\b' + andConSplit[0].trim() + '\\b').test(andConSplit[1].trim()))){
                        errorCheck += 1;
                    }
                }
                for(let i = 0; i < whereOrSplit.length; i++){
                    const orConSplit = whereOrSplit[i].split("=");
                    if((orConSplit.length > 1) && (new RegExp('\\b' + orConSplit[0].trim() + '\\b').test(orConSplit[1].trim()))){
                        errorCheck += 1;
                    }
                }
                if(errorCheck === 0){
                    const updateQry = "UPDATE `"+tableName+"` SET "+updateData+" WHERE "+whereCon+" ";
                    dbcon.query(updateQry, (err, result) => {
                        if (err) {
                            return reject(err.message);
                        }
                        resolve(result);
                    });
                }else{
                    return reject("Sorry! Bad Request");
                }
            }else{
                return reject("Sorry! Table Name OR Update values OR Conditional values are missing");
            }
        });
    },

    // Delete Query
    delete: async (tableName, condition) => {
        return new Promise(function(resolve, reject) {
            if((tableName) && (tableName != "")){
                if((condition) && (condition != "")){
                    let whereCon = "";
                    let conKeys = Object.keys(condition);
                    let conValues = Object.values(condition);

                    if(isNumeric(conKeys[0]) == 'string'){
                        let conArray = [];
                        for(let j=0; j < conKeys.length; j++){
                            conArray.push(conKeys[j] + ' = ' + dbcon.escape(conValues[j]) );
                        }
                        whereCon = conArray.join(" AND ");
                    }
                    if(isNumeric(conKeys[0]) == 'number'){
                        whereCon = condition.join(" AND ");
                    }

                    const whereAndSplit = whereCon.split("AND");
                    const whereOrSplit = whereCon.split("OR");
                    let errorCheck = 0;
                    for(let i = 0; i < whereAndSplit.length; i++){
                        const andConSplit = whereAndSplit[i].split("=");
                        if((andConSplit.length > 1) && (new RegExp('\\b' + andConSplit[0].trim() + '\\b').test(andConSplit[1].trim()))){
                            errorCheck += 1;
                        }
                    }
                    for(let i = 0; i < whereOrSplit.length; i++){
                        const orConSplit = whereOrSplit[i].split("=");
                        if((orConSplit.length > 1) && (new RegExp('\\b' + orConSplit[0].trim() + '\\b').test(orConSplit[1].trim()))){
                            errorCheck += 1;
                        }
                    }
                    if(errorCheck === 0){
                        const delQry = "DELETE FROM `"+tableName+"` WHERE "+whereCon+" ";
                        dbcon.query(delQry, (err, result) => {
                            if (err) {
                                return reject(err.message);
                            }
                            resolve(result);
                        });
                    }else{
                        return reject("Sorry! Bad Request");
                    }
                }else{
                    return reject("Sorry! Conditional values are missing");
                }
            }else{
                return reject("Sorry! Table Name is missing");
            }
        });
    },

    // Select with Join Query
    fetchData: async (tableName, joinType, foreignKey, fields, condition, orderby, limitD) => {
        return new Promise(function(resolve, reject) {
            if((tableName) && (tableName != "")){
                let multiJoinSql = "";
                if(tableName.length > 1){
                    if((foreignKey.length) === ((tableName.length) - 1) ){
                        let multiJoinArray= [];
                        for(let i=0; i < tableName.length; i++){
                            multiJoinArray.push(((i != 0)?joinType + ' ':'') + tableName[i] + ((i != 0)?' ON ' + Object.keys(foreignKey[i-1])[0] + ' = ' + Object.values(foreignKey[i-1])[0]:''));
                        }
                        multiJoinSql = multiJoinArray.join(" ");
                    }else{
                        return reject("Sorry! No of Tables and Foreign key Mismatch ");
                    }
                }else{
                    multiJoinSql = tableName[0];
                }
                let whereCon = "";
                let errorCheck = 0;
                if((condition) && (condition != "")){
                    let allKeys = Object.keys(condition);
                    let allValues = Object.values(condition);
                    if(isNumeric(allKeys[0]) == 'string'){
                        let newArray = [];
                        for(let j=0; j < allKeys.length; j++){
                            newArray.push(allKeys[j] + ' = ' + dbcon.escape(allValues[j]) );
                        }
                        whereCon = newArray.join(" AND ");
                    }
                    if(isNumeric(allKeys[0]) == 'number'){
                        whereCon = condition.join(" AND ");
                    }
                    // console.log(whereCon);
                    const whereAndSplit = whereCon.split("AND");
                    const whereOrSplit = whereCon.split("OR");
                    for(let i = 0; i < whereAndSplit.length; i++){
                        const andConSplit = whereAndSplit[i].split("=");
                        if((andConSplit.length > 1) && (new RegExp('\\b' + andConSplit[0].trim() + '\\b').test(andConSplit[1].trim()))){
                            errorCheck += 1;
                        }
                    }
                    for(let i = 0; i < whereOrSplit.length; i++){
                        const orConSplit = whereOrSplit[i].split("=");
                        if((orConSplit.length > 1) && (new RegExp('\\b' + orConSplit[0].trim() + '\\b').test(orConSplit[1].trim()))){
                            errorCheck += 1;
                        }
                    }
                }
                let orderCon = "";
                if((orderby) && (orderby != "")){
                    let orderKeys = Object.keys(orderby);
                    let orderValues = Object.values(orderby);
                    let orderArray = [];
                    for(let j=0; j < orderKeys.length; j++){
                        if(orderValues[j].trim() != ''){
                            orderArray.push(orderKeys[j] + ' ' + orderValues[j].trim() );
                        }
                    }
                    orderCon = orderArray.join(" AND ");
                }
                let limitData = "";
                if((limitD) && (limitD != "")){
                    if(limitD.length > 1){
                        limitData = "LIMIT " + limitD[0] + "," + limitD[1];
                    }else{
                        limitData = "LIMIT 0," + limitD[0];
                    }
                }
                if(errorCheck === 0){
                    const selectQry = "SELECT "+(((fields) && (fields != ""))?fields:'*')+" FROM "+multiJoinSql+" "+((whereCon != "")?'WHERE '+ whereCon :'')+" "+((orderCon != "")?'ORDER BY '+ orderCon :'')+" "+((limitData != "")?limitData:'')+" ";
                    //console.log(selectQry);
                    dbcon.query(selectQry, (err, result) => {
                        if (err) {
                            return reject(err.message);
                        }
                        resolve(result);
                    });
                }else{
                    return reject("Sorry! Bad Request");
                }
            }else{
                return reject("Sorry! Table Name is missing");
            }
        });
    },
}
// global.dbConfig = dbcon;
module.exports.dbCon = dbcon;

function isNumeric(value) {
    return (value==Number(value))?"number":"string"
}