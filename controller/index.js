const dbFunction = require('../config/db.config');
const bcrypt = require('bcryptjs');
const moment = require('moment');
const { validationResult } = require('express-validator');
const ejs = require('ejs');
const path = require('path');
const { Console } = require('console');

module.exports = {
    getHome: async (req, res) => {
        try {
            const whereCon = { status: '1', is_deleted: '0' };
            const orderBy = { id: 'DESC' };
            const result = await dbFunction.fetchData(PRODUCTS, "", "", "", whereCon, orderBy);
            res.render('views/index.html', {
                title: 'Home',
                page: 'home',
                result: result,
                moment: moment
            });
        } catch (error) {
            console.log(error);
            res.redirect('/error?error=' + encodeURIComponent(error.message) + '&errorStatus=400');
        }
    },
    getProduct: async (req, res) => {
        try {
            const whereCon = { status: '1', is_deleted: '0' };
            const orderBy = { id: 'DESC' };
            const result = await dbFunction.fetchData(PRODUCTS, "", "", "", whereCon, orderBy);
            res.render('views/product.html', {
                title: 'Products',
                page: 'product',
                result: result,
                moment: moment
            });
        } catch (error) {
            console.log(error);
            res.redirect('/error?error=' + encodeURIComponent(error.message) + '&errorStatus=400');
        }
    },
    getRack: async (req, res) => {
        try {
            const whereCon = { status: '1', is_deleted: '0' };
            const orderBy = { id: 'ASC' };
            const result = await dbFunction.fetchData(RACKS, "", "", "", whereCon, orderBy);

            const order_no = [];
            if (result.length > 0) {
                result.forEach(element => {
                    order_no.push(element.capacity);
                });

                var unique_data = order_no.filter(onlyUnique);
                var final_data = unique_data.sort((a, b) => b - a);
            }

            res.render('views/rack.html', {
                title: 'Rack',
                page: 'rack',
                result: result,
                orders: final_data,
                moment: moment
            });

        } catch (error) {
            console.log(error);
            res.redirect('/error?error=' + encodeURIComponent(error.message) + '&errorStatus=400');
        }
    },
    getSuggestedSpace: async (req, res) => {
        try {
            // const whereCon = { status: '1', is_deleted: '0' };
            // const orderBy = { id: 'DESC' };
            // const result = await dbFunction.fetchData(PRODUCTS, "", "", "", whereCon, orderBy);
            res.render('views/suggested_space.html', {
                title: 'Suggested Space',
                page: 'suggested_space',
                moment: moment
            });
        } catch (error) {
            console.log(error);
            res.redirect('/error?error=' + encodeURIComponent(error.message) + '&errorStatus=400');
        }
    },
    getRackOrder: async (req, res) => {
        try {
            const whereCon = { status: '1', is_deleted: '0' };
            const orderBy = { id: 'ASC' };
            const result = await dbFunction.fetchData(RACKS, "", "", "", whereCon, orderBy);

            const order_no = [];
            if (result.length > 0) {
                result.forEach(element => {
                    order_no.push(element.capacity);
                });

                var unique_data = order_no.filter(onlyUnique);
                var final_data = unique_data.sort((a, b) => b - a);
            }

            res.render('views/rack_order.html', {
                title: 'Rack',
                page: 'rack',
                result: result,
                orders: final_data,
                moment: moment
            });

        } catch (error) {
            console.log(error);
            res.redirect('/error?error=' + encodeURIComponent(error.message) + '&errorStatus=400');
        }
    },
    getRackPostOrder: async (req, res) => {
        try {
            const postData = req.body;
            //console.log(postData);

            var rack_id = postData.rack_id;

            for (let i = 0; i < rack_id.length; i++) {

                const coefficient = postData.sq_order[i] * 0.3 + postData.order_no[i] * 0.7;

                const editData = {
                    order_no: postData.order_no[i],
                    coefficient: coefficient
                }
                const updatewhereCon = ["id = '" + rack_id[i] + "'"];

                await dbFunction.update(RACKS, editData, updatewhereCon);
            }
            res.redirect('/rack');

        } catch (error) {
            console.log(error);
            return res.status(400).json({ status: 'error', message: error.message });
        }
    },
    dataDelete: async (req, res) => {
        try {
            const postData = req.body;

            const tableName = [postData.table_name];
            const editData = {
                'is_deleted': '1'
            }
            const updatewhereCon = ["" + postData.check_field + " = '" + postData.id + "'"];
            const returnData = await dbFunction.update(tableName, editData, updatewhereCon);
            return res.status(200).json({ status: 'success', message: 'Deleted Successfully ...' });

        } catch (error) {
            console.log(error);
            return res.status(400).json({ status: 'error', message: error.message });
        }
    },
    rackStore: async (req, res) => {
        try {
            const postData = req.body;

            const tableName_1 = ["inbounds as I", "inbound_products as IP", "products as P"];
            const joinType_1 = "INNER JOIN";
            const foreignKey_1 = [
                { "I.id": "IP.inbound_id" },
                { "P.id": "IP.product_id" }
            ];
            const selectFields_1 = ['P.name', 'P.sku', 'P.size', 'IP.id', 'IP.product_id', 'IP.inbound_id', 'I.challan_no', 'IP.is_rack', 'IP.suggested_rack', 'IP.stock', '(IP.stock*P.size) as total_size'];
            const WhereCon_1 = { 'IP.id': postData.id };
            const results_1 = await dbFunction.fetchData(tableName_1, joinType_1, foreignKey_1, selectFields_1, WhereCon_1);

            const selectFields_2 = ['id', 'name'];
            let whereCon_2 = ["name = '" + results_1[0].suggested_rack + "' ", "is_deleted = '0'"];
            var results_2 = await dbFunction.fetchData(RACKS, "", "", selectFields_2, whereCon_2);

            const editData = {
                'rack_id': results_2[0].id,
                'rack_completed': '1',
                'is_rack': '1',
                'suggested_rack	': ''
            };
            const updatewhereCon = ["id = '" + postData.id + "'"];
            await dbFunction.update(INBOUND_PRODUCTS, editData, updatewhereCon);

            await autoRackChoosen(results_1[0].inbound_id);

            let getIds = [];
            let getResults = [];

            const tableName_3 = ["inbounds as I", "inbound_products as IP", "products as P", "racks as R"];
            const joinType_3 = "INNER JOIN";
            const foreignKey_3 = [
                { "I.id": "IP.inbound_id" },
                { "P.id": "IP.product_id" },
                { "R.id": "IP.rack_id" }
            ];
            const selectFields_3 = ['R.name', 'R.capacity', 'P.sku', 'P.size', 'IP.id', 'IP.is_rack', 'IP.suggested_rack', 'IP.stock', '(IP.stock*P.size) as total_size'];
            const WhereCon_3 = { 'I.challan_no': results_1[0].challan_no };
            const results_3 = await dbFunction.fetchData(tableName_3, joinType_3, foreignKey_3, selectFields_3, WhereCon_3);

            if (results_3.length > 0) {
                results_3.forEach(element => {
                    getIds.push(element.id);
                    getResults.push(element);
                });
            }

            if (getIds.length > 0) {
                const tableName_4 = ["inbounds as I", "inbound_products as IP", "products as P"];
                const joinType_4 = "INNER JOIN";
                const foreignKey_4 = [
                    { "I.id": "IP.inbound_id" },
                    { "P.id": "IP.product_id" }
                ];
                const selectFields_4 = ['P.sku', 'P.size', 'IP.id', 'IP.is_rack', 'IP.suggested_rack', 'IP.stock', '(IP.stock*P.size) as total_size'];
                const WhereCon_4 = ["IP.id NOT IN (" + getIds + ") ", "I.challan_no = '" + results_1[0].challan_no + "'"];
                var results_4 = await dbFunction.fetchData(tableName_4, joinType_4, foreignKey_4, selectFields_4, WhereCon_4);

            } else {
                const tableName_4 = ["inbounds as I", "inbound_products as IP", "products as P"];
                const joinType_4 = "INNER JOIN";
                const foreignKey_4 = [
                    { "I.id": "IP.inbound_id" },
                    { "P.id": "IP.product_id" }
                ];
                const selectFields_4 = ['P.sku', 'P.size', 'IP.id', 'IP.is_rack', 'IP.stock', 'IP.suggested_rack', '(IP.stock*P.size) as total_size'];
                const WhereCon_4 = ["I.challan_no = '" + postData.challan_no + "'"];
                var results_4 = await dbFunction.fetchData(tableName_4, joinType_4, foreignKey_4, selectFields_4, WhereCon_4);

            }

            if (results_4.length > 0) {
                results_4.forEach(element2 => {
                    getResults.push(element2);
                });
            }

            getResults.sort(function (a, b) { return a.id - b.id; });

            //console.log(results_1);
            //console.log(results_2);
            //console.log(results_3);

            // const selectFields_4 = ['id', 'name'];
            // const whereCon_4 = ["id <> '"+results_2[0].id+"' ", "is_deleted = '0'" ];
            // const orderBy_4 = { coefficient: 'ASC' };
            // const results_4 = await dbFunction.fetchData(RACKS, "", "", selectFields_4, whereCon_4, orderBy_4);

            // var editData_1 = {
            //     'suggested_rack	': orderBy_4[0].name
            // };
            // results_2.forEach( element => {
            //     if(element.is_rack == '1'){
            //         var updatewhereCon_1 = ["id = '" + element.id + "'"];
            //     }
            // });
            // await dbFunction.update(INBOUND_PRODUCTS, editData_1, updatewhereCon_1);

            ejs.renderFile(path.join(__dirname, '../views/inbound_products.ejs'), { results: getResults }, {}).then(dataHtml => {
                return res.status(200).json({ status: 'success', html: dataHtml, message: results_1[0].name + ' Stock stores' });
            });

        } catch (error) {
            console.log(error);
            return res.status(400).json({ status: 'error', message: error.message });
        }
    },
    addProductSku: async (req, res) => {
        try {
            const postData = req.body;

            const whereCon = { status: '1', is_deleted: '0', sku: postData.sku };
            const result = await dbFunction.fetchData(PRODUCTS, "", "", "", whereCon);
            if (result.length === 1) {
                const whereCon_2 = { challan_no: postData.challan_no };
                const result_2 = await dbFunction.fetchData(INBOUNDS, "", "", "", whereCon_2);
                if (result_2.length === 1) {
                    const whereCon_3 = { product_id: result[0].id, inbound_id: result_2[0].id };
                    const orderBy_3 = { id: 'DESC' };
                    const result_3 = await dbFunction.fetchData(INBOUND_PRODUCTS, "", "", "", whereCon_3,orderBy_3);
                    if (result_3.length > 0) {
                        if(result_3[0].rack_completed == '0' && result_3[0].is_rack == '0'){
                            const stock_count = result_2[0].stock + 1;
                            const editData = {
                                'stock': stock_count
                            }
                            const updatewhereCon = { id: result_2[0].id };
                            await dbFunction.update(INBOUNDS, editData, updatewhereCon);

                            const stock_count_2 = result_3[0].stock + 1;
                            var rack_id = result_3[0].rack_id;
                            if (rack_id == '0') {
                                var rack_name = await rack_store_coefficient_calculate(stock_count_2, postData.sku, postData.challan_no);
                                if (rack_name) {
                                    var is_rack = '1';
                                } else {
                                    var is_rack = '0';
                                }
                            } else {
                                var is_rack = '0';
                                var rack_name = '';
                            }

                            const editData_2 = {
                                'stock': stock_count_2,
                                'product_id': result[0].id,
                                'inbound_id': result_2[0].id,
                                'is_rack': is_rack,
                                'suggested_rack	': rack_name
                            }
                            const updatewhereCon_2 = { id: result_3[0].id };
                            await dbFunction.update(INBOUND_PRODUCTS, editData_2, updatewhereCon_2);

                        }else{
                            const stock_count = result_2[0].stock + 1;
                            const editData = {
                                'stock': stock_count
                            }
                            const updatewhereCon = { id: result_2[0].id };
                            await dbFunction.update(INBOUNDS, editData, updatewhereCon);

                            const addData = {
                                'product_id': result[0].id,
                                'inbound_id': result_2[0].id,
                                'stock': '1',
                            }
                            await dbFunction.save(INBOUND_PRODUCTS, addData);
                        }
                    } else {
                        const stock_count = result_2[0].stock + 1;
                        const editData = {
                            'stock': stock_count
                        }
                        const updatewhereCon = { id: result_2[0].id };
                        await dbFunction.update(INBOUNDS, editData, updatewhereCon);

                        const addData = {
                            'product_id': result[0].id,
                            'inbound_id': result_2[0].id,
                            'stock': '1',
                        }
                        await dbFunction.save(INBOUND_PRODUCTS, addData);
                    }
                } else {
                    const addData = {
                        'challan_no': postData.challan_no,
                        'stock': '1',
                    }
                    const inboundId = await dbFunction.save(INBOUNDS, addData);

                    const addData_2 = {
                        'product_id': result[0].id,
                        'inbound_id': inboundId,
                        'stock': '1',
                    }
                    await dbFunction.save(INBOUND_PRODUCTS, addData_2);
                }

                const stock_count = result[0].stock + 1;
                const editData = {
                    'stock': stock_count,
                    'stock_status': '1'
                }
                const updatewhereCon = { sku: result[0].sku };
                await dbFunction.update(PRODUCTS, editData, updatewhereCon);

                let getIds = [];
                let getResults = [];

                const tableName_1 = ["inbounds as I", "inbound_products as IP", "products as P", "racks as R"];
                const joinType_1 = "INNER JOIN";
                const foreignKey_1 = [
                    { "I.id": "IP.inbound_id" },
                    { "P.id": "IP.product_id" },
                    { "R.id": "IP.rack_id" }
                ];
                const selectFields_1 = ['R.name', 'R.capacity', 'P.sku', 'P.size', 'IP.id', 'IP.is_rack', 'IP.suggested_rack', 'IP.stock', '(IP.stock*P.size) as total_size'];
                const WhereCon_1 = { 'I.challan_no': postData.challan_no };
                const results_1 = await dbFunction.fetchData(tableName_1, joinType_1, foreignKey_1, selectFields_1, WhereCon_1);

                if (results_1.length > 0) {
                    results_1.forEach(element => {
                        getIds.push(element.id);
                        getResults.push(element);
                    });
                }

                if (getIds.length > 0) {
                    const tableName_2 = ["inbounds as I", "inbound_products as IP", "products as P"];
                    const joinType_2 = "INNER JOIN";
                    const foreignKey_2 = [
                        { "I.id": "IP.inbound_id" },
                        { "P.id": "IP.product_id" }
                    ];
                    const selectFields_2 = ['P.sku', 'P.size', 'IP.id', 'IP.is_rack', 'IP.suggested_rack', 'IP.stock', '(IP.stock*P.size) as total_size'];
                    const WhereCon_2 = ["IP.id NOT IN (" + getIds + ") ", "I.challan_no = '" + postData.challan_no + "'"];
                    var results_2 = await dbFunction.fetchData(tableName_2, joinType_2, foreignKey_2, selectFields_2, WhereCon_2);

                } else {
                    const tableName_2 = ["inbounds as I", "inbound_products as IP", "products as P"];
                    const joinType_2 = "INNER JOIN";
                    const foreignKey_2 = [
                        { "I.id": "IP.inbound_id" },
                        { "P.id": "IP.product_id" }
                    ];
                    const selectFields_2 = ['P.sku', 'P.size', 'IP.id', 'IP.is_rack', 'IP.stock', 'IP.suggested_rack', '(IP.stock*P.size) as total_size'];
                    const WhereCon_2 = ["I.challan_no = '" + postData.challan_no + "'"];
                    var results_2 = await dbFunction.fetchData(tableName_2, joinType_2, foreignKey_2, selectFields_2, WhereCon_2);

                }

                if (results_2.length > 0) {
                    results_2.forEach(element2 => {
                        getResults.push(element2);
                    });
                }

                getResults.sort(function (a, b) { return a.id - b.id; });

                ejs.renderFile(path.join(__dirname, '../views/inbound_products.ejs'), { results: getResults }, {}).then(dataHtml => {
                    return res.status(200).json({ status: 'success', html: dataHtml, message: result[0].name + ' Stock inbround' });
                });

            } else {
                return res.status(203).json({ status: 'error', message: 'SKU does not match.' });
            }
        } catch (error) {
            console.log(error);
            return res.status(400).json({ status: 'error', message: error.message });
        }
    },
    getSuggestedSpaceLists: async (req, res) => {
        try {
            const postData = req.body;

            const whereCon_2 = { challan_no: postData.challan_no };
            const result_2 = await dbFunction.fetchData(INBOUNDS, "", "", "", whereCon_2);
            if (result_2.length === 1) {
                let getIds = [];
                let getResults = [];

                const tableName_1 = ["inbounds as I", "inbound_products as IP", "products as P", "racks as R"];
                const joinType_1 = "INNER JOIN";
                const foreignKey_1 = [
                    { "I.id": "IP.inbound_id" },
                    { "P.id": "IP.product_id" },
                    { "R.id": "IP.rack_id" }
                ];
                const selectFields_1 = ['R.name', 'R.capacity', 'P.name as product_name', 'P.sku', 'P.size', 'IP.id', 'IP.is_rack', 'IP.suggested_rack', 'IP.stock', '(IP.stock*P.size) as total_size'];
                const WhereCon_1 = { 'I.challan_no': postData.challan_no };
                const results_1 = await dbFunction.fetchData(tableName_1, joinType_1, foreignKey_1, selectFields_1, WhereCon_1);

                if (results_1.length > 0) {
                    results_1.forEach(element => {
                        getIds.push(element.id);
                        getResults.push(element);
                    });
                }

                if (getIds.length > 0) {
                    const tableName_2 = ["inbounds as I", "inbound_products as IP", "products as P"];
                    const joinType_2 = "INNER JOIN";
                    const foreignKey_2 = [
                        { "I.id": "IP.inbound_id" },
                        { "P.id": "IP.product_id" }
                    ];
                    const selectFields_2 = ['P.sku', 'P.name as product_name', 'P.size', 'IP.id', 'IP.is_rack', 'IP.suggested_rack', 'IP.stock', '(IP.stock*P.size) as total_size'];
                    const WhereCon_2 = ["IP.id NOT IN (" + getIds + ") ", "I.challan_no = '" + postData.challan_no + "'"];
                    var results_2 = await dbFunction.fetchData(tableName_2, joinType_2, foreignKey_2, selectFields_2, WhereCon_2);

                } else {
                    const tableName_2 = ["inbounds as I", "inbound_products as IP", "products as P"];
                    const joinType_2 = "INNER JOIN";
                    const foreignKey_2 = [
                        { "I.id": "IP.inbound_id" },
                        { "P.id": "IP.product_id" }
                    ];
                    const selectFields_2 = ['P.sku', 'P.name as product_name', 'P.size', 'IP.id', 'IP.is_rack', 'IP.stock', 'IP.suggested_rack', '(IP.stock*P.size) as total_size'];
                    const WhereCon_2 = ["I.challan_no = '" + postData.challan_no + "'"];
                    var results_2 = await dbFunction.fetchData(tableName_2, joinType_2, foreignKey_2, selectFields_2, WhereCon_2);

                }

                if (results_2.length > 0) {
                    results_2.forEach(element2 => {
                        getResults.push(element2);
                    });
                }

                getResults.sort(function (a, b) { return a.id - b.id; });

                //console.log(getResults);

                ejs.renderFile(path.join(__dirname, '../views/products_space_list.ejs'), { results: getResults }, {}).then(dataHtml => {
                    return res.status(200).json({ status: 'success', html: dataHtml, message: 'Challan no. has been match.' });
                });         

            } else {
                return res.status(203).json({ status: 'error', message: 'Challan no. does not match.' });
            }
        } catch (error) {
            console.log(error);
            return res.status(400).json({ status: 'error', message: error.message });
        }
    },
    errorPage: async (req, res) => {
        try {
            res.render('views/error.html', {
                page: 'error',
                errorStatus: ((req.query.errorStatus) ? req.query.errorStatus : ''),
                error: ((req.query.error) ? req.query.error : '')
            });
        } catch (error) {
            console.log(error);
            res.redirect('/error?error=' + encodeURIComponent(error.message) + '&errorStatus=400');
        }
    }
};

async function autoRackChoosen(inbound_id){
    const tableName = ["inbounds as I", "inbound_products as IP", "products as P"];
    const joinType = "INNER JOIN";
    const foreignKey = [
        { "I.id": "IP.inbound_id" },
        { "P.id": "IP.product_id" }
    ];
    const selectFields = ['IP.rack_id', 'IP.is_rack', 'IP.id', 'IP.inbound_id', 'IP.product_id', 'IP.stock', 'IP.suggested_rack', '(IP.stock*P.size) as total_size'];
    const WhereCon = { 'I.id': inbound_id };
    const results = await dbFunction.fetchData(tableName, joinType, foreignKey, selectFields, WhereCon);

    let getIds = [];
    results.forEach(element => {
        getIds.push(element.rack_id);
    });

    if (getIds.length > 0) {
        let whereCon_2 = ["id NOT IN (" + getIds + ") ", "is_deleted = '0'"];
        let orderBy_2 = { coefficient: 'ASC' };
        var results_2 = await dbFunction.fetchData(RACKS, "", "", "", whereCon_2, orderBy_2);
    } else {
        let whereCon_2 = ["is_deleted = '0'"];
        let orderBy_2 = { coefficient: 'ASC' };
        var results_2 = await dbFunction.fetchData(RACKS, "", "", "", whereCon_2, orderBy_2);
    }

    var rack_id = results_2[0].id;
    var rack_name = results_2[0].name;
    var capacity = results_2[0].capacity;
    var last_percentage = capacity * 90 / 100;

    // results.forEach(element => {
    //     if(element.is_rack == '1'){
    //         if (last_percentage >= element.total_size) {
    //             const editData = {
    //                 'is_rack': '1',
    //                 'suggested_rack	': rack_name
    //             };
    //             const updatewhereCon = ["id = '" + element.id + "'"];
    //             await dbFunction.update(INBOUND_PRODUCTS, editData, updatewhereCon);

    //         }else if(capacity >= element.total_size) {
    //             const editData = {
    //                 'is_rack': '1',
    //                 'suggested_rack	': ''
    //             };
    //             const updatewhereCon = ["id = '" + element.id + "'"];
    //             await dbFunction.update(INBOUND_PRODUCTS, editData, updatewhereCon);
           
    //         }else{
    //             const editData = {
    //                 'is_rack': '0',
    //                 'suggested_rack	': ''
    //             };
    //             const updatewhereCon = ["id = '" + element.id + "'"];
    //             await dbFunction.update(INBOUND_PRODUCTS, editData, updatewhereCon);
    //         }
    //     }
    // });

}

async function rack_store_coefficient_calculate(stock, sku, challan_no) {
    const tableName = ["inbounds as I", "inbound_products as IP", "products as P"];
    const joinType = "INNER JOIN";
    const foreignKey = [
        { "I.id": "IP.inbound_id" },
        { "P.id": "IP.product_id" }
    ];
    const selectFields = ['IP.rack_id'];
    const WhereCon = { 'I.challan_no': challan_no };
    const results = await dbFunction.fetchData(tableName, joinType, foreignKey, selectFields, WhereCon);

    let getIds = [];
    results.forEach(element => {
        getIds.push(element.rack_id);
    });

    const whereCon = { is_deleted: '0', sku: sku };
    const product_result = await dbFunction.fetchData(PRODUCTS, "", "", "", whereCon);
    var proSize = product_result[0].size * stock;

    if ((getIds)) {
        let whereCon_2 = ["id NOT IN (" + getIds + ") ", "is_deleted = '0'"];
        let orderBy_2 = { coefficient: 'ASC' };
        var results_2 = await dbFunction.fetchData(RACKS, "", "", "", whereCon_2, orderBy_2);
    } else {
        let whereCon_2 = ["is_deleted = '0'"];
        let orderBy_2 = { coefficient: 'ASC' };
        var results_2 = await dbFunction.fetchData(RACKS, "", "", "", whereCon_2, orderBy_2);
    }

    var rack_id = results_2[0].id;
    var rack_name = results_2[0].name;
    var capacity = results_2[0].capacity;
    var last_percentage = capacity * 90 / 100;

    if (last_percentage <= proSize && capacity >= proSize) {
        return rack_name;
    } else {
        return '';
    }
}

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}