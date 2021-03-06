"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt = require("bcrypt");
const config = require("config");
const models_1 = require("../../models");
const helper_1 = require("./helper");
const validate_1 = require("./validate");
const { signup, accountUpdate, queryByName, queryById: queryByIdValidate } = validate_1.default;
const saltRounds = config.get('saltRounds');
exports.signUp = async (ctx, _) => {
    const validateRes = helper_1.default.joiValite('request body')(ctx.body, signup);
    if (validateRes) {
        ctx.body = validateRes;
        return;
    }
    const { accountName, accountPwd } = ctx.body;
    const result = await models_1.accountModel.findOne({ accountName });
    if (result) {
        ctx.body = {
            status: false,
            message: '已存在该用户名'
        };
        return;
    }
    const hashPwd = await bcrypt.hash(accountPwd, saltRounds);
    const cResult = await models_1.accountModel.create({
        accountName,
        accountPwd: hashPwd
    });
    if (cResult.errors) {
        console.error('插入失败', cResult.errors);
        ctx.body = {
            status: false,
            message: '数据插入失败'
        };
    }
    else {
        ctx.body = {
            status: true,
            message: '数据插入成功'
        };
    }
};
exports.signIn = async (ctx, _) => {
    const validateRes = helper_1.default.joiValite('request body')(ctx.body, signup);
    if (validateRes) {
        ctx.body = validateRes;
        return;
    }
    const { accountName, accountPwd } = ctx.body;
    const res = await models_1.accountModel.findOne({
        accountName,
        accountPwd: helper_1.default.md5Encrypt(accountPwd)
    });
    if (!res) {
        ctx.body = {
            status: false,
            message: '用户名或密码出错'
        };
        return;
    }
    ctx.body = {
        status: true,
        message: '登录成功'
    };
    return;
};
exports.update = async (ctx, _) => {
    const validateRes = helper_1.default.joiValite('request body')(ctx.body, accountUpdate);
    if (validateRes) {
        ctx.body = validateRes;
        return;
    }
    const { accountName, accountPwd, newPwd } = ctx.body;
    const res = await models_1.accountModel.findOne({
        accountName,
        accountPwd: helper_1.default.md5Encrypt(accountPwd)
    });
    if (!res) {
        ctx.body = {
            status: false,
            message: '用户名或密码出错'
        };
        return;
    }
    const uRes = await models_1.accountModel.updateOne({ accountName }, { accountPwd: helper_1.default.md5Encrypt(newPwd) });
    if (uRes.errors) {
        ctx.body = {
            status: false,
            message: '更新失败'
        };
        return;
    }
    ctx.body = {
        status: true,
        message: '数据更新成功'
    };
    return;
};
exports.queryAccount = async (ctx, _) => {
    try {
        const validateRes = helper_1.default.joiValite('request query')(ctx.query, queryByName);
        if (validateRes) {
            ctx.body = validateRes;
            return;
        }
        const { name } = ctx.request.query;
        const result = await models_1.accountModel.findOne({
            accountName: name
        });
        ctx.body = result;
    }
    catch (error) {
        throw error;
    }
};
exports.queryById = async (ctx, _) => {
    try {
        const validateRes = helper_1.default.joiValite('request query')(ctx.request.query, queryByIdValidate);
        if (validateRes) {
            ctx.body = validateRes;
            return;
        }
        const { id } = ctx.request.query;
        const result = await models_1.accountModel.findById({
            _id: id
        });
        ctx.body = result;
    }
    catch (error) {
        throw error;
    }
};
