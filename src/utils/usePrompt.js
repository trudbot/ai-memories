function compiled(template, data) {
  return template.replace(/{{([\s\S]+?)}}/g, (_, key) => JSON.stringify(data[key] || ""));
}

/**
 * 使用模板字符串编译prompt
 * @param {string|function} prompt - 模板字符串或函数
 * @param {Object} context - 上下文数据
 */
export default (prompt, context) => {
    if (typeof prompt === 'function') {
        return prompt(context);
    }
    if (typeof prompt === 'string' && context) {
        return compiled(prompt, context);
    }
    throw new Error('Prompt must be a string or a function');
}